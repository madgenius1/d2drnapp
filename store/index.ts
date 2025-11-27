/**
 * Store - Central Export
 * Exports all Zustand stores
 */

export { useAuthStore } from './authStore';
export { useOrderStore } from './orderStore';
export { useEffectiveTheme, useThemeStore } from './themeStore';

// Legacy support for useAppStore (if existing code uses it)
import { ERRAND_TEMPLATES } from '../data/errandTemplates';
import { routes } from '../data/routes';

/**
 * Legacy useAppStore for backward compatibility
 * Maps to existing functionality
 */
export const useAppStore = () => {
  return {
    routes: routes.map((route) => ({
      id: route.name.toLowerCase().replace(/\s+/g, '-'),
      name: route.name,
      stops: route.stops.map((stop) => ({
        id: stop.toLowerCase().replace(/\s+/g, '-'),
        name: stop,
      })),
    })),
    errandTemplates: ERRAND_TEMPLATES,
    isOnboardingComplete: true, // Managed by AsyncStorage now
    completeOnboarding: () => {},
    getOrderStats: () => ({
      created: 0,
      pending: 0,
      completed: 0,
    }),
  };
};

export default {
  useAuthStore,
  useOrderStore,
  useThemeStore,
  useAppStore,
};