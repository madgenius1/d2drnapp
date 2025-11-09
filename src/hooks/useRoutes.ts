/**
 * Hook for accessing local routes data
 */

import { useMemo } from 'react';
import { routes } from '../data/routes';
import type { Route } from '../types';

interface UseRoutesResult {
  routes: Route[];
  loading: boolean;
  error: string | null;
}

/**
 * Get all routes from local data
 */
export const useRoutes = (): UseRoutesResult => {
  const routesData = useMemo(() => routes, []);

  return {
    routes: routesData,
    loading: false,
    error: null,
  };
};