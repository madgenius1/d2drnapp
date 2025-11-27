/**
 * Firestore Database Service
 * Handles all Firestore CRUD operations for orders and users
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
    serverTimestamp,
    setDoc,
    Timestamp,
    updateDoc,
    where
} from 'firebase/firestore';
import type {
    CreateDeliveryOrderData,
    CreateErrandOrderData,
    DeliveryOrder,
    ErrandOrder,
    Order,
    OrderFilters,
    OrderResult,
    OrdersResult,
    UpdateOrderData,
    User,
} from '../../types';
import { firestore } from './config';

// Collections
const COLLECTIONS = {
  USERS: 'users',
  ORDERS: 'orders',
  ROUTES: 'routes',
} as const;

/**
 * Generate unique order ID
 */
const generateOrderId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return `D2D-${timestamp}-${random}`.toUpperCase();
};

/**
 * Convert Firestore timestamp to ISO string
 */
const timestampToISO = (timestamp: any): string => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toISOString();
  }
  if (timestamp?.toDate) {
    return timestamp.toDate().toISOString();
  }
  return new Date().toISOString();
};

/**
 * Create a new delivery order
 */
export const createDeliveryOrder = async (
  userId: string,
  data: CreateDeliveryOrderData,
  priceBreakdown: any
): Promise<OrderResult> => {
  try {
    const orderId = generateOrderId();
    const orderRef = doc(firestore, COLLECTIONS.ORDERS, orderId);

    const orderData: Omit<DeliveryOrder, 'id'> = {
      userId,
      type: 'delivery',
      status: 'scheduled',
      pickup: {
        routeId: data.pickupRouteId,
        routeName: '', // Will be filled by caller
        stopId: data.pickupStopId,
        stopName: '', // Will be filled by caller
        fullAddress: '',
      },
      pickupDate: data.pickupDate,
      pickupTime: data.pickupTime,
      dropoff: {
        routeId: data.dropoffRouteId,
        routeName: '', // Will be filled by caller
        stopId: data.dropoffStopId,
        stopName: '', // Will be filled by caller
        fullAddress: '',
      },
      recipient: {
        name: data.recipientName,
        phone: data.recipientPhone,
      },
      itemDescription: data.itemDescription,
      isFragile: data.isFragile,
      specialNotes: data.specialNotes || '',
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentMethod === 'payNow' ? 'pending' : 'pending',
      totalPrice: priceBreakdown.total,
      priceBreakdown,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(orderRef, {
      ...orderData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Update user stats
    await updateUserStats(userId, 'totalOrders', 1);
    await updateUserStats(userId, 'pendingOrders', 1);

    const order: DeliveryOrder = {
      id: orderId,
      ...orderData,
    };

    return {
      success: true,
      order,
    };
  } catch (error) {
    console.error('[Firestore] Create delivery order error:', error);
    return {
      success: false,
      error: 'Failed to create order. Please try again.',
    };
  }
};

/**
 * Create a new errand order
 */
export const createErrandOrder = async (
  userId: string,
  data: CreateErrandOrderData,
  priceBreakdown: any
): Promise<OrderResult> => {
  try {
    const orderId = generateOrderId();
    const orderRef = doc(firestore, COLLECTIONS.ORDERS, orderId);

    const orderData: Omit<ErrandOrder, 'id'> = {
      userId,
      type: 'errand',
      status: 'scheduled',
      pickup: {
        routeId: data.pickupRouteId,
        routeName: '',
        stopId: data.pickupStopId,
        stopName: '',
        fullAddress: '',
      },
      pickupDate: data.pickupDate,
      pickupTime: data.pickupTime,
      dropoff: {
        routeId: data.dropoffRouteId,
        routeName: '',
        stopId: data.dropoffStopId,
        stopName: '',
        fullAddress: '',
      },
      recipient: {
        name: data.recipientName,
        phone: data.recipientPhone,
      },
      errandDescription: data.errandDescription,
      estimatedBudget: data.estimatedBudget,
      additionalNotes: data.additionalNotes,
      isFragile: false,
      paymentMethod: data.paymentMethod,
      paymentStatus: 'pending',
      totalPrice: priceBreakdown.total,
      priceBreakdown,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(orderRef, {
      ...orderData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Update user stats
    await updateUserStats(userId, 'totalOrders', 1);
    await updateUserStats(userId, 'pendingOrders', 1);

    const order: ErrandOrder = {
      id: orderId,
      ...orderData,
    };

    return {
      success: true,
      order,
    };
  } catch (error) {
    console.error('[Firestore] Create errand order error:', error);
    return {
      success: false,
      error: 'Failed to create errand order. Please try again.',
    };
  }
};

/**
 * Get single order by ID
 */
export const getOrder = async (orderId: string): Promise<OrderResult> => {
  try {
    const orderRef = doc(firestore, COLLECTIONS.ORDERS, orderId);
    const orderSnap = await getDoc(orderRef);

    if (!orderSnap.exists()) {
      return {
        success: false,
        error: 'Order not found',
      };
    }

    const data = orderSnap.data();
    const order: Order = {
      id: orderSnap.id,
      ...data,
      createdAt: timestampToISO(data.createdAt),
      updatedAt: timestampToISO(data.updatedAt),
      pickedAt: data.pickedAt ? timestampToISO(data.pickedAt) : undefined,
      deliveredAt: data.deliveredAt ? timestampToISO(data.deliveredAt) : undefined,
      completedAt: data.completedAt ? timestampToISO(data.completedAt) : undefined,
      cancelledAt: data.cancelledAt ? timestampToISO(data.cancelledAt) : undefined,
    } as Order;

    return {
      success: true,
      order,
    };
  } catch (error) {
    console.error('[Firestore] Get order error:', error);
    return {
      success: false,
      error: 'Failed to fetch order',
    };
  }
};

/**
 * Get all orders for a user with optional filters
 */
export const getUserOrders = async (
  userId: string,
  filters?: OrderFilters
): Promise<OrdersResult> => {
  try {
    const ordersRef = collection(firestore, COLLECTIONS.ORDERS);
    const constraints: QueryConstraint[] = [where('userId', '==', userId)];

    // Apply filters
    if (filters?.status && filters.status.length > 0) {
      constraints.push(where('status', 'in', filters.status));
    }

    if (filters?.type && filters.type.length > 0) {
      constraints.push(where('type', 'in', filters.type));
    }

    // Order by creation date (newest first)
    constraints.push(orderBy('createdAt', 'desc'));

    const q = query(ordersRef, ...constraints);
    const querySnapshot = await getDocs(q);

    const orders: Order[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: timestampToISO(data.createdAt),
        updatedAt: timestampToISO(data.updatedAt),
        pickedAt: data.pickedAt ? timestampToISO(data.pickedAt) : undefined,
        deliveredAt: data.deliveredAt ? timestampToISO(data.deliveredAt) : undefined,
        completedAt: data.completedAt ? timestampToISO(data.completedAt) : undefined,
        cancelledAt: data.cancelledAt ? timestampToISO(data.cancelledAt) : undefined,
      } as Order;
    });

    return {
      success: true,
      orders,
    };
  } catch (error) {
    console.error('[Firestore] Get user orders error:', error);
    return {
      success: false,
      error: 'Failed to fetch orders',
      orders: [],
    };
  }
};

/**
 * Update order
 */
export const updateOrder = async (
  orderId: string,
  updates: UpdateOrderData
): Promise<OrderResult> => {
  try {
    const orderRef = doc(firestore, COLLECTIONS.ORDERS, orderId);

    const updateData: any = {
      ...updates,
      updatedAt: serverTimestamp(),
    };

    // Add status-specific timestamps
    if (updates.status === 'picked') {
      updateData.pickedAt = serverTimestamp();
    } else if (updates.status === 'dropped') {
      updateData.deliveredAt = serverTimestamp();
    } else if (updates.status === 'completed') {
      updateData.completedAt = serverTimestamp();
    } else if (updates.status === 'cancelled') {
      updateData.cancelledAt = serverTimestamp();
    }

    await updateDoc(orderRef, updateData);

    // Fetch updated order
    return await getOrder(orderId);
  } catch (error) {
    console.error('[Firestore] Update order error:', error);
    return {
      success: false,
      error: 'Failed to update order',
    };
  }
};

/**
 * Delete order (soft delete by marking as cancelled)
 */
export const deleteOrder = async (orderId: string): Promise<OrderResult> => {
  try {
    return await updateOrder(orderId, { status: 'cancelled' });
  } catch (error) {
    console.error('[Firestore] Delete order error:', error);
    return {
      success: false,
      error: 'Failed to delete order',
    };
  }
};

/**
 * Subscribe to order changes (real-time)
 */
export const subscribeToOrder = (
  orderId: string,
  callback: (order: Order | null) => void
): (() => void) => {
  const orderRef = doc(firestore, COLLECTIONS.ORDERS, orderId);

  return onSnapshot(
    orderRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const order: Order = {
          id: snapshot.id,
          ...data,
          createdAt: timestampToISO(data.createdAt),
          updatedAt: timestampToISO(data.updatedAt),
          pickedAt: data.pickedAt ? timestampToISO(data.pickedAt) : undefined,
          deliveredAt: data.deliveredAt ? timestampToISO(data.deliveredAt) : undefined,
          completedAt: data.completedAt ? timestampToISO(data.completedAt) : undefined,
        } as Order;
        callback(order);
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error('[Firestore] Subscribe to order error:', error);
      callback(null);
    }
  );
};

/**
 * Subscribe to user orders (real-time)
 */
export const subscribeToUserOrders = (
  userId: string,
  callback: (orders: Order[]) => void,
  filters?: OrderFilters
): (() => void) => {
  const ordersRef = collection(firestore, COLLECTIONS.ORDERS);
  const constraints: QueryConstraint[] = [where('userId', '==', userId)];

  if (filters?.status && filters.status.length > 0) {
    constraints.push(where('status', 'in', filters.status));
  }

  constraints.push(orderBy('createdAt', 'desc'));

  const q = query(ordersRef, ...constraints);

  return onSnapshot(
    q,
    (snapshot) => {
      const orders: Order[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: timestampToISO(data.createdAt),
          updatedAt: timestampToISO(data.updatedAt),
          pickedAt: data.pickedAt ? timestampToISO(data.pickedAt) : undefined,
          deliveredAt: data.deliveredAt ? timestampToISO(data.deliveredAt) : undefined,
          completedAt: data.completedAt ? timestampToISO(data.completedAt) : undefined,
        } as Order;
      });
      callback(orders);
    },
    (error) => {
      console.error('[Firestore] Subscribe to user orders error:', error);
      callback([]);
    }
  );
};

/**
 * Update user statistics
 */
const updateUserStats = async (
  userId: string,
  field: keyof User['stats'],
  increment: number
): Promise<void> => {
  try {
    const userRef = doc(firestore, COLLECTIONS.USERS, userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const currentStats = userSnap.data().stats || {};
      const newValue = (currentStats[field] || 0) + increment;

      await updateDoc(userRef, {
        [`stats.${field}`]: newValue,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('[Firestore] Update user stats error:', error);
  }
};

export default {
  createDeliveryOrder,
  createErrandOrder,
  getOrder,
  getUserOrders,
  updateOrder,
  deleteOrder,
  subscribeToOrder,
  subscribeToUserOrders,
};