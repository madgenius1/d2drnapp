/**
 * Hook for calculating same-route delivery pricing
 * Uses dataSetTwo and web calculator formula
 */

import { useMemo } from 'react';
import type { Route } from '../types';
import { calculateSameRoutePrice } from '../utils/pricing';

interface UseSameRouteParams {
  route: Route | null;
  pickupStopName: string | null;
  dropoffStopName: string | null;
}

interface UseSameRouteResult {
  price: number;
  pickupPrice: number;
  dropoffPrice: number;
  isValid: boolean;
  error: string | null;
}

/**
 * Calculate pricing for same-route deliveries
 * Formula: Math.trunc((pickupPrice + dropoffPrice) / 1.8 + 50)
 */
export const useSameRoute = ({
  route,
  pickupStopName,
  dropoffStopName,
}: UseSameRouteParams): UseSameRouteResult => {
  return useMemo(() => {
    // Validation
    if (!route) {
      return {
        price: 0,
        pickupPrice: 0,
        dropoffPrice: 0,
        isValid: false,
        error: 'No route selected',
      };
    }

    if (!pickupStopName || !dropoffStopName) {
      return {
        price: 0,
        pickupPrice: 0,
        dropoffPrice: 0,
        isValid: false,
        error: 'Both pickup and dropoff stops must be selected',
      };
    }

    if (pickupStopName === dropoffStopName) {
      return {
        price: 0,
        pickupPrice: 0,
        dropoffPrice: 0,
        isValid: false,
        error: 'Pickup and dropoff stops cannot be the same',
      };
    }

    // Calculate price using dataSetTwo
    const result = calculateSameRoutePrice(
      route.name,
      pickupStopName,
      dropoffStopName
    );

    if (!result) {
      return {
        price: 0,
        pickupPrice: 0,
        dropoffPrice: 0,
        isValid: false,
        error: 'Invalid stop selection or stops not found in route',
      };
    }

    return {
      price: result.price,
      pickupPrice: result.pickupPrice,
      dropoffPrice: result.dropoffPrice,
      isValid: true,
      error: null,
    };
  }, [route, pickupStopName, dropoffStopName]);
};