/**
 * Order Slice - Zustand
 * Order management state
 */

import { StateCreator } from 'zustand';
import { Order, OrderStatus, CreateOrderRequest, OrderStats } from '../../types/models/Order';
import { mockOrders } from '../../data/mock/mockOrders';

export interface OrderSlice {
  // State
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadOrders: () => Promise<void>;
  getOrderById: (orderId: string) => Order | undefined;
  createOrder: (request: CreateOrderRequest) => Promise<{ success: boolean; order?: Order; error?: string }>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
  getOrderStats: () => OrderStats;
  setCurrentOrder: (order: Order | null) => void;
}

export const createOrderSlice: StateCreator<OrderSlice> = (set, get) => ({
  // Initial state
  orders: mockOrders,
  currentOrder: null,
  isLoading: false,
  error: null,

  // Load orders
  loadOrders: async () => {
    set({ isLoading: true, error: null });

    try {
      // TODO: Replace with actual Firestore fetch
      await new Promise(resolve => setTimeout(resolve, 500));

      set({
        orders: mockOrders,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to load orders',
        isLoading: false,
      });
    }
  },

  // Get order by ID
  getOrderById: (orderId: string) => {
    const { orders } = get();
    return orders.find(order => order.id === orderId);
  },

  // Create new order
  createOrder: async (request: CreateOrderRequest) => {
    set({ isLoading: true, error: null });

    try {
      // TODO: Replace with actual Firestore creation
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newOrder: Order = {
        id: 'ORD-' + Date.now(),
        type: 'order',
        userId: request.userId,
        pickupLocation: request.pickupLocation,
        dropoffLocation: request.dropoffLocation,
        recipient: request.recipient,
        item: request.item,
        instructions: request.instructions,
        schedule: request.schedule,
        priceBreakdown: request.priceBreakdown,
        totalPrice: request.totalPrice,
        paymentMethod: request.paymentMethod,
        paymentStatus: 'pending' as any,
        status: OrderStatus.CREATED,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      set(state => ({
        orders: [newOrder, ...state.orders],
        isLoading: false,
      }));

      return {
        success: true,
        order: newOrder,
      };
    } catch (error: any) {
      set({
        error: error.message || 'Failed to create order',
        isLoading: false,
      });

      return {
        success: false,
        error: error.message || 'Failed to create order',
      };
    }
  },

  // Update order status
  updateOrderStatus: async (orderId: string, status: OrderStatus) => {
    try {
      // TODO: Replace with actual Firestore update
      await new Promise(resolve => setTimeout(resolve, 500));

      set(state => ({
        orders: state.orders.map(order =>
          order.id === orderId
            ? { ...order, status, updatedAt: new Date().toISOString() }
            : order
        ),
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to update order status' });
    }
  },

  // Cancel order
  cancelOrder: async (orderId: string) => {
    try {
      await get().updateOrderStatus(orderId, OrderStatus.CANCELLED);
    } catch (error: any) {
      set({ error: error.message || 'Failed to cancel order' });
    }
  },

  // Get order statistics
  getOrderStats: () => {
    const { orders } = get();

    return {
      created: orders.filter(o => o.status === OrderStatus.CREATED).length,
      pending: orders.filter(o =>
        [OrderStatus.PICKED, OrderStatus.IN_TRANSIT].includes(o.status)
      ).length,
      completed: orders.filter(o => o.status === OrderStatus.DELIVERED).length,
      total: orders.length,
    };
  },

  // Set current order
  setCurrentOrder: (order: Order | null) => {
    set({ currentOrder: order });
  },
});