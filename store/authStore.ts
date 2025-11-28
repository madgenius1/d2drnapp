import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { auth, db } from '../services/firebase/config';

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  register: (data: { email: string; password: string; name: string; phone?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  initializeAuth: () => (() => void) | undefined;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,

      initializeAuth: () => {
        console.log('[Auth] Initializing auth listener...');
        
        try {
          const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
            console.log('[Auth] Auth state changed:', firebaseUser?.email || 'No user');
            
            if (firebaseUser) {
              // User is signed in, fetch their profile
              try {
                const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                
                if (userDoc.exists()) {
                  const userData = userDoc.data();
                  const user: User = {
                    id: firebaseUser.uid,
                    email: firebaseUser.email!,
                    name: userData.name || 'User',
                    phone: userData.phone,
                    avatar: userData.avatar,
                    createdAt: userData.createdAt || new Date().toISOString(),
                  };
                  
                  console.log('[Auth] User logged in:', user.email);
                  set({ user, isAuthenticated: true, isInitialized: true, isLoading: false });
                } else {
                  console.log('[Auth] User document not found, signing out...');
                  await firebaseSignOut(auth);
                  set({ user: null, isAuthenticated: false, isInitialized: true, isLoading: false });
                }
              } catch (error) {
                console.error('[Auth] Error fetching user data:', error);
                set({ user: null, isAuthenticated: false, isInitialized: true, isLoading: false });
              }
            } else {
              // User is signed out
              console.log('[Auth] No user signed in');
              set({ user: null, isAuthenticated: false, isInitialized: true, isLoading: false });
            }
          });

          return unsubscribe;
        } catch (error) {
          console.error('[Auth] Error setting up auth listener:', error);
          set({ isInitialized: true, isLoading: false });
          return undefined;
        }
      },

      login: async (credentials) => {
        set({ isLoading: true });
        
        try {
          console.log('[Auth] Attempting login for:', credentials.email);
          
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          );

          const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
          
          if (!userDoc.exists()) {
            throw new Error('User profile not found');
          }

          const userData = userDoc.data();
          const user: User = {
            id: userCredential.user.uid,
            email: userCredential.user.email!,
            name: userData.name || 'User',
            phone: userData.phone,
            avatar: userData.avatar,
            createdAt: userData.createdAt || new Date().toISOString(),
          };

          console.log('[Auth] Login successful:', user.email);
          set({ user, isAuthenticated: true, isLoading: false });
          
          return { success: true };
        } catch (error: any) {
          console.error('[Auth] Login error:', error);
          set({ isLoading: false });
          
          let errorMessage = 'Login failed. Please try again.';
          
          if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            errorMessage = 'Invalid email or password';
          } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Invalid email address';
          } else if (error.code === 'auth/invalid-credential') {
            errorMessage = 'Invalid email or password';
          } else if (error.code === 'auth/network-request-failed') {
            errorMessage = 'Network error. Please check your connection.';
          }
          
          return { success: false, error: errorMessage };
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        
        try {
          console.log('[Auth] Attempting registration for:', data.email);
          
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            data.email,
            data.password
          );

          const user: User = {
            id: userCredential.user.uid,
            email: data.email,
            name: data.name,
            phone: data.phone,
            createdAt: new Date().toISOString(),
          };

          await setDoc(doc(db, 'users', user.id), {
            name: user.name,
            email: user.email,
            phone: user.phone,
            createdAt: user.createdAt,
          });

          console.log('[Auth] Registration successful:', user.email);
          set({ user, isAuthenticated: true, isLoading: false });
          
          return { success: true };
        } catch (error: any) {
          console.error('[Auth] Registration error:', error);
          set({ isLoading: false });
          
          let errorMessage = 'Registration failed. Please try again.';
          
          if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'This email is already registered';
          } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Invalid email address';
          } else if (error.code === 'auth/weak-password') {
            errorMessage = 'Password is too weak. Use at least 6 characters.';
          } else if (error.code === 'auth/network-request-failed') {
            errorMessage = 'Network error. Please check your connection.';
          }
          
          return { success: false, error: errorMessage };
        }
      },

      logout: async () => {
        try {
          console.log('[Auth] Logging out...');
          await firebaseSignOut(auth);
          set({ user: null, isAuthenticated: false });
          console.log('[Auth] Logout successful');
        } catch (error) {
          console.error('[Auth] Logout error:', error);
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);