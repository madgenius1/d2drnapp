import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAppStore } from "../store/appStore";
import { useAuthStore } from "../store/authStore";
import { useTheme } from "../theme/index";

export default function Index() {
  const router = useRouter();
  const theme = useTheme();
  const { isAuthenticated, isInitialized } = useAuthStore();
  const { isOnboardingComplete } = useAppStore();

  useEffect(() => {
    // Wait for auth to initialize
    if (!isInitialized) {
      console.log('[Index] Waiting for auth initialization...');
      return;
    }

    console.log('[Index] Navigating based on state:', {
      isAuthenticated,
      isOnboardingComplete,
    });

    // Navigate based on state
    if (!isOnboardingComplete) {
      console.log('[Index] -> Onboarding');
      router.replace("/onboarding");
    } else if (!isAuthenticated) {
      console.log('[Index] -> Login');
      router.replace("/(auth)/login");
    } else {
      console.log('[Index] -> Tabs');
      router.replace("/(tabs)");
    }
  }, [isInitialized, isAuthenticated, isOnboardingComplete]);

  // Show loading while waiting
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