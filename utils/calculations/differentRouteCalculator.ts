/**
 * Different Route Calculator
 * Handles price calculation for orders where pickup and dropoff are on different routes
 * Uses dataSetOne (CBD-centric pricing)
 */

import { dataSetOne, StopPrice } from '../../data/dataSetOne';
import { normalizeStopName } from '../../data/routes/routeHelpers';
import { DifferentRoutePriceBreakdown } from '../../types/models/PriceBreakdown';
import { calculateDifferentRoutePrice, getPricingFormula } from './priceCalculator';
import { PRICING } from '../../data/constants/appConstants';

/**
 * Find stop price in dataSetOne (CBD-centric)
 */
const findStopPriceInDataSetOne = (stopName: string): number | null => {
  const normalizedStopName = normalizeStopName(stopName);
  
  // Find the stop in dataSetOne
  const stop = dataSetOne.find(s => 
    normalizeStopName(s.stopName) === normalizedStopName
  );
  
  if (!stop) {
    console.warn(`Stop not found in dataSetOne: ${stopName}`);
    return null;
  }
  
  return stop.price;
};

/**
 * Calculate different route price with breakdown
 */
export const calculateDifferentRoutePriceWithBreakdown = (
  pickupStopName: string,
  dropoffStopName: string
): DifferentRoutePriceBreakdown | null => {
  // Get prices from dataSetOne (CBD-centric)
  const pickupPrice = findStopPriceInDataSetOne(pickupStopName);
  const dropoffPrice = findStopPriceInDataSetOne(dropoffStopName);
  
  if (pickupPrice === null || dropoffPrice === null) {
    console.error('Could not find prices for stops in dataSetOne', {
      pickupStopName,
      dropoffStopName,
    });
    return null;
  }
  
  // Calculate using formula: (pickup + dropoff) / 2 + 50
  const baseCalculation = (pickupPrice + dropoffPrice) / PRICING.DIFFERENT_ROUTE_DIVISOR;
  const total = calculateDifferentRoutePrice(pickupPrice, dropoffPrice);
  
  return {
    pickupStopPrice: pickupPrice,
    dropoffStopPrice: dropoffPrice,
    baseCalculation: Math.round(baseCalculation * 100) / 100, // Round to 2 decimals
    fixedFee: PRICING.FIXED_FEE,
    total,
    formula: getPricingFormula(pickupPrice, dropoffPrice, false),
  };
};

/**
 * Validate different route calculation inputs
 */
export const validateDifferentRouteInputs = (
  pickupStopName: string,
  dropoffStopName: string
): { isValid: boolean; error?: string } => {
  if (!pickupStopName) {
    return { isValid: false, error: 'Pickup stop name is required' };
  }
  
  if (!dropoffStopName) {
    return { isValid: false, error: 'Dropoff stop name is required' };
  }
  
  // Check if stops exist in dataSetOne
  const pickupExists = dataSetOne.some(s => 
    normalizeStopName(s.stopName) === normalizeStopName(pickupStopName)
  );
  
  const dropoffExists = dataSetOne.some(s => 
    normalizeStopName(s.stopName) === normalizeStopName(dropoffStopName)
  );
  
  if (!pickupExists) {
    return { 
      isValid: false, 
      error: `Pickup stop "${pickupStopName}" not found in pricing data` 
    };
  }
  
  if (!dropoffExists) {
    return { 
      isValid: false, 
      error: `Dropoff stop "${dropoffStopName}" not found in pricing data` 
    };
  }
  
  return { isValid: true };
};

/**
 * Get all available stops from dataSetOne
 */
export const getAvailableStopsForDifferentRoutes = (): string[] => {
  return dataSetOne.map(stop => stop.stopName);
};

/**
 * Check if stop exists in dataSetOne
 */
export const stopExistsInDataSetOne = (stopName: string): boolean => {
  const normalizedStopName = normalizeStopName(stopName);
  return dataSetOne.some(s => 
    normalizeStopName(s.stopName) === normalizedStopName
  );
};