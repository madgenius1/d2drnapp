/**
 * Firestore database service
 */

import {
    collection,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    QueryConstraint,
    setDoc,
    updateDoc,
    where
} from 'firebase/firestore';
import type { Order, OrderStatus, Route, UserProfile } from '../types';
import { COLLECTIONS } from '../utils/constants';
import { db } from './firebase';

/**
 * Create a new user profile
 */
export const createUserProfile = async (
  profile: Omit<UserProfile, 'id'> & { id: string }
): Promise<void> => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, profile.id);
    await setDoc(userRef, {
      ...profile,
      createdAt: profile.createdAt || Date.now(),
    });
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

/**
 * Get user profile by ID
 */
export const getUserProfile = async (
  userId: string
): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  userId: string,
  updates: Partial<Omit<UserProfile, 'id' | 'createdAt'>>
): Promise<void> => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(userRef, updates);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

/**
 * Get all routes - now returns empty array (routes are local only)
 */
export const getRoutes = async (): Promise<Route[]> => {
  // Routes are now stored locally, not in Firestore
  console.warn('getRoutes called but routes are now local only');
  return [];
};

/**
 * Get a single route by ID
 */
export const getRoute = async (routeId: string): Promise<Route | null> => {
  // Routes are now local - find in local data
  const { routes } = await import('../data/routes');
  const route = routes.find((r) => r.name === routeId);
  return route || null;
};

/**
 * Create a new order
 */
export const createOrder = async (
  orderData: Omit<Order, 'id' | 'createdAt'>
): Promise<string> => {
  try {
    const ordersRef = collection(db, COLLECTIONS.ORDERS);
    const newOrderRef = doc(ordersRef);

    const order: Order = {
      ...orderData,
      id: newOrderRef.id,
      createdAt: Date.now(),
    };

    await setDoc(newOrderRef, order);
    return newOrderRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

/**
 * Get orders for a specific user
 */
export const getUserOrders = async (
  userId: string,
  statusFilter?: OrderStatus
): Promise<Order[]> => {
  try {
    const ordersRef = collection(db, COLLECTIONS.ORDERS);
    const constraints: QueryConstraint[] = [
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
    ];

    if (statusFilter) {
      constraints.splice(1, 0, where('status', '==', statusFilter));
    }

    const q = query(ordersRef, ...constraints);
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[];
  } catch (error) {
    console.error('Error getting user orders:', error);
    throw error;
  }
};

/**
 * Get a single order by ID
 */
export const getOrder = async (orderId: string): Promise<Order | null> => {
  try {
    const orderRef = doc(db, COLLECTIONS.ORDERS, orderId);
    const orderSnap = await getDoc(orderRef);

    if (orderSnap.exists()) {
      return { id: orderSnap.id, ...orderSnap.data() } as Order;
    }
    return null;
  } catch (error) {
    console.error('Error getting order:', error);
    throw error;
  }
};

/**
 * Update order status
 */
export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus
): Promise<void> => {
  try {
    const orderRef = doc(db, COLLECTIONS.ORDERS, orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

/**
 * Update order
 */
export const updateOrder = async (
  orderId: string,
  updates: Partial<Omit<Order, 'id' | 'createdAt' | 'userId'>>
): Promise<void> => {
  try {
    const orderRef = doc(db, COLLECTIONS.ORDERS, orderId);
    await updateDoc(orderRef, {
      ...updates,
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

/**
 * Add rating to completed order
 */
export const rateOrder = async (
  orderId: string,
  rating: number,
  comment?: string
): Promise<void> => {
  try {
    const orderRef = doc(db, COLLECTIONS.ORDERS, orderId);
    await updateDoc(orderRef, {
      rating,
      ratingComment: comment || null,
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.error('Error rating order:', error);
    throw error;
  }
};

/**
 * Subscribe to order updates (real-time listener)
 */
export const subscribeToOrder = (
  orderId: string,
  callback: (order: Order | null) => void
): (() => void) => {
  const orderRef = doc(db, COLLECTIONS.ORDERS, orderId);

  const unsubscribe = onSnapshot(
    orderRef,
    (snapshot) => {
      if (snapshot.exists()) {
        callback({ id: snapshot.id, ...snapshot.data() } as Order);
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error('Error subscribing to order:', error);
      callback(null);
    }
  );

  return unsubscribe;
};

/**
 * Subscribe to user orders (real-time listener)
 */
export const subscribeToUserOrders = (
  userId: string,
  callback: (orders: Order[]) => void,
  statusFilter?: OrderStatus
): (() => void) => {
  const ordersRef = collection(db, COLLECTIONS.ORDERS);
  const constraints: QueryConstraint[] = [
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  ];

  if (statusFilter) {
    constraints.splice(1, 0, where('status', '==', statusFilter));
  }

  const q = query(ordersRef, ...constraints);

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const orders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];
      callback(orders);
    },
    (error) => {
      console.error('Error subscribing to user orders:', error);
      callback([]);
    }
  );

  return unsubscribe;
};