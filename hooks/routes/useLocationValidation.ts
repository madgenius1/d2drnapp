/**
 * useLocationValidation Hook
 * Validates location selections and prevents same pickup/dropoff
 */

import { useCallback, useMemo } from 'react';
import { isSameStop, isSameRoute } from '../../data/routes/routeHelpers';

/**
 * Location validation result
 */
interface LocationValidationResult {
  isValid: boolean;
  isSameStop: boolean;
  isSameRoute: boolean;
  error?: string;
}

/**
 * Hook for location validation
 */
export const useLocationValidation = () => {
  /**
   * Validate pickup and dropoff locations
   */
  const validateLocations = useCallback((
    pickupRouteId: string,
    pickupStopId: string,
    dropoffRouteId: string,
    dropoffStopId: string
  ): LocationValidationResult => {
    // Check if all fields are provided
    if (!pickupRouteId || !pickupStopId || !dropoffRouteId || !dropoffStopId) {
      return {
        isValid: false,
        isSameStop: false,
        isSameRoute: false,
        error: 'Please select both pickup and dropoff locations',
      };
    }

    // Check if same route
    const sameRoute = isSameRoute(pickupRouteId, dropoffRouteId);

    // Check if same stop
    const sameStop = isSameStop(
      pickupRouteId,
      pickupStopId,
      dropoffRouteId,
      dropoffStopId
    );

    if (sameStop) {
      return {
        isValid: false,
        isSameStop: true,
        isSameRoute: sameRoute,
        error: '⚠️ Pickup and drop-off cannot be the same location',
      };
    }

    return {
      isValid: true,
      isSameStop: false,
      isSameRoute: sameRoute,
    };
  }, []);

  /**
   * Check if locations are same (convenience method)
   */
  const areSameLocations = useCallback((
    pickupRouteId: string,
    pickupStopId: string,
    dropoffRouteId: string,
    dropoffStopId: string
  ): boolean => {
    return isSameStop(pickupRouteId, pickupStopId, dropoffRouteId, dropoffStopId);
  }, []);

  /**
   * Check if locations are on same route
   */
  const areOnSameRoute = useCallback((
    pickupRouteId: string,
    dropoffRouteId: string
  ): boolean => {
    return isSameRoute(pickupRouteId, dropoffRouteId);
  }, []);

  /**
   * Get validation error message
   */
  const getValidationError = useCallback((
    pickupRouteId: string,
    pickupStopId: string,
    dropoffRouteId: string,
    dropoffStopId: string
  ): string | null => {
    const result = validateLocations(
      pickupRouteId,
      pickupStopId,
      dropoffRouteId,
      dropoffStopId
    );

    return result.error || null;
  }, [validateLocations]);

  return {
    validateLocations,
    areSameLocations,
    areOnSameRoute,
    getValidationError,
  };
};