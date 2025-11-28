import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Animated, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthStore } from "../store/authStore";
import { useAppStore } from "../store/index";
import { useTheme } from "../theme/index";

export default function SplashScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [fadeAnim] = useState(new Animated.Value(0));

  const { isAuthenticated, isInitialized } = useAuthStore();
  const { isOnboardingComplete } = useAppStore();

  useEffect(() => {
    console.log('[Splash] Mounting...');
    
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    // Wait for auth to initialize before navigating
    if (!isInitialized) {
      console.log('[Splash] Waiting for auth initialization...');
      return;
    }

    console.log('[Splash] Auth initialized. Status:', {
      isAuthenticated,
      isOnboardingComplete,
    });

    // Navigate after a short delay to show splash
    const timer = setTimeout(() => {
      console.log('[Splash] Navigating...');
      
      if (!isOnboardingComplete) {
        console.log('[Splash] -> Onboarding');
        router.replace("/onboarding");
      } else if (!isAuthenticated) {
        console.log('[Splash] -> Login');
        router.replace("/(auth)/login");
      } else {
        console.log('[Splash] -> Tabs');
        router.replace("/(tabs)");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isInitialized, isAuthenticated, isOnboardingComplete]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <StatusBar style={theme.isDark ? "light" : "dark"} />

      <Animated.View
        style={{
          opacity: fadeAnim,
          alignItems: "center",
        }}
      >
        {/* D2D Logo */}
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: theme.colors.primary,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 24,
            shadowColor: theme.colors.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Text
            style={{
              fontSize: 36,
              fontFamily: "Quicksand-Bold",
              color: "#ffffff",
              fontWeight: "700",
            }}
          >
            D2D
          </Text>
        </View>

        {/* Tagline */}
        <Text
          style={{
            fontSize: 20,
            fontFamily: "Quicksand-Medium",
            color: theme.colors.text.secondary,
            textAlign: "center",
            letterSpacing: 0.5,
          }}
        >
          Pick. Drop. Done.
        </Text>

        {/* Subtitle */}
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Quicksand-Regular",
            color: theme.colors.text.tertiary,
            textAlign: "center",
            marginTop: 8,
            marginBottom: 32,
          }}
        >
          Your reliable delivery partner
        </Text>

        {/* Loading Indicator */}
        <ActivityIndicator size="large" color={theme.colors.primary} />
        
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Quicksand-Regular",
            color: theme.colors.text.tertiary,
            textAlign: "center",
            marginTop: 16,
          }}
        >
          {!isInitialized ? "Initializing..." : "Loading..."}
        </Text>
      </Animated.View>
    </View>
  );
}