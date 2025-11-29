/**
 * Firestore Service
 * Handles all Firestore database operations with proper error handling
 */

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import type {
  CreateDeliveryOrderData,
  CreateErrandOrderData,
  Order,
  OrderFilters,
  OrderResult,
  UpdateOrderData,
} from '../../types';
import { db } from './config';

class FirestoreService {
  /**
   * Check if Firestore is initialized
   */
  private checkDb() {
    if (!db) {
      throw new Error('[Firestore] Database not initialized');
    }
    return db;
  }

  /**
   * Subscribe to user's orders (real-time updates)
   */
  subscribeToUserOrders(
    userId: string,
    callback: (orders: Order[]) => void,
    filters?: OrderFilters
  ): Unsubscribe {
    try {
      const firestore = this.checkDb();
      const ordersRef = collection(firestore, 'orders');

      // Build query
      let q = query(
        ordersRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      // Apply filters if provided
      if (filters?.status) {
        q = query(q, where('status', '==', filters.status));
      }

      // Subscribe to changes
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const orders: Order[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
            updatedAt: doc.data().updatedAt?.toDate(),
          })) as Order[];

          callback(orders);
        },
        (error) => {
          console.error('[Firestore] Error in orders subscription:', error);
          // Return empty array on error
          callback([]);
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error('[Firestore] Error setting up subscription:', error);
      // Return empty callback and no-op unsubscribe
      callback([]);
      return () => {};
    }
  }

  /**
   * Subscribe to a single order
   */
  subscribeToOrder(
    orderId: string,
    callback: (order: Order | null) => void
  ): Unsubscribe {
    try {
      const firestore = this.checkDb();
      const orderRef = doc(firestore, 'orders', orderId);

      const unsubscribe = onSnapshot(
        orderRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const order: Order = {
              id: snapshot.id,
              ...snapshot.data(),
              createdAt: snapshot.data().createdAt?.toDate() || new Date(),
              updatedAt: snapshot.data().updatedAt?.toDate(),
            } as Order;
            callback(order);
          } else {
            callback(null);
          }
        },
        (error) => {
          console.error('[Firestore] Error in order subscription:', error);
          callback(null);
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error('[Firestore] Error setting up order subscription:', error);
      callback(null);
      return () => {};
    }
  }

  /**
   * Get all orders for a user
   */
  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const firestore = this.checkDb();
      const ordersRef = collection(firestore, 'orders');
      const q = query(
        ordersRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Order[];
    } catch (error) {
      console.error('[Firestore] Error fetching orders:', error);
      return [];
    }
  }

  /**
   * Get a single order
   */
  async getOrder(orderId: string): Promise<OrderResult> {
    try {
      const firestore = this.checkDb();
      const orderRef = doc(firestore, 'orders', orderId);
      const snapshot = await getDoc(orderRef);

      if (!snapshot.exists()) {
        return {
          success: false,
          error: 'Order not found',
        };
      }

      const order: Order = {
        id: snapshot.id,
        ...snapshot.data(),
        createdAt: snapshot.data().createdAt?.toDate() || new Date(),
        updatedAt: snapshot.data().updatedAt?.toDate(),
      } as Order;

      return {
        success: true,
        order,
      };
    } catch (error: any) {
      console.error('[Firestore] Error fetching order:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch order',
      };
    }
  }

  /**
   * Create delivery order
   */
  async createDeliveryOrder(
    userId: string,
    data: CreateDeliveryOrderData,
    priceBreakdown: any
  ): Promise<OrderResult> {
    try {
      const firestore = this.checkDb();
      const ordersRef = collection(firestore, 'orders');

      const orderData = {
        userId,
        type: 'delivery' as const,
        status: 'scheduled' as const,
        pickup: {
          routeId: data.pickupRouteId,
          stopId: data.pickupStopId,
          routeName: '',
          stopName: '',
          fullAddress: '',
          date: data.pickupDate,
          time: data.pickupTime,
        },
        dropoff: {
          routeId: data.dropoffRouteId,
          stopId: data.dropoffStopId,
          routeName: '',
          stopName: '',
          fullAddress: '',
        },
        recipient: {
          name: data.recipientName,
          phone: data.recipientPhone,
        },
        payment: {
          method: data.paymentMethod,
          status: data.paymentMethod === 'payNow' ? 'pending' : 'unpaid',
          amount: priceBreakdown.total,
        },
        pricing: priceBreakdown,
        // Optional fields with safe access
        itemDescription: (data as any).itemDescription || (data as any).itemDetails || '',
        isFragile: (data as any).isFragile || false,
        specialInstructions: (data as any).additionalNotes || (data as any).specialInstructions || '',
        // Required fields from type
        pickupDate: data.pickupDate,
        pickupTime: data.pickupTime,
        paymentMethod: data.paymentMethod,
        paymentStatus: data.paymentMethod === 'payNow' ? 'pending' : 'unpaid',
        totalAmount: priceBreakdown.total,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(ordersRef, orderData);

      console.log('[Firestore] Delivery order created:', docRef.id);

      return {
        success: true,
        order: {
          id: docRef.id,
          ...orderData,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as unknown as Order,
      };
    } catch (error: any) {
      console.error('[Firestore] Error creating delivery order:', error);
      return {
        success: false,
        error: error.message || 'Failed to create order',
      };
    }
  }

  /**
   * Create errand order
   */
  async createErrandOrder(
    userId: string,
    data: CreateErrandOrderData,
    priceBreakdown: any
  ): Promise<OrderResult> {
    try {
      const firestore = this.checkDb();
      const ordersRef = collection(firestore, 'orders');

      const orderData = {
        userId,
        type: 'errand' as const,
        status: 'scheduled' as const,
        pickup: {
          routeId: data.pickupRouteId,
          stopId: data.pickupStopId,
          routeName: '',
          stopName: '',
          fullAddress: '',
          date: data.pickupDate,
          time: data.pickupTime,
        },
        dropoff: {
          routeId: data.dropoffRouteId,
          stopId: data.dropoffStopId,
          routeName: '',
          stopName: '',
          fullAddress: '',
        },
        recipient: {
          name: data.recipientName,
          phone: data.recipientPhone,
        },
        payment: {
          method: data.paymentMethod,
          status: data.paymentMethod === 'payNow' ? 'pending' : 'unpaid',
          amount: priceBreakdown.total,
        },
        pricing: priceBreakdown,
        errandDescription: data.errandDescription,
        estimatedBudget: data.estimatedBudget,
        specialInstructions: data.additionalNotes || '',
        // Required fields from type
        pickupDate: data.pickupDate,
        pickupTime: data.pickupTime,
        paymentMethod: data.paymentMethod,
        paymentStatus: data.paymentMethod === 'payNow' ? 'pending' : 'unpaid',
        totalAmount: priceBreakdown.total,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(ordersRef, orderData);

      console.log('[Firestore] Errand order created:', docRef.id);

      return {
        success: true,
        order: {
          id: docRef.id,
          ...orderData,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as unknown as Order,
      };
    } catch (error: any) {
      console.error('[Firestore] Error creating errand order:', error);
      return {
        success: false,
        error: error.message || 'Failed to create errand order',
      };
    }
  }

  /**
   * Update order
   */
  async updateOrder(
    orderId: string,
    updates: UpdateOrderData
  ): Promise<OrderResult> {
    try {
      const firestore = this.checkDb();
      const orderRef = doc(firestore, 'orders', orderId);

      await updateDoc(orderRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });

      console.log('[Firestore] Order updated:', orderId);

      // Fetch updated order
      return await this.getOrder(orderId);
    } catch (error: any) {
      console.error('[Firestore] Error updating order:', error);
      return {
        success: false,
        error: error.message || 'Failed to update order',
      };
    }
  }

  /**
   * Delete order
   */
  async deleteOrder(orderId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const firestore = this.checkDb();
      const orderRef = doc(firestore, 'orders', orderId);

      await deleteDoc(orderRef);

      console.log('[Firestore] Order deleted:', orderId);

      return { success: true };
    } catch (error: any) {
      console.error('[Firestore] Error deleting order:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete order',
      };
    }
  }
}

// Export singleton instance
const firestoreService = new FirestoreService();
export default firestoreService;