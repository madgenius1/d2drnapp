/**
 * usePricing Hook
 * Calculates order pricing based on routes and stops
 * Implements same-route and different-route pricing formulas
 */

import { useCallback } from 'react';
import { dataSetOne } from '../data/dataSetOne';
import { dataSetTwo } from '../data/dataSetTwo';
import type { PricingResult } from '../types';

export const usePricing = () => {
  /**
   * Get price from dataSetOne (CBD-centric pricing)
   */
  const getPriceFromDataSetOne = useCallback((stopName: string): number => {
    const stop = dataSetOne.find(
      (s) => s.stopName.toLowerCase() === stopName.toLowerCase()
    );
    return stop?.price || 0;
  }, []);

  /**
   * Get price from dataSetTwo (route-specific pricing)
   */
  const getPriceFromDataSetTwo = useCallback(
    (routeName: string, stopName: string): number => {
      const route = dataSetTwo.find(
        (r) => r.routeName.toLowerCase() === routeName.toLowerCase()
      );
      if (!route) return 0;

      const stop = route.stops.find(
        (s) => s.stopName.toLowerCase() === stopName.toLowerCase()
      );
      return stop?.price || 0;
    },
    []
  );

  /**
   * Calculate price for same route
   * Formula: Math.trunc((pickupPrice + dropoffPrice) / 1.8 + 50)
   */
  const calculateSameRoutePrice = useCallback(
    (routeName: string, pickupStopName: string, dropoffStopName: string): PricingResult => {
      const pickupPrice = getPriceFromDataSetTwo(routeName, pickupStopName);
      const dropoffPrice = getPriceFromDataSetTwo(routeName, dropoffStopName);

      if (pickupPrice === 0 || dropoffPrice === 0) {
        return {
          pickupCost: 0,
          transferFee: 0,
          dropoffCost: 0,
          total: 0,
          isSameRoute: true,
          formula: 'Error: Stop not found in route',
        };
      }

      const total = Math.trunc((pickupPrice + dropoffPrice) / 1.8 + 50);

      return {
        pickupCost: pickupPrice,
        transferFee: 0,
        dropoffCost: dropoffPrice,
        total,
        isSameRoute: true,
        formula: `(${pickupPrice} + ${dropoffPrice}) / 1.8 + 60 = ${total}`,
      };
    },
    [getPriceFromDataSetTwo]
  );

  /**
   * Calculate price for different routes
   * Formula: Math.trunc((pickupPrice + dropoffPrice) / 2 + 60)
   */
  const calculateDifferentRoutePrice = useCallback(
    (
      pickupStopName: string,
      dropoffStopName: string
    ): PricingResult => {
      const pickupPrice = getPriceFromDataSetOne(pickupStopName);
      const dropoffPrice = getPriceFromDataSetOne(dropoffStopName);

      if (pickupPrice === 0 || dropoffPrice === 0) {
        return {
          pickupCost: 0,
          transferFee: 0,
          dropoffCost: 0,
          total: 0,
          isSameRoute: false,
          formula: 'Error: Stop not found in pricing data',
        };
      }

      const total = Math.trunc((pickupPrice + dropoffPrice) / 2 + 60);
      const transferFee = 50; // Fixed transfer fee for different routes

      return {
        pickupCost: pickupPrice,
        transferFee,
        dropoffCost: dropoffPrice,
        total,
        isSameRoute: false,
        formula: `(${pickupPrice} + ${dropoffPrice}) / 2 + 50 = ${total}`,
      };
    },
    [getPriceFromDataSetOne]
  );

  /**
   * Get price breakdown based on route selection
   * Main function used by order creation forms
   */
  const getPriceBreakdown = useCallback(
    (
      pickupRouteName: string,
      pickupStopName: string,
      dropoffRouteName: string,
      dropoffStopName: string
    ): PricingResult => {
      // Check if same route
      const isSameRoute =
        pickupRouteName.toLowerCase() === dropoffRouteName.toLowerCase();

      if (isSameRoute) {
        return calculateSameRoutePrice(
          pickupRouteName,
          pickupStopName,
          dropoffStopName
        );
      } else {
        return calculateDifferentRoutePrice(pickupStopName, dropoffStopName);
      }
    },
    [calculateSameRoutePrice, calculateDifferentRoutePrice]
  );

  /**
   * Validate if pricing data exists for given stops
   */
  const validatePricingData = useCallback(
    (
      pickupRouteName: string,
      pickupStopName: string,
      dropoffRouteName: string,
      dropoffStopName: string
    ): { isValid: boolean; error?: string } => {
      const isSameRoute =
        pickupRouteName.toLowerCase() === dropoffRouteName.toLowerCase();

      if (isSameRoute) {
        const pickupPrice = getPriceFromDataSetTwo(
          pickupRouteName,
          pickupStopName
        );
        const dropoffPrice = getPriceFromDataSetTwo(
          pickupRouteName,
          dropoffStopName
        );

        if (pickupPrice === 0) {
          return {
            isValid: false,
            error: `Pickup stop "${pickupStopName}" not found in ${pickupRouteName}`,
          };
        }
        if (dropoffPrice === 0) {
          return {
            isValid: false,
            error: `Dropoff stop "${dropoffStopName}" not found in ${dropoffRouteName}`,
          };
        }
      } else {
        const pickupPrice = getPriceFromDataSetOne(pickupStopName);
        const dropoffPrice = getPriceFromDataSetOne(dropoffStopName);

        if (pickupPrice === 0) {
          return {
            isValid: false,
            error: `Pickup stop "${pickupStopName}" not found in pricing data`,
          };
        }
        if (dropoffPrice === 0) {
          return {
            isValid: false,
            error: `Dropoff stop "${dropoffStopName}" not found in pricing data`,
          };
        }
      }

      return { isValid: true };
    },
    [getPriceFromDataSetOne, getPriceFromDataSetTwo]
  );

  /**
   * Calculate estimated delivery time (placeholder)
   */
  const getEstimatedDeliveryTime = useCallback(
    (pickupRouteName: string, dropoffRouteName: string): string => {
      const isSameRoute =
        pickupRouteName.toLowerCase() === dropoffRouteName.toLowerCase();

      if (isSameRoute) {
        return '60-90 minutes';
      } else {
        return '90-120 minutes';
      }
    },
    []
  );

  return {
    getPriceBreakdown,
    calculateSameRoutePrice,
    calculateDifferentRoutePrice,
    validatePricingData,
    getEstimatedDeliveryTime,
  };
};

export default usePricing;