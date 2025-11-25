/**
 * Combined Zustand Store
 * Combines all store slices into a single store
 */

import { create } from 'zustand';
import { createAuthSlice, AuthSlice } from './slices/authSlice';
import { createRouteSlice, RouteSlice } from './slices/routeSlice';
import { createOrderSlice, OrderSlice } from './slices/orderSlice';
import { createAppSlice, AppSlice } from './slices/appSlice';

// Combined store type
type StoreState = AuthSlice & RouteSlice & OrderSlice & AppSlice;

// Create combined store
export const useAppStore = create<StoreState>()((...a) => ({
  ...createAuthSlice(...a),
  ...createRouteSlice(...a),
  ...createOrderSlice(...a),
  ...createAppSlice(...a),
}));

// Separate store hooks for convenience
export const useAuthStore = () =>
  useAppStore(state => ({
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    login: state.login,
    register: state.register,
    logout: state.logout,
    setUser: state.setUser,
    setToken: state.setToken,
    clearError: state.clearError,
  }));

export const useRouteStore = () =>
  useAppStore(state => ({
    routes: state.routes,
    isLoading: state.isLoading,
    error: state.error,
    loadRoutes: state.loadRoutes,
    getRouteById: state.getRouteById,
    getStopById: state.getStopById,
    getStopsByRoute: state.getStopsByRoute,
  }));

export const useOrderStore = () =>
  useAppStore(state => ({
    orders: state.orders,
    currentOrder: state.currentOrder,
    isLoading: state.isLoading,
    error: state.error,
    loadOrders: state.loadOrders,
    getOrderById: state.getOrderById,
    createOrder: state.createOrder,
    updateOrderStatus: state.updateOrderStatus,
    cancelOrder: state.cancelOrder,
    getOrderStats: state.getOrderStats,
    setCurrentOrder: state.setCurrentOrder,
  }));

export const useAppSettings = () =>
  useAppStore(state => ({
    isOnboardingComplete: state.isOnboardingComplete,
    theme: state.theme,
    errandTemplates: state.errandTemplates,
    completeOnboarding: state.completeOnboarding,
    setTheme: state.setTheme,
    getErrandTemplates: state.getErrandTemplates,
  }));

// Initialize routes on store creation
useAppStore.getState().loadRoutes();