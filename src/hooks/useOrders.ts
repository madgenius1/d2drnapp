/**
 * Hook for fetching and managing user orders
 */

import { useEffect, useState } from 'react';
import { subscribeToUserOrders } from '../services/firestore';
import type { Order, OrderStatus } from '../types';

interface UseOrdersParams {
  userId: string | null;
  statusFilter?: OrderStatus;
}

interface UseOrdersResult {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

/**
 * Subscribe to user orders with real-time updates
 */
export const useOrders = ({
  userId,
  statusFilter,
}: UseOrdersParams): UseOrdersResult => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToUserOrders(
      userId,
      (fetchedOrders) => {
        setOrders(fetchedOrders);
        setLoading(false);
      },
      statusFilter
    );

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [userId, statusFilter]);

  return {
    orders,
    loading,
    error,
  };
};