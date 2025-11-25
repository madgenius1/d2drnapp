import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { Mail, Lock } from "lucide-react-native";
import { useTheme } from "../../theme/index";
import { useAuthStore } from "../../store/index";
import Button from "../../components/Button";
import Input from "../../components/Input";
import KeyboardAvoidingAnimatedView from "../../components/KeyboardAvoidingAnimatedView";

export default function LoginScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { login, isLoading } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    const result = await login(formData);

    if (result.success) {
      router.replace("/(tabs)");
    } else {
      Alert.alert(
        "Login Failed",
        result.error || "Please check your credentials and try again.",
      );
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  return (
    <KeyboardAvoidingAnimatedView style={{ flex: 1 }} behavior="padding">
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
        }}
      >
        <StatusBar style={theme.isDark ? "light" : "dark"} />

        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: insets.top + 60,
            paddingBottom: insets.bottom + 20,
            paddingHorizontal: 32,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={{ alignItems: "center", marginBottom: 60 }}>
            {/* Logo */}
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: theme.colors.primary,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <Text
                style={{
                  fontSize: 28,
                  fontFamily: "Quicksand-Bold",
                  color: "#ffffff",
                  fontWeight: "700",
                }}
              >
                D2D
              </Text>
            </View>

            <Text
              style={{
                fontSize: 28,
                fontFamily: "Quicksand-Bold",
                color: theme.colors.text.primary,
                marginBottom: 8,
                textAlign: "center",
                fontWeight: "700",
              }}
            >
              Welcome Back
            </Text>

            <Text
              style={{
                fontSize: 16,
                fontFamily: "Quicksand-Regular",
                color: theme.colors.text.secondary,
                textAlign: "center",
              }}
            >
              Sign in to your account
            </Text>
          </View>

          {/* Login Form */}
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Input
              label="Email"
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(value) => handleInputChange("email", value)}
              error={errors.email}
              leftIcon={Mail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              style={{ marginBottom: 20 }}
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChangeText={(value) => handleInputChange("password", value)}
              error={errors.password}
              leftIcon={Lock}
              secureTextEntry
              style={{ marginBottom: 32 }}
            />

            <Button
              title="Log In"
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading}
              style={{
                backgroundColor: theme.colors.primary,
                marginBottom: 24,
              }}
            />

            {/* Create Account Link */}
            <TouchableOpacity
              onPress={() => router.push("/(auth)/register")}
              style={{
                alignItems: "center",
                paddingVertical: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Quicksand-Medium",
                  color: theme.colors.primary,
                  textAlign: "center",
                }}
              >
                Don't have an account? Create Account
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingAnimatedView>
  );
}
