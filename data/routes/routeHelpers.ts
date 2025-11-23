/**
 * Route Helper Functions
 * Utilities for normalizing and working with route data
 */

import { Route, Stop, RouteData } from '../../types/models/Route';

/**
 * Normalize stop name to fix inconsistencies
 */
export const normalizeStopName = (stopName: string): string => {
  const normalizations: Record<string, string> = {
    'All Sops': 'Allsops',
    'All sops': 'Allsops',
    "Ngong'": 'Ngong',
    "Athi River'": 'Athi River',
    'KQ Base': 'Kenya Airways HQ',
    'Tena': 'Tena Estate',
    "Kariobangi North'": 'Kariobangi North',
    'Mwihoko ': 'Mwihoko',
    'Moi Avenue': 'Moi Avenue',
    'Tom Mboya Str.': 'Tom Mboya Street',
    'Upper Hill': 'Upperhill',
    'Upperhill': 'Upperhill',
    'T-mall': 'T-Mall',
    'T-Mall': 'T-Mall',
    'Langata Hospital': 'Langata Hosp',
    'Mbagathi Way': 'Mbagathi',
    'Buruburu Farms': 'Mawe Mbili',
    'Manyanja Road': 'Manyanja Rd',
  };

  // First try exact match
  if (normalizations[stopName]) {
    return normalizations[stopName];
  }

  // Trim and normalize spaces
  return stopName.trim().replace(/\s+/g, ' ');
};

/**
 * Generate unique stop ID from route and stop name
 */
export const generateStopId = (routeName: string, stopName: string): string => {
  const normalizedRoute = routeName.toLowerCase().replace(/\s+/g, '_');
  const normalizedStop = stopName.toLowerCase().replace(/\s+/g, '_');
  return `${normalizedRoute}__${normalizedStop}`;
};

/**
 * Convert RouteData to Route with IDs
 */
export const convertRouteDataToRoute = (routeData: RouteData, routeIndex: number): Route => {
  const routeId = `route_${routeIndex + 1}`;
  
  const stops: Stop[] = routeData.stops.map((stopName, stopIndex) => ({
    id: generateStopId(routeData.name, stopName),
    name: normalizeStopName(stopName),
  }));

  return {
    id: routeId,
    name: routeData.name,
    stops,
  };
};

/**
 * Find route by ID
 */
export const findRouteById = (routes: Route[], routeId: string): Route | undefined => {
  return routes.find(route => route.id === routeId);
};

/**
 * Find stop by ID within routes
 */
export const findStopById = (routes: Route[], stopId: string): Stop | undefined => {
  for (const route of routes) {
    const stop = route.stops.find(s => s.id === stopId);
    if (stop) {
      return stop;
    }
  }
  return undefined;
};

/**
 * Find stop by name within a route
 */
export const findStopByName = (route: Route, stopName: string): Stop | undefined => {
  const normalized = normalizeStopName(stopName);
  return route.stops.find(stop => 
    normalizeStopName(stop.name) === normalized
  );
};

/**
 * Check if two stops are the same
 */
export const isSameStop = (
  pickupRouteId: string,
  pickupStopId: string,
  dropoffRouteId: string,
  dropoffStopId: string
): boolean => {
  return pickupRouteId === dropoffRouteId && pickupStopId === dropoffStopId;
};

/**
 * Check if pickup and dropoff are on same route
 */
export const isSameRoute = (pickupRouteId: string, dropoffRouteId: string): boolean => {
  return pickupRouteId === dropoffRouteId;
};

/**
 * Get full address string
 */
export const getFullAddress = (routeName: string, stopName: string): string => {
  return `${routeName} - ${stopName}`;
};

/**
 * Validate route and stop combination
 */
export const validateRouteStop = (
  routes: Route[],
  routeId: string,
  stopId: string
): { isValid: boolean; error?: string } => {
  const route = findRouteById(routes, routeId);
  
  if (!route) {
    return { isValid: false, error: 'Invalid route selected' };
  }

  const stop = route.stops.find(s => s.id === stopId);
  
  if (!stop) {
    return { isValid: false, error: 'Invalid stop for selected route' };
  }

  return { isValid: true };
};

/**
 * Get stops for a route
 */
export const getStopsForRoute = (routes: Route[], routeId: string): Stop[] => {
  const route = findRouteById(routes, routeId);
  return route ? route.stops : [];
};