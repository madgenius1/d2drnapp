/**
 * Hook for calculating different-route delivery pricing
 * Uses dataSetOne and web calculator formula
 */

import { useMemo } from 'react';
import type { Route } from '../types';
import { calculateDifferentRoutePrice } from '../utils/pricing';

interface UseDifferentRouteParams {
  pickupRoute: Route | null;
  pickupStopName: string | null;
  dropoffRoute: Route | null;
  dropoffStopName: string | null;
}

interface UseDifferentRouteResult {
  price: number;
  pickupPrice: number;
  dropoffPrice: number;
  isValid: boolean;
  error: string | null;
}

/**
 * Calculate pricing for different-route deliveries
 * Formula: Math.trunc((pickupPrice + dropoffPrice) / 2 + 50)
 */
export const useDifferentRoute = ({
  pickupRoute,
  pickupStopName,
  dropoffRoute,
  dropoffStopName,
}: UseDifferentRouteParams): UseDifferentRouteResult => {
  return useMemo(() => {
    // Validation
    if (!pickupRoute || !dropoffRoute) {
      return {
        price: 0,
        pickupPrice: 0,
        dropoffPrice: 0,
        isValid: false,
        error: 'Both routes must be selected',
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

    // Calculate price using dataSetOne
    const result = calculateDifferentRoutePrice(
      pickupStopName,
      dropoffStopName
    );

    if (!result) {
      return {
        price: 0,
        pickupPrice: 0,
        dropoffPrice: 0,
        isValid: false,
        error: 'Invalid stop selection or stops not found in dataset',
      };
    }

    return {
      price: result.price,
      pickupPrice: result.pickupPrice,
      dropoffPrice: result.dropoffPrice,
      isValid: true,
      error: null,
    };
  }, [pickupRoute, pickupStopName, dropoffRoute, dropoffStopName]);
};