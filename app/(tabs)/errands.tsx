import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, router } from "expo-router";
import { MessageSquare, MapPin, Clock, FileText } from "lucide-react-native";
import { useTheme } from "../../theme/index";
import { useAppStore } from "../../store/index";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Dropdown from "@/components/common/Dropdown";
import KeyboardAvoidingAnimatedView from "@/components/common/KeyboardAvoidingAnimatedView";

const TIME_OPTIONS = [
  { id: "now", name: "As soon as possible" },
  { id: "morning", name: "8:00 AM - 11:00 PM" },
  { id: "afternoon", name: "12:00 PM - 3:00 PM" },
  { id: "evening", name: "3:00 PM - 6:00 PM" },
];

export default function ErrandsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const { routes, createErrandOrder } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    description: "",
    pickupRoute: "",
    pickupStop: "",
    dropoffRoute: "",
    dropoffStop: "",
    preferredTime: "",
    additionalNotes: "",
  });

  const [errors, setErrors] = useState({});

  // Pre-fill template if coming from home screen
  useEffect(() => {
    if (params.template) {
      const templateDescriptions = {
        "Buy Groceries": "Buy groceries at Naivas, deliver to my location",
        "Pick Up Parcel": "Pick up parcel from courier office",
        "Pay Bills": "Pay utility bills at the service center",
        "Medical Pickup": "Collect prescriptions from pharmacy",
        "Document Delivery": "Deliver important documents",
        "Food Delivery": "Order and deliver food from restaurant",
      };

      const description =
        templateDescriptions[params.template] ||
        `Help with: ${params.template}`;
      setFormData((prev) => ({ ...prev, description }));
    }
  }, [params.template]);

  const getStopOptions = (routeId) => {
    const route = routes.find((r) => r.id === routeId);
    return route ? route.stops : [];
  };

  const routeOptions = routes.map((route) => ({
    id: route.id,
    name: route.name,
  }));

  const pickupStopOptions = getStopOptions(formData.pickupRoute);
  const dropoffStopOptions = getStopOptions(formData.dropoffRoute);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.description.trim()) {
      newErrors.description = "Please describe your errand";
    } else if (formData.description.trim().length < 10) {
      newErrors.description =
        "Please provide more details (at least 10 characters)";
    }

    if (!formData.pickupRoute) {
      newErrors.pickupRoute = "Please select pickup route";
    }

    if (!formData.pickupStop) {
      newErrors.pickupStop = "Please select pickup stop";
    }

    if (!formData.dropoffRoute) {
      newErrors.dropoffRoute = "Please select drop-off route";
    }

    if (!formData.dropoffStop) {
      newErrors.dropoffStop = "Please select drop-off stop";
    }

    if (!formData.preferredTime) {
      newErrors.preferredTime = "Please select preferred time";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleRouteChange = (type, routeId) => {
    if (type === "pickup") {
      setFormData((prev) => ({
        ...prev,
        pickupRoute: routeId,
        pickupStop: "", // Reset stop when route changes
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        dropoffRoute: routeId,
        dropoffStop: "", // Reset stop when route changes
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const pickupRoute = routes.find((r) => r.id === formData.pickupRoute);
      const dropoffRoute = routes.find((r) => r.id === formData.dropoffRoute);
      const pickupStop = pickupRoute?.stops.find(
        (s) => s.id === formData.pickupStop,
      );
      const dropoffStop = dropoffRoute?.stops.find(
        (s) => s.id === formData.dropoffStop,
      );
      const preferredTime = TIME_OPTIONS.find(
        (t) => t.id === formData.preferredTime,
      );

      const errandData = {
        description: formData.description.trim(),
        pickupRoute: formData.pickupRoute,
        pickupStop: formData.pickupStop,
        dropoffRoute: formData.dropoffRoute,
        dropoffStop: formData.dropoffStop,
        pickupLocation: `${pickupRoute?.name} - ${pickupStop?.name}`,
        dropoffLocation: `${dropoffRoute?.name} - ${dropoffStop?.name}`,
        preferredTime: preferredTime?.name,
        additionalNotes: formData.additionalNotes.trim(),
        estimatedBudget: "To be determined",
      };

      const result = await createErrandOrder(errandData);

      if (result.success) {
        Alert.alert(
          "Errand Submitted!",
          "Your errand request has been submitted successfully. You can track it in the Orders tab.",
          [
            {
              text: "View Orders",
              onPress: () => router.push("/(tabs)/orders"),
            },
            {
              text: "OK",
              style: "default",
            },
          ],
        );

        // Reset form
        setFormData({
          description: "",
          pickupRoute: "",
          pickupStop: "",
          dropoffRoute: "",
          dropoffStop: "",
          preferredTime: "",
          additionalNotes: "",
        });
      } else {
        Alert.alert(
          "Error",
          result.error || "Failed to submit errand. Please try again.",
        );
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    formData.description.trim().length >= 10 &&
    formData.pickupRoute &&
    formData.pickupStop &&
    formData.dropoffRoute &&
    formData.dropoffStop &&
    formData.preferredTime;

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
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingTop: insets.top + 20,
            paddingBottom: insets.bottom + 100,
            paddingHorizontal: 20,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={{ marginBottom: 32 }}>
            <Text
              style={{
                fontSize: 28,
                fontFamily: "Quicksand-Bold",
                color: theme.colors.text.primary,
                marginBottom: 8,
                fontWeight: "700",
              }}
            >
              Run an Errand
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Quicksand-Regular",
                color: theme.colors.text.secondary,
              }}
            >
              Describe what you need done and we'll handle it for you
            </Text>
          </View>

          {/* Errand Description */}
          <Input
            label="Describe Your Errand"
            placeholder="e.g., Buy groceries at Naivas, deliver to Kilimani, budget 800 KES"
            value={formData.description}
            onChangeText={(value) => handleInputChange("description", value)}
            error={errors.description}
            leftIcon={MessageSquare}
            multiline
            numberOfLines={4}
            style={{ marginBottom: 24 }}
          />

          {/* Pickup Location */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Quicksand-SemiBold",
                color: theme.colors.text.primary,
                marginBottom: 16,
                fontWeight: "600",
              }}
            >
              Pickup Location
            </Text>

            <Dropdown
              label="Pickup Route"
              placeholder="Select pickup route"
              value={formData.pickupRoute}
              onSelect={(value) => handleRouteChange("pickup", value)}
              options={routeOptions}
              error={errors.pickupRoute}
              keyExtractor={(item) => item.id}
              renderItem={(item) => item.name}
              style={{ marginBottom: 16 }}
            />

            <Dropdown
              label="Pickup Stop"
              placeholder="Select pickup stop"
              value={formData.pickupStop}
              onSelect={(value) => handleInputChange("pickupStop", value)}
              options={pickupStopOptions}
              error={errors.pickupStop}
              disabled={!formData.pickupRoute}
              keyExtractor={(item) => item.id}
              renderItem={(item) => item.name}
            />
          </View>

          {/* Drop-off Location */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Quicksand-SemiBold",
                color: theme.colors.text.primary,
                marginBottom: 16,
                fontWeight: "600",
              }}
            >
              Drop-off Location
            </Text>

            <Dropdown
              label="Drop-off Route"
              placeholder="Select drop-off route"
              value={formData.dropoffRoute}
              onSelect={(value) => handleRouteChange("dropoff", value)}
              options={routeOptions}
              error={errors.dropoffRoute}
              keyExtractor={(item) => item.id}
              renderItem={(item) => item.name}
              style={{ marginBottom: 16 }}
            />

            <Dropdown
              label="Drop-off Stop"
              placeholder="Select drop-off stop"
              value={formData.dropoffStop}
              onSelect={(value) => handleInputChange("dropoffStop", value)}
              options={dropoffStopOptions}
              error={errors.dropoffStop}
              disabled={!formData.dropoffRoute}
              keyExtractor={(item) => item.id}
              renderItem={(item) => item.name}
            />
          </View>

          {/* Preferred Time */}
          <Dropdown
            label="Preferred Time"
            placeholder="When would you like this done?"
            value={formData.preferredTime}
            onSelect={(value) => handleInputChange("preferredTime", value)}
            options={TIME_OPTIONS}
            error={errors.preferredTime}
            keyExtractor={(item) => item.id}
            renderItem={(item) => item.name}
            style={{ marginBottom: 24 }}
          />

          {/* Additional Notes */}
          <Input
            label="Additional Notes (Optional)"
            placeholder="Any special instructions or requirements..."
            value={formData.additionalNotes}
            onChangeText={(value) =>
              handleInputChange("additionalNotes", value)
            }
            leftIcon={FileText}
            multiline
            numberOfLines={3}
            style={{ marginBottom: 32 }}
          />

          {/* Submit Button */}
          <Button
            title="Submit Errand Order"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading || !isFormValid}
            style={{
              backgroundColor: theme.colors.primary,
              paddingVertical: 16,
            }}
            textStyle={{
              fontSize: 18,
              fontFamily: "Quicksand-SemiBold",
            }}
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingAnimatedView>
  );
}
