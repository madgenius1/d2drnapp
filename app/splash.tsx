import React, { useEffect, useState } from "react";
import { View, Text, Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { useTheme } from "../theme/index";
import { useAuthStore, useAppStore } from "../store/index";

export default function SplashScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [fadeAnim] = useState(new Animated.Value(0));

  const { isAuthenticated } = useAuthStore();
  const { isOnboardingComplete } = useAppStore();

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Navigate after 3 seconds
    const timer = setTimeout(() => {
      if (!isOnboardingComplete) {
        router.replace("/onboarding");
      } else if (!isAuthenticated) {
        router.replace("/(auth)/login");
      } else {
        router.replace("/(tabs)");
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [fadeAnim, isAuthenticated, isOnboardingComplete]);

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
          }}
        >
          Your reliable delivery partner
        </Text>
      </Animated.View>
    </View>
  );
}
