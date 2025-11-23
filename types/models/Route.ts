/**
 * Route and Stop Type Definitions
 * Defines all types for routes, stops, and pricing data
 */

/**
 * Stop within a route
 */
export interface Stop {
  id: string;
  name: string;
  price?: number; // Optional: used in dataSetTwo
}

/**
 * Route with stops
 */
export interface Route {
  id: string;
  name: string;
  stops: Stop[];
}

/**
 * Stop with CBD-centric pricing (dataSetOne)
 */
export interface StopWithCBDPrice {
  stopName: string;
  price: number;
}

/**
 * Stop with route-specific pricing (dataSetTwo)
 */
export interface RouteStop {
  stopName: string;
  price: number;
}

/**
 * Route with pricing data (dataSetTwo)
 */
export interface RouteWithPrices {
  routeName: string;
  stops: RouteStop[];
}

/**
 * Location selection data
 */
export interface LocationSelection {
  routeId: string;
  routeName: string;
  stopId: string;
  stopName: string;
}

/**
 * Route data from routes.ts
 */
export interface RouteData {
  name: string;
  stops: string[];
}

/**
 * Price lookup result
 */
export interface PriceLookupResult {
  found: boolean;
  price: number;
  stopName: string;
}

/**
 * Route validation result
 */
export interface RouteValidationResult {
  isValid: boolean;
  error?: string;
}