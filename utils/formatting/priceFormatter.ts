/**
 * Price Formatting Utilities
 * Currency and number formatting
 */

import { CURRENCY } from '../../data/constants/appConstants';

/**
 * Format price with currency symbol
 */
export const formatPrice = (
  amount: number,
  currency: string = CURRENCY
): string => {
  return `${currency} ${amount.toLocaleString()}`;
};

/**
 * Format price range
 */
export const formatPriceRange = (
  min: number,
  max: number,
  currency: string = CURRENCY
): string => {
  return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
};

/**
 * Parse price string to number
 */
export const parsePrice = (priceString: string): number | null => {
  const cleaned = priceString.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  
  return isNaN(parsed) ? null : parsed;
};

/**
 * Format number with thousand separators
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

/**
 * Calculate percentage
 */
export const calculatePercentage = (
  value: number,
  total: number
): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Format percentage
 */
export const formatPercentage = (percentage: number): string => {
  return `${percentage}%`;
};