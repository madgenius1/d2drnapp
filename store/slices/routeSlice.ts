/**
 * Route Slice - Zustand
 * Route and stop data state management
 */

import { StateCreator } from 'zustand';
import { Route, Stop } from '../../types/models/Route';
import { routes as routeData } from '../../data/routes/routes';
import { convertRouteDataToRoute, findRouteById, findStopById } from '../../data/routes/routeHelpers';

export interface RouteSlice {
  // State
  routes: Route[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadRoutes: () => void;
  getRouteById: (routeId: string) => Route | undefined;
  getStopById: (stopId: string) => Stop | undefined;
  getStopsByRoute: (routeId: string) => Stop[];
}

export const createRouteSlice: StateCreator<RouteSlice> = (set, get) => ({
  // Initial state
  routes: [],
  isLoading: false,
  error: null,

  // Load routes from data
  loadRoutes: () => {
    set({ isLoading: true, error: null });

    try {
      // Convert route data to Route objects with IDs
      const convertedRoutes = routeData.map((route, index) =>
        convertRouteDataToRoute(route, index)
      );

      set({
        routes: convertedRoutes,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to load routes',
        isLoading: false,
      });
    }
  },

  // Get route by ID
  getRouteById: (routeId: string) => {
    const { routes } = get();
    return findRouteById(routes, routeId);
  },

  // Get stop by ID
  getStopById: (stopId: string) => {
    const { routes } = get();
    return findStopById(routes, stopId);
  },

  // Get stops for a specific route
  getStopsByRoute: (routeId: string) => {
    const { routes } = get();
    const route = findRouteById(routes, routeId);
    return route ? route.stops : [];
  },
});