/**
 * useSameRoutePricing Hook
 * React hook for calculating prices when pickup and dropoff are on the same route
 * Uses dataSetTwo (route-specific pricing)
 */

import { useCallback } from 'react';
import { 
  calculateSameRoutePriceWithBreakdown, 
  validateSameRouteInputs 
} from '../../utils/calculations/sameRouteCalculator';
import { SameRoutePriceBreakdown } from '../../types/models/PriceBreakdown';

/**
 * Result type for same route pricing calculation
 */
interface SameRoutePricingResult {
  breakdown: SameRoutePriceBreakdown | null;
  isValid: boolean;
  error?: string;
}

/**
 * Hook for same route pricing calculations
 */
export const useSameRoutePricing = () => {
  /**
   * Calculate price for same route order
   */
  const calculatePrice = useCallback((
    routeName: string,
    pickupStopName: string,
    dropoffStopName: string
  ): SameRoutePricingResult => {
    // Validate inputs
    const validation = validateSameRouteInputs(routeName, pickupStopName, dropoffStopName);
    
    if (!validation.isValid) {
      return {
        breakdown: null,
        isValid: false,
        error: validation.error,
      };
    }
    
    // Calculate price breakdown
    const breakdown = calculateSameRoutePriceWithBreakdown(
      routeName,
      pickupStopName,
      dropoffStopName
    );
    
    if (!breakdown) {
      return {
        breakdown: null,
        isValid: false,
        error: 'Could not calculate price. Please check your route and stop selections.',
      };
    }
    
    return {
      breakdown,
      isValid: true,
    };
  }, []);

  /**
   * Get only the total price (convenience method)
   */
  const getTotalPrice = useCallback((
    routeName: string,
    pickupStopName: string,
    dropoffStopName: string
  ): number | null => {
    const result = calculatePrice(routeName, pickupStopName, dropoffStopName);
    return result.breakdown?.total ?? null;
  }, [calculatePrice]);

  return {
    calculatePrice,
    getTotalPrice,
  };
};