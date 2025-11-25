import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { User, Mail, Lock, Phone, ArrowLeft } from "lucide-react-native";
import { useTheme } from "../../theme/index";
import { useAuthStore } from "../../store/index";
import Button from "../../components/Button";
import Input from "../../components/Input";
import KeyboardAvoidingAnimatedView from "../../components/KeyboardAvoidingAnimatedView";

export default function RegisterScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { register, isLoading } = useAuthStore();

  const [step, setStep] = useState(1); // Progressive disclosure: 1 = name/email, 2 = phone/password
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Phone is optional but validate format if provided
    if (formData.phone && !/^[\+]?[0-9\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
    setErrors({});
  };

  const handleRegister = async () => {
    if (!validateStep2()) return;

    const result = await register(formData);

    if (result.success) {
      router.replace("/(tabs)");
    } else {
      Alert.alert("Registration Failed", result.error || "Please try again.");
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const isStep2Valid = formData.password.length >= 6;

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
          {/* Back Button */}
          {step === 1 && (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                position: "absolute",
                top: insets.top + 20,
                left: 32,
                zIndex: 1,
                padding: 8,
              }}
            >
              <ArrowLeft size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
          )}

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
              Create Account
            </Text>

            <Text
              style={{
                fontSize: 16,
                fontFamily: "Quicksand-Regular",
                color: theme.colors.text.secondary,
                textAlign: "center",
              }}
            >
              {step === 1
                ? "Let's get started with your basic info"
                : "Complete your account setup"}
            </Text>
          </View>

          {/* Progress Indicator */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 40,
            }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: theme.colors.primary,
                marginHorizontal: 4,
              }}
            />
            <View
              style={{
                width: step === 2 ? 20 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor:
                  step === 2
                    ? theme.colors.primary
                    : theme.colors.text.tertiary,
                marginHorizontal: 4,
              }}
            />
          </View>

          {/* Register Form */}
          <View style={{ flex: 1, justifyContent: "center" }}>
            {step === 1 ? (
              <>
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChangeText={(value) => handleInputChange("name", value)}
                  error={errors.name}
                  leftIcon={User}
                  autoCapitalize="words"
                  style={{ marginBottom: 20 }}
                />

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
                  style={{ marginBottom: 32 }}
                />

                <Button
                  title="Next"
                  onPress={handleNext}
                  disabled={!formData.name.trim() || !formData.email.trim()}
                  style={{
                    backgroundColor: theme.colors.primary,
                    marginBottom: 24,
                  }}
                />
              </>
            ) : (
              <>
                <Input
                  label="Phone Number (Optional)"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChangeText={(value) => handleInputChange("phone", value)}
                  error={errors.phone}
                  leftIcon={Phone}
                  keyboardType="phone-pad"
                  style={{ marginBottom: 20 }}
                />

                <Input
                  label="Password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange("password", value)}
                  error={errors.password}
                  leftIcon={Lock}
                  secureTextEntry
                  style={{ marginBottom: 32 }}
                />

                <View style={{ flexDirection: "row", gap: 16 }}>
                  <Button
                    title="Back"
                    onPress={handleBack}
                    variant="outline"
                    style={{ flex: 1 }}
                  />
                  <Button
                    title="Create Account"
                    onPress={handleRegister}
                    loading={isLoading}
                    disabled={isLoading || !isStep2Valid}
                    style={{
                      flex: 2,
                      backgroundColor: theme.colors.primary,
                    }}
                  />
                </View>
              </>
            )}

            {/* Login Link */}
            <TouchableOpacity
              onPress={() => router.push("/(auth)/login")}
              style={{
                alignItems: "center",
                paddingVertical: 12,
                marginTop: 24,
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
                Already have an account? Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingAnimatedView>
  );
}
