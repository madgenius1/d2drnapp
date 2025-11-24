/**
 * Price Calculator - Core Pricing Logic
 * Contains the fundamental pricing calculation functions
 */

import { PRICING } from '../../data/constants/appConstants';

/**
 * Calculate same route price
 * Formula: rate = Math.trunc((pickupPrice + dropoffPrice) / 1.8 + 50)
 */
export const calculateSameRoutePrice = (
  pickupPrice: number,
  dropoffPrice: number
): number => {
  const baseAmount = (pickupPrice + dropoffPrice) / PRICING.SAME_ROUTE_DIVISOR;
  const total = baseAmount + PRICING.FIXED_FEE;
  return Math.trunc(total);
};

/**
 * Calculate different route price
 * Formula: rate = Math.trunc((pickupPrice + dropoffPrice) / 2 + 50)
 */
export const calculateDifferentRoutePrice = (
  pickupPrice: number,
  dropoffPrice: number
): number => {
  const baseAmount = (pickupPrice + dropoffPrice) / PRICING.DIFFERENT_ROUTE_DIVISOR;
  const total = baseAmount + PRICING.FIXED_FEE;
  return Math.trunc(total);
};

/**
 * Format price for display
 */
export const formatPrice = (price: number, currency: string = 'KES'): string => {
  return `${currency} ${price.toLocaleString()}`;
};

/**
 * Calculate base amount (before fixed fee)
 */
export const calculateBaseAmount = (
  pickupPrice: number,
  dropoffPrice: number,
  isSameRoute: boolean
): number => {
  const divisor = isSameRoute 
    ? PRICING.SAME_ROUTE_DIVISOR 
    : PRICING.DIFFERENT_ROUTE_DIVISOR;
  
  return (pickupPrice + dropoffPrice) / divisor;
};

/**
 * Get pricing formula string for display
 */
export const getPricingFormula = (
  pickupPrice: number,
  dropoffPrice: number,
  isSameRoute: boolean
): string => {
  const divisor = isSameRoute 
    ? PRICING.SAME_ROUTE_DIVISOR 
    : PRICING.DIFFERENT_ROUTE_DIVISOR;
  
  return `((${pickupPrice} + ${dropoffPrice}) / ${divisor}) + ${PRICING.FIXED_FEE}`;
};

/**
 * Validate price values
 */
export const validatePriceInputs = (
  pickupPrice: number,
  dropoffPrice: number
): { isValid: boolean; error?: string } => {
  if (pickupPrice <= 0) {
    return { isValid: false, error: 'Invalid pickup price' };
  }
  
  if (dropoffPrice <= 0) {
    return { isValid: false, error: 'Invalid dropoff price' };
  }
  
  if (!Number.isFinite(pickupPrice) || !Number.isFinite(dropoffPrice)) {
    return { isValid: false, error: 'Price values must be valid numbers' };
  }
  
  return { isValid: true };
};