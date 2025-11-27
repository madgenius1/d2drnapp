/**
 * Root Layout with Enhanced Auth Persistence
 */

import React, { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useFonts,
  Quicksand_300Light,
  Quicksand_400Regular,
  Quicksand_500Medium,
  Quicksand_600SemiBold,
  Quicksand_700Bold,
} from "@expo-google-fonts/quicksand";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, ActivityIndicator } from "react-native";
import { useTheme } from "../theme/index";
import { useAuth } from "../hooks/useAuth";

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// React Query client configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Protected route wrapper
 * Handles authentication-based navigation
 */
function RootLayoutNav() {
  const theme = useTheme();
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  useEffect(() => {
    if (isLoading) {
      return; // Wait for auth state to initialize
    }

    // Get the current route group (e.g., "(auth)" or "(tabs)")
    const inAuthGroup = segments[0] === "(auth)";
    const inTabsGroup = segments[0] === "(tabs)";
    const isOnboarding = segments[0] === "onboarding";
    const isSplash = segments[0] === "splash";

    // Allow splash and onboarding to show without interference
    if (isSplash || isOnboarding) {
      setIsNavigationReady(true);
      return;
    }

    /**
     * Authentication flow logic:
     * 1. If user is NOT authenticated and NOT in auth group → redirect to login
     * 2. If user IS authenticated and IN auth group → redirect to tabs
     * 3. Otherwise, stay on current route
     */
    if (!isAuthenticated && !inAuthGroup) {
      // User not authenticated, redirect to login
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup) {
      // User is authenticated but on login/register screen, redirect to home
      router.replace("/(tabs)");
    }

    setIsNavigationReady(true);
  }, [isAuthenticated, isLoading, segments]);

  // Show loading screen while initializing
  if (isLoading || !isNavigationReady) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.background,
        }}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="splash">
      <Stack.Screen name="splash" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="order/create-order" />
      <Stack.Screen name="order/order-details" />
      <Stack.Screen name="order/track-order" />
      <Stack.Screen name="order/modify-order" />
    </Stack>
  );
}

export default function RootLayout() {
  const theme = useTheme();
  const [appIsReady, setAppIsReady] = useState(false);

  const [loaded, error] = useFonts({
    "Quicksand-Light": Quicksand_300Light,
    "Quicksand-Regular": Quicksand_400Regular,
    "Quicksand-Medium": Quicksand_500Medium,
    "Quicksand-SemiBold": Quicksand_600SemiBold,
    "Quicksand-Bold": Quicksand_700Bold,
  });

  useEffect(() => {
    async function prepare() {
      try {
        if (loaded || error) {
          setAppIsReady(true);
        }
      } catch (e) {
        console.warn(e);
      }
    }

    prepare();
  }, [loaded, error]);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style={theme.isDark ? "light" : "dark"} />
        <RootLayoutNav />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}