/**
 * Same Route Calculator
 * Handles price calculation for orders where pickup and dropoff are on the same route
 * Uses dataSetTwo (route-specific pricing)
 */

import { dataSetTwo, RouteWithPrices } from '../../data/dataSetTwo';
import { normalizeStopName } from '../../data/routes/routeHelpers';
import { SameRoutePriceBreakdown } from '../../types/models/PriceBreakdown';
import { calculateSameRoutePrice, getPricingFormula } from './priceCalculator';
import { PRICING, CURRENCY } from '../../data/constants/appConstants';

/**
 * Find stop price in dataSetTwo
 */
const findStopPriceInRoute = (
  routeName: string,
  stopName: string
): number | null => {
  const normalizedStopName = normalizeStopName(stopName);
  
  // Find the route
  const route = dataSetTwo.find(r => r.routeName === routeName);
  
  if (!route) {
    console.warn(`Route not found in dataSetTwo: ${routeName}`);
    return null;
  }
  
  // Find the stop within the route
  const stop = route.stops.find(s => 
    normalizeStopName(s.stopName) === normalizedStopName
  );
  
  if (!stop) {
    console.warn(`Stop not found in route ${routeName}: ${stopName}`);
    return null;
  }
  
  return stop.price;
};

/**
 * Calculate same route price with breakdown
 */
export const calculateSameRoutePriceWithBreakdown = (
  routeName: string,
  pickupStopName: string,
  dropoffStopName: string
): SameRoutePriceBreakdown | null => {
  // Get prices from dataSetTwo
  const pickupPrice = findStopPriceInRoute(routeName, pickupStopName);
  const dropoffPrice = findStopPriceInRoute(routeName, dropoffStopName);
  
  if (pickupPrice === null || dropoffPrice === null) {
    console.error('Could not find prices for stops', {
      routeName,
      pickupStopName,
      dropoffStopName,
    });
    return null;
  }
  
  // Calculate using formula: (pickup + dropoff) / 1.8 + 50
  const baseCalculation = (pickupPrice + dropoffPrice) / PRICING.SAME_ROUTE_DIVISOR;
  const total = calculateSameRoutePrice(pickupPrice, dropoffPrice);
  
  return {
    pickupStopPrice: pickupPrice,
    dropoffStopPrice: dropoffPrice,
    baseCalculation: Math.round(baseCalculation * 100) / 100, // Round to 2 decimals
    fixedFee: PRICING.FIXED_FEE,
    total,
    formula: getPricingFormula(pickupPrice, dropoffPrice, true),
  };
};

/**
 * Validate same route calculation inputs
 */
export const validateSameRouteInputs = (
  routeName: string,
  pickupStopName: string,
  dropoffStopName: string
): { isValid: boolean; error?: string } => {
  if (!routeName) {
    return { isValid: false, error: 'Route name is required' };
  }
  
  if (!pickupStopName) {
    return { isValid: false, error: 'Pickup stop name is required' };
  }
  
  if (!dropoffStopName) {
    return { isValid: false, error: 'Dropoff stop name is required' };
  }
  
  // Check if route exists
  const route = dataSetTwo.find(r => r.routeName === routeName);
  if (!route) {
    return { isValid: false, error: `Route "${routeName}" not found in pricing data` };
  }
  
  return { isValid: true };
};

/**
 * Get available routes from dataSetTwo
 */
export const getAvailableRoutesForSameRoute = (): string[] => {
  return dataSetTwo.map(route => route.routeName);
};