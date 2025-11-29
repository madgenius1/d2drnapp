/**
 * useOrders Hook
 * Manages order operations and state
 * Integrates Firestore with Zustand store
 */

import { useCallback, useEffect } from 'react';
import googleSheetsService from '../services/api/googleSheets.service';
import firestoreService from '../services/firebase/firestore.service';
import { useAuthStore } from '../store/authStore';
import { useOrderStore } from '../store/orderStore';
import type {
  CreateDeliveryOrderData,
  CreateErrandOrderData,
  Order,
  OrderResult,
  UpdateOrderData
} from '../types';

export const useOrders = () => {
  const {
    orders,
    selectedOrder,
    isLoading,
    error,
    filters,
    setOrders,
    addOrder,
    updateOrder: updateOrderInStore,
    removeOrder,
    selectOrder,
    setLoading,
    setError,
    clearError,
    setFilters,
  } = useOrderStore();

  const { user } = useAuthStore();

  /**
   * Subscribe to user's orders (real-time)
   */
  useEffect(() => {
    if (!user) {
      setOrders([]);
      return;
    }

    setLoading(true);

    // Add error handling for Firestore subscription
    let unsubscribe: (() => void) | undefined;

    try {
      unsubscribe = firestoreService.subscribeToUserOrders(
        user.id,
        (orders) => {
          setOrders(orders);
          setLoading(false);
        },
        filters
      );
    } catch (error) {
      console.error('[useOrders] Error subscribing to orders:', error);
      // Set empty orders and stop loading on error
      setOrders([]);
      setLoading(false);
      // Don't set error state - just fail silently for now
    }

    return () => {
      if (unsubscribe) {
        try {
          unsubscribe();
        } catch (error) {
          console.warn('[useOrders] Error unsubscribing:', error);
        }
      }
    };
  }, [user?.id, filters]);

  /**
   * Create delivery order
   */
  const createDeliveryOrder = async (
    data: CreateDeliveryOrderData,
    priceBreakdown: any,
    locationDetails: {
      pickupRouteName: string;
      pickupStopName: string;
      dropoffRouteName: string;
      dropoffStopName: string;
    }
  ): Promise<OrderResult> => {
    if (!user) {
      return {
        success: false,
        error: 'User not authenticated',
      };
    }

    try {
      setLoading(true);
      clearError();

      // Create order in Firestore
      const result = await firestoreService.createDeliveryOrder(
        user.id,
        data,
        priceBreakdown
      );

      if (result.success && result.order) {
        // Fill in location details
        const completeOrder: Order = {
          ...result.order,
          pickup: {
            ...result.order.pickup,
            routeName: locationDetails.pickupRouteName,
            stopName: locationDetails.pickupStopName,
            fullAddress: `${locationDetails.pickupRouteName} - ${locationDetails.pickupStopName}`,
          },
          dropoff: {
            ...result.order.dropoff,
            routeName: locationDetails.dropoffRouteName,
            stopName: locationDetails.dropoffStopName,
            fullAddress: `${locationDetails.dropoffRouteName} - ${locationDetails.dropoffStopName}`,
          },
        };

        // Update order in Firestore with complete details
        await firestoreService.updateOrder(completeOrder.id, {
          pickup: completeOrder.pickup,
          dropoff: completeOrder.dropoff,
        } as any);

        // Add to local store
        addOrder(completeOrder);

        // Log to Google Sheets (fire and forget)
        googleSheetsService
          .logOrderToSheet(completeOrder, user.email)
          .catch((error) => {
            console.warn('[useOrders] Failed to log to Google Sheets:', error);
          });

        setLoading(false);
        return {
          success: true,
          order: completeOrder,
        };
      } else {
        setError(result.error || 'Failed to create order');
        setLoading(false);
        return result;
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to create order';
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Create errand order
   */
  const createErrandOrder = async (
    data: CreateErrandOrderData,
    priceBreakdown: any,
    locationDetails: {
      pickupRouteName: string;
      pickupStopName: string;
      dropoffRouteName: string;
      dropoffStopName: string;
    }
  ): Promise<OrderResult> => {
    if (!user) {
      return {
        success: false,
        error: 'User not authenticated',
      };
    }

    try {
      setLoading(true);
      clearError();

      const result = await firestoreService.createErrandOrder(
        user.id,
        data,
        priceBreakdown
      );

      if (result.success && result.order) {
        const completeOrder: Order = {
          ...result.order,
          pickup: {
            ...result.order.pickup,
            routeName: locationDetails.pickupRouteName,
            stopName: locationDetails.pickupStopName,
            fullAddress: `${locationDetails.pickupRouteName} - ${locationDetails.pickupStopName}`,
          },
          dropoff: {
            ...result.order.dropoff,
            routeName: locationDetails.dropoffRouteName,
            stopName: locationDetails.dropoffStopName,
            fullAddress: `${locationDetails.dropoffRouteName} - ${locationDetails.dropoffStopName}`,
          },
        };

        await firestoreService.updateOrder(completeOrder.id, {
          pickup: completeOrder.pickup,
          dropoff: completeOrder.dropoff,
        } as any);

        addOrder(completeOrder);

        googleSheetsService
          .logOrderToSheet(completeOrder, user.email)
          .catch((error) => {
            console.warn('[useOrders] Failed to log to Google Sheets:', error);
          });

        setLoading(false);
        return {
          success: true,
          order: completeOrder,
        };
      } else {
        setError(result.error || 'Failed to create errand order');
        setLoading(false);
        return result;
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to create errand order';
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Get single order by ID
   */
  const getOrder = async (orderId: string): Promise<OrderResult> => {
    try {
      setLoading(true);
      const result = await firestoreService.getOrder(orderId);
      
      if (result.success && result.order) {
        selectOrder(result.order);
      }
      
      setLoading(false);
      return result;
    } catch (error: any) {
      setLoading(false);
      return {
        success: false,
        error: error.message || 'Failed to fetch order',
      };
    }
  };

  /**
   * Update order
   */
  const updateOrder = async (
    orderId: string,
    updates: UpdateOrderData
  ): Promise<OrderResult> => {
    try {
      setLoading(true);
      clearError();

      const result = await firestoreService.updateOrder(orderId, updates);

      if (result.success && result.order) {
        updateOrderInStore(orderId, result.order);
        
        if (selectedOrder?.id === orderId) {
          selectOrder(result.order);
        }
      } else {
        setError(result.error || 'Failed to update order');
      }

      setLoading(false);
      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update order';
      setError(errorMessage);
      setLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Cancel order
   */
  const cancelOrder = async (orderId: string): Promise<OrderResult> => {
    return await updateOrder(orderId, { status: 'cancelled' });
  };

  /**
   * Get orders by filter
   */
  const getFilteredOrders = useCallback(
    (filterType: 'all' | 'pending' | 'in_progress' | 'completed') => {
      switch (filterType) {
        case 'pending':
          return orders.filter((o) => o.status === 'scheduled');
        case 'in_progress':
          return orders.filter((o) =>
            ['picked', 'onTheWay'].includes(o.status)
          );
        case 'completed':
          return orders.filter((o) =>
            ['dropped', 'completed'].includes(o.status)
          );
        default:
          return orders;
      }
    },
    [orders]
  );

  /**
   * Get order statistics
   */
  const getOrderStats = useCallback(() => {
    return {
      total: orders.length,
      created: orders.filter((o) => o.status === 'scheduled').length,
      pending: orders.filter((o) =>
        ['scheduled', 'picked'].includes(o.status)
      ).length,
      inProgress: orders.filter((o) =>
        ['picked', 'onTheWay'].includes(o.status)
      ).length,
      completed: orders.filter((o) =>
        ['dropped', 'completed'].includes(o.status)
      ).length,
      cancelled: orders.filter((o) => o.status === 'cancelled').length,
    };
  }, [orders]);

  /**
   * Subscribe to single order updates
   */
  const subscribeToOrder = useCallback(
    (orderId: string, callback: (order: Order | null) => void) => {
      return firestoreService.subscribeToOrder(orderId, callback);
    },
    []
  );

  return {
    // State
    orders,
    selectedOrder,
    isLoading,
    error,
    filters,

    // Actions
    createDeliveryOrder,
    createErrandOrder,
    getOrder,
    updateOrder,
    cancelOrder,
    selectOrder,
    setFilters,
    clearError,

    // Computed
    getFilteredOrders,
    getOrderStats,
    subscribeToOrder,
  };
};

export default useOrders;