/**
 * useDifferentRoutePricing Hook
 * React hook for calculating prices when pickup and dropoff are on different routes
 * Uses dataSetOne (CBD-centric pricing)
 */

import { useCallback } from 'react';
import { 
  calculateDifferentRoutePriceWithBreakdown, 
  validateDifferentRouteInputs 
} from '../../utils/calculations/differentRouteCalculator';
import { DifferentRoutePriceBreakdown } from '../../types/models/PriceBreakdown';

/**
 * Result type for different route pricing calculation
 */
interface DifferentRoutePricingResult {
  breakdown: DifferentRoutePriceBreakdown | null;
  isValid: boolean;
  error?: string;
}

/**
 * Hook for different route pricing calculations
 */
export const useDifferentRoutePricing = () => {
  /**
   * Calculate price for different route order
   */
  const calculatePrice = useCallback((
    pickupStopName: string,
    dropoffStopName: string
  ): DifferentRoutePricingResult => {
    // Validate inputs
    const validation = validateDifferentRouteInputs(pickupStopName, dropoffStopName);
    
    if (!validation.isValid) {
      return {
        breakdown: null,
        isValid: false,
        error: validation.error,
      };
    }
    
    // Calculate price breakdown
    const breakdown = calculateDifferentRoutePriceWithBreakdown(
      pickupStopName,
      dropoffStopName
    );
    
    if (!breakdown) {
      return {
        breakdown: null,
        isValid: false,
        error: 'Could not calculate price. Please check your stop selections.',
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
    pickupStopName: string,
    dropoffStopName: string
  ): number | null => {
    const result = calculatePrice(pickupStopName, dropoffStopName);
    return result.breakdown?.total ?? null;
  }, [calculatePrice]);

  return {
    calculatePrice,
    getTotalPrice,
  };
};