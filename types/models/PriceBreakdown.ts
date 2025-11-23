/**
 * Price Breakdown Type Definitions
 * Defines all types for pricing calculations
 */

/**
 * Price breakdown for same route orders
 */
export interface SameRoutePriceBreakdown {
  pickupStopPrice: number;
  dropoffStopPrice: number;
  baseCalculation: number; // (pickup + dropoff) / 1.8
  fixedFee: number; // 50
  total: number;
  formula: string; // For display: "((160 + 160) / 1.8) + 50"
}

/**
 * Price breakdown for different route orders
 */
export interface DifferentRoutePriceBreakdown {
  pickupStopPrice: number;
  dropoffStopPrice: number;
  baseCalculation: number; // (pickup + dropoff) / 2
  fixedFee: number; // 50
  total: number;
  formula: string; // For display: "((200 + 300) / 2) + 50"
}

/**
 * Combined price breakdown (used in orders)
 */
export interface PriceBreakdown {
  isSameRoute: boolean;
  pickupCost: number;
  dropoffCost: number;
  transferFee: number; // For different routes
  baseAmount: number; // Calculated amount before fixed fee
  fixedFee: number; // 50 KES
  total: number;
  currency: string; // "KES"
  breakdown: SameRoutePriceBreakdown | DifferentRoutePriceBreakdown;
}

/**
 * Pricing calculation input
 */
export interface PricingInput {
  pickupRoute: string;
  pickupStop: string;
  dropoffRoute: string;
  dropoffStop: string;
}

/**
 * Pricing calculation result
 */
export interface PricingResult {
  success: boolean;
  priceBreakdown?: PriceBreakdown;
  error?: string;
}

/**
 * Price display options
 */
export interface PriceDisplayOptions {
  showBreakdown: boolean;
  showFormula: boolean;
  currency: string;
}