/**
 * App Store
 * Manages app-wide state like onboarding, routes, and errand templates
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { ERRAND_TEMPLATES } from '../data/errandTemplates';
import { routes as routesData } from '../data/routes';

interface Route {
  id: string;
  name: string;
  stops: Array<{
    id: string;
    name: string;
  }>;
}

interface ErrandTemplate {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface OrderStats {
  created: number;
  pending: number;
  completed: number;
}

interface AppState {
  isOnboardingComplete: boolean;
  routes: Route[];
  errandTemplates: ErrandTemplate[];
  completeOnboarding: () => void;
  getOrderStats: () => OrderStats;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isOnboardingComplete: false,
      
      // Transform routes data
      routes: routesData.map((route) => ({
        id: route.name.toLowerCase().replace(/\s+/g, '-'),
        name: route.name,
        stops: route.stops.map((stop) => ({
          id: stop.toLowerCase().replace(/\s+/g, '-'),
          name: stop,
        })),
      })),
      
      // Errand templates
      errandTemplates: ERRAND_TEMPLATES,
      
      // Complete onboarding
      completeOnboarding: () => {
        console.log('[AppStore] Completing onboarding');
        set({ isOnboardingComplete: true });
      },
      
      // Get order statistics (placeholder - will be enhanced later)
      getOrderStats: () => {
        // TODO: Calculate from actual orders in orderStore
        return {
          created: 0,
          pending: 0,
          completed: 0,
        };
      },
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isOnboardingComplete: state.isOnboardingComplete,
      }),
    }
  )
);