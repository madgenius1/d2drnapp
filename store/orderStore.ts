/**
 * Order Store (Zustand)
 * Manages global order state
 */

import { create } from 'zustand';
import type { Order, OrderFilters } from '../types';

interface OrderState {
  // State
  orders: Order[];
  selectedOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  filters: OrderFilters;

  // Actions
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrder: (orderId: string, order: Order) => void;
  removeOrder: (orderId: string) => void;
  selectOrder: (order: Order | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setFilters: (filters: OrderFilters) => void;
  clearFilters: () => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  // Initial state
  orders: [],
  selectedOrder: null,
  isLoading: false,
  error: null,
  filters: {},

  // Set all orders
  setOrders: (orders) => {
    set({ orders });
  },

  // Add new order
  addOrder: (order) => {
    set((state) => ({
      orders: [order, ...state.orders],
    }));
  },

  // Update existing order
  updateOrder: (orderId, updatedOrder) => {
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId ? updatedOrder : order
      ),
    }));
  },

  // Remove order
  removeOrder: (orderId) => {
    set((state) => ({
      orders: state.orders.filter((order) => order.id !== orderId),
      selectedOrder:
        state.selectedOrder?.id === orderId ? null : state.selectedOrder,
    }));
  },

  // Select order for details view
  selectOrder: (order) => {
    set({ selectedOrder: order });
  },

  // Set loading state
  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  // Set error
  setError: (error) => {
    set({ error });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Set filters
  setFilters: (filters) => {
    set({ filters });
  },

  // Clear filters
  clearFilters: () => {
    set({ filters: {} });
  },
}));

export default useOrderStore;