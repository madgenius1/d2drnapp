/**
 * useRoutes Hook
 * Provides access to routes and stops data
 */

import { useCallback, useMemo } from 'react';
import { routes } from '../data/routes';
import type { Route, RouteStop } from '../types';

export const useRoutes = () => {
  /**
   * Get all routes
   */
  const allRoutes = useMemo(() => {
    return routes.map((route) => ({
      id: route.name.toLowerCase().replace(/\s+/g, '-'),
      name: route.name,
      stops: route.stops.map((stop) => ({
        id: stop.toLowerCase().replace(/\s+/g, '-'),
        name: stop,
      })),
    }));
  }, []);

  /**
   * Get route by ID
   */
  const getRouteById = useCallback(
    (routeId: string): Route | undefined => {
      return allRoutes.find((route) => route.id === routeId);
    },
    [allRoutes]
  );

  /**
   * Get route by name
   */
  const getRouteByName = useCallback(
    (routeName: string): Route | undefined => {
      return allRoutes.find(
        (route) => route.name.toLowerCase() === routeName.toLowerCase()
      );
    },
    [allRoutes]
  );

  /**
   * Get stops for a route
   */
  const getStopsForRoute = useCallback(
    (routeId: string): RouteStop[] => {
      const route = getRouteById(routeId);
      return route?.stops || [];
    },
    [getRouteById]
  );

  /**
   * Get stop by ID within a route
   */
  const getStopById = useCallback(
    (routeId: string, stopId: string): RouteStop | undefined => {
      const stops = getStopsForRoute(routeId);
      return stops.find((stop) => stop.id === stopId);
    },
    [getStopsForRoute]
  );

  /**
   * Search routes by query
   */
  const searchRoutes = useCallback(
    (query: string): Route[] => {
      if (!query.trim()) return allRoutes;

      const lowerQuery = query.toLowerCase();
      return allRoutes.filter((route) =>
        route.name.toLowerCase().includes(lowerQuery)
      );
    },
    [allRoutes]
  );

  /**
   * Search stops across all routes
   */
  const searchStops = useCallback(
    (query: string): Array<RouteStop & { routeName: string; routeId: string }> => {
      if (!query.trim()) return [];

      const lowerQuery = query.toLowerCase();
      const results: Array<RouteStop & { routeName: string; routeId: string }> = [];

      allRoutes.forEach((route) => {
        route.stops.forEach((stop) => {
          if (stop.name.toLowerCase().includes(lowerQuery)) {
            results.push({
              ...stop,
              routeName: route.name,
              routeId: route.id,
            });
          }
        });
      });

      return results;
    },
    [allRoutes]
  );

  /**
   * Get route and stop names for display
   */
  const getLocationDisplay = useCallback(
    (routeId: string, stopId: string): string => {
      const route = getRouteById(routeId);
      const stop = route?.stops.find((s) => s.id === stopId);

      if (route && stop) {
        return `${route.name} - ${stop.name}`;
      }

      return 'Unknown Location';
    },
    [getRouteById]
  );

  /**
   * Validate if route and stop exist
   */
  const validateLocation = useCallback(
    (routeId: string, stopId: string): { isValid: boolean; error?: string } => {
      const route = getRouteById(routeId);
      if (!route) {
        return {
          isValid: false,
          error: 'Route not found',
        };
      }

      const stop = route.stops.find((s) => s.id === stopId);
      if (!stop) {
        return {
          isValid: false,
          error: 'Stop not found in route',
        };
      }

      return { isValid: true };
    },
    [getRouteById]
  );

  /**
   * Get total number of routes
   */
  const totalRoutes = useMemo(() => allRoutes.length, [allRoutes]);

  /**
   * Get total number of stops across all routes
   */
  const totalStops = useMemo(() => {
    return allRoutes.reduce((sum, route) => sum + route.stops.length, 0);
  }, [allRoutes]);

  return {
    // Data
    routes: allRoutes,
    totalRoutes,
    totalStops,

    // Getters
    getRouteById,
    getRouteByName,
    getStopsForRoute,
    getStopById,
    getLocationDisplay,

    // Search
    searchRoutes,
    searchStops,

    // Validation
    validateLocation,
  };
};

export default useRoutes;