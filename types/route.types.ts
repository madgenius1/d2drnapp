/**
 * Route-related TypeScript type definitions
 * Defines the structure of routes, stops, and pricing
 */

// Stop within a route
export interface RouteStop {
  id: string;
  name: string;
  price?: number; // Price from route starting point (dataSetTwo)
}

// Route definition
export interface Route {
  id: string;
  name: string;
  stops: RouteStop[];
}

// Stop with CBD-centric pricing (dataSetOne)
export interface StopWithCBDPrice {
  stopName: string;
  price: number; // Price from CBD
}

// Route with route-specific pricing (dataSetTwo)
export interface RouteWithPricing {
  routeName: string;
  stops: {
    stopName: string;
    price: number;
  }[];
}

// Pricing calculation inputs
export interface PricingInput {
  pickupRouteId: string;
  pickupStopId: string;
  dropoffRouteId: string;
  dropoffStopId: string;
}

// Pricing calculation result
export interface PricingResult {
  pickupCost: number;
  transferFee: number;
  dropoffCost: number;
  total: number;
  isSameRoute: boolean;
  formula: string; // For debugging
}

// Available pickup times
export type PickupTime = 
  | '8:30 AM'
  | '9:00 AM'
  | '10:00 AM'
  | '11:00 AM'
  | '12:00 PM'
  | '1:00 PM'
  | '2:00 PM'
  | '3:00 PM'
  | '4:00 PM'
  | '4:30 PM';

export interface TimeSlot {
  id: string;
  label: PickupTime;
  available: boolean;
}