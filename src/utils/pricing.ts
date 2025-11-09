/**
 * Core pricing calculation functions
 * Matches web calculator logic exactly
 */

import { dataSetOne } from '../data/dataSetOne';
import { dataSetTwo } from '../data/dataSetTwo';
import { PRICING_DEFAULTS } from './constants';

export interface PriceCalculation {
  price: number;
  pickupPrice: number;
  dropoffPrice: number;
}

/**
 * Find stop price in dataSetOne (CBD-centric pricing)
 * Used for different-route calculations
 */
export const findStopPriceInDataSetOne = (stopName: string): number | null => {
  const stop = dataSetOne.find((s) => s.stopName === stopName);
  return stop ? stop.price : null;
};

/**
 * Find stop price in dataSetTwo (route-specific pricing)
 * Used for same-route calculations
 */
export const findStopPriceInDataSetTwo = (
  routeName: string,
  stopName: string
): number | null => {
  const route = dataSetTwo.find((r) => r.routeName === routeName);
  if (!route) return null;
  
  const stop = route.stops.find((s) => s.stopName === stopName);
  return stop ? stop.price : null;
};

/**
 * Calculate price for same-route delivery
 * Formula: Math.trunc((pickupPrice + dropoffPrice) / 1.8 + 50)
 * Uses dataSetTwo
 */
export const calculateSameRoutePrice = (
  routeName: string,
  pickupStopName: string,
  dropoffStopName: string
): PriceCalculation | null => {
  const pickupPrice = findStopPriceInDataSetTwo(routeName, pickupStopName);
  const dropoffPrice = findStopPriceInDataSetTwo(routeName, dropoffStopName);

  if (pickupPrice === null || dropoffPrice === null) {
    return null;
  }

  const price = Math.trunc(
    (pickupPrice + dropoffPrice) / PRICING_DEFAULTS.SAME_ROUTE_DIVISOR +
      PRICING_DEFAULTS.BASE_FEE
  );

  return {
    price,
    pickupPrice,
    dropoffPrice,
  };
};

/**
 * Calculate price for different-route delivery
 * Formula: Math.trunc((pickupPrice + dropoffPrice) / 2 + 50)
 * Uses dataSetOne
 */
export const calculateDifferentRoutePrice = (
  pickupStopName: string,
  dropoffStopName: string
): PriceCalculation | null => {
  const pickupPrice = findStopPriceInDataSetOne(pickupStopName);
  const dropoffPrice = findStopPriceInDataSetOne(dropoffStopName);

  if (pickupPrice === null || dropoffPrice === null) {
    return null;
  }

  const price = Math.trunc(
    (pickupPrice + dropoffPrice) / PRICING_DEFAULTS.DIFFERENT_ROUTE_DIVISOR +
      PRICING_DEFAULTS.BASE_FEE
  );

  return {
    price,
    pickupPrice,
    dropoffPrice,
  };
};

/**
 * Calculate price based on route and stop selections
 * Automatically determines if same or different route
 */
export const calculatePrice = (
  pickupRouteName: string,
  pickupStopName: string,
  dropoffRouteName: string,
  dropoffStopName: string
): PriceCalculation | null => {
  // Same route calculation
  if (pickupRouteName === dropoffRouteName) {
    return calculateSameRoutePrice(
      pickupRouteName,
      pickupStopName,
      dropoffStopName
    );
  }

  // Different route calculation
  return calculateDifferentRoutePrice(pickupStopName, dropoffStopName);
};