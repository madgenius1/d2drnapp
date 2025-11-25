/**
 * App Slice - Zustand
 * App-wide state management
 */

import { StateCreator } from 'zustand';
import { ErrandTemplate } from '../../types/models/Errand';
import { errandTemplates } from '../../data/templates/errandTemplates';

export interface AppSlice {
  // State
  isOnboardingComplete: boolean;
  theme: 'light' | 'dark' | 'system';
  errandTemplates: ErrandTemplate[];

  // Actions
  completeOnboarding: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  getErrandTemplates: () => ErrandTemplate[];
}

export const createAppSlice: StateCreator<AppSlice> = (set, get) => ({
  // Initial state
  isOnboardingComplete: false,
  theme: 'system',
  errandTemplates: errandTemplates,

  // Complete onboarding
  completeOnboarding: () => {
    set({ isOnboardingComplete: true });
  },

  // Set theme
  setTheme: (theme: 'light' | 'dark' | 'system') => {
    set({ theme });
  },

  // Get errand templates
  getErrandTemplates: () => {
    return get().errandTemplates;
  },
});