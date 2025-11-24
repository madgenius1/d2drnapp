/**
 * usePriceBreakdown Hook
 * Master pricing hook that combines both same-route and different-route calculations
 * Auto-detects which calculation to use based on route selection
 */

import { useCallback, useMemo } from 'react';
import { useSameRoutePricing } from './useSameRoutePricing';
import { useDifferentRoutePricing } from './useDifferentRoutePricing';
import { PriceBreakdown } from '../../types/models/PriceBreakdown';
import { CURRENCY } from '../../data/constants/appConstants';

/**
 * Price breakdown input
 */
interface PriceBreakdownInput {
  pickupRouteId: string;
  pickupRouteName: string;
  pickupStopName: string;
  dropoffRouteId: string;
  dropoffRouteName: string;
  dropoffStopName: string;
}

/**
 * Price breakdown result
 */
interface PriceBreakdownResult {
  priceBreakdown: PriceBreakdown | null;
  isValid: boolean;
  error?: string;
}

/**
 * Master pricing hook
 */
export const usePriceBreakdown = () => {
  const { calculatePrice: calculateSameRoute } = useSameRoutePricing();
  const { calculatePrice: calculateDifferentRoute } = useDifferentRoutePricing();

  /**
   * Get complete price breakdown
   */
  const getPriceBreakdown = useCallback((
    input: PriceBreakdownInput
  ): PriceBreakdownResult => {
    const {
      pickupRouteId,
      pickupRouteName,
      pickupStopName,
      dropoffRouteId,
      dropoffRouteName,
      dropoffStopName,
    } = input;

    // Check if all required fields are present
    if (!pickupRouteId || !pickupStopName || !dropoffRouteId || !dropoffStopName) {
      return {
        priceBreakdown: null,
        isValid: false,
        error: 'Please select both pickup and dropoff locations',
      };
    }

    // Determine if same route or different routes
    const isSameRoute = pickupRouteId === dropoffRouteId;

    if (isSameRoute) {
      // Use same route calculation
      const result = calculateSameRoute(pickupRouteName, pickupStopName, dropoffStopName);

      if (!result.isValid || !result.breakdown) {
        return {
          priceBreakdown: null,
          isValid: false,
          error: result.error || 'Failed to calculate price',
        };
      }

      // Convert to unified PriceBreakdown format
      const priceBreakdown: PriceBreakdown = {
        isSameRoute: true,
        pickupCost: result.breakdown.pickupStopPrice,
        dropoffCost: result.breakdown.dropoffStopPrice,
        transferFee: 0, // No transfer fee for same route
        baseAmount: result.breakdown.baseCalculation,
        fixedFee: result.breakdown.fixedFee,
        total: result.breakdown.total,
        currency: CURRENCY,
        breakdown: result.breakdown,
      };

      return {
        priceBreakdown,
        isValid: true,
      };
    } else {
      // Use different route calculation
      const result = calculateDifferentRoute(pickupStopName, dropoffStopName);

      if (!result.isValid || !result.breakdown) {
        return {
          priceBreakdown: null,
          isValid: false,
          error: result.error || 'Failed to calculate price',
        };
      }

      // Convert to unified PriceBreakdown format
      const priceBreakdown: PriceBreakdown = {
        isSameRoute: false,
        pickupCost: result.breakdown.pickupStopPrice,
        dropoffCost: result.breakdown.dropoffStopPrice,
        transferFee: result.breakdown.baseCalculation, // Transfer fee is the base calculation
        baseAmount: result.breakdown.baseCalculation,
        fixedFee: result.breakdown.fixedFee,
        total: result.breakdown.total,
        currency: CURRENCY,
        breakdown: result.breakdown,
      };

      return {
        priceBreakdown,
        isValid: true,
      };
    }
  }, [calculateSameRoute, calculateDifferentRoute]);

  /**
   * Get only total price (convenience method)
   */
  const getTotalPrice = useCallback((
    input: PriceBreakdownInput
  ): number | null => {
    const result = getPriceBreakdown(input);
    return result.priceBreakdown?.total ?? null;
  }, [getPriceBreakdown]);

  /**
   * Format price for display
   */
  const formatPrice = useCallback((price: number | null): string => {
    if (price === null) {
      return 'N/A';
    }
    return `${CURRENCY} ${price.toLocaleString()}`;
  }, []);

  return {
    getPriceBreakdown,
    getTotalPrice,
    formatPrice,
  };
};