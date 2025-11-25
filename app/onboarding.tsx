import React, { useState, useRef } from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { Package, MapPin, CheckCircle } from "lucide-react-native";
import { useTheme } from "../theme/index";
import { useAppStore } from "../store/index";
import Button from "@/components/common/Button";

const { width: screenWidth } = Dimensions.get("window");

const onboardingData = [
  {
    id: 1,
    title: "What is D2D?",
    description:
      "D2D is your reliable partner for pick-up, drop-off, and errand services. We make deliveries simple and affordable.",
    icon: Package,
    color: "#099d15",
  },
  {
    id: 2,
    title: "How It Works",
    description:
      "Select your pickup and drop-off locations from our route network. Track your delivery in real-time from start to finish.",
    icon: MapPin,
    color: "#1485FF",
  },
  {
    id: 3,
    title: "Why Choose D2D?",
    description:
      "Fast, affordable, and transparent pricing. No hidden fees, reliable service, and friendly drivers.",
    icon: CheckCircle,
    color: "#22C75A",
  },
];

export default function OnboardingScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { completeOnboarding } = useAppStore();

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / screenWidth);
    setCurrentIndex(index);
  };

  const goToNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      scrollViewRef.current?.scrollTo({
        x: nextIndex * screenWidth,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      scrollViewRef.current?.scrollTo({
        x: prevIndex * screenWidth,
        animated: true,
      });
      setCurrentIndex(prevIndex);
    }
  };

  const handleGetStarted = () => {
    completeOnboarding();
    router.replace("/(auth)/login");
  };

  const isLastScreen = currentIndex === onboardingData.length - 1;

  const renderOnboardingItem = (item) => {
    const IconComponent = item.icon;

    return (
      <View
        key={item.id}
        style={{
          width: screenWidth,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 32,
        }}
      >
        {/* Icon */}
        <View
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: theme.isDark
              ? `${item.color}20`
              : `${item.color}10`,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 48,
          }}
        >
          <IconComponent size={60} color={item.color} strokeWidth={1.5} />
        </View>

        {/* Title */}
        <Text
          style={{
            fontSize: 28,
            fontFamily: "Quicksand-Bold",
            color: theme.colors.text.primary,
            textAlign: "center",
            marginBottom: 16,
            fontWeight: "700",
          }}
        >
          {item.title}
        </Text>

        {/* Description */}
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Quicksand-Regular",
            color: theme.colors.text.secondary,
            textAlign: "center",
            lineHeight: 24,
            paddingHorizontal: 20,
          }}
        >
          {item.description}
        </Text>
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <StatusBar style={theme.isDark ? "light" : "dark"} />

      {/* Content */}
      <View
        style={{
          flex: 1,
          paddingTop: insets.top + 60,
        }}
      >
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={{ flex: 1 }}
        >
          {onboardingData.map(renderOnboardingItem)}
        </ScrollView>

        {/* Pagination Dots */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginVertical: 32,
          }}
        >
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={{
                width: currentIndex === index ? 20 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor:
                  currentIndex === index
                    ? theme.colors.primary
                    : theme.colors.text.tertiary,
                marginHorizontal: 4,
              }}
            />
          ))}
        </View>
      </View>

      {/* Bottom Buttons */}
      <View
        style={{
          paddingHorizontal: 32,
          paddingBottom: insets.bottom + 20,
          gap: 16,
        }}
      >
        {isLastScreen ? (
          <Button
            title="Get Started"
            onPress={handleGetStarted}
            style={{
              backgroundColor: theme.colors.primary,
            }}
          />
        ) : (
          <View style={{ flexDirection: "row", gap: 16 }}>
            {currentIndex > 0 && (
              <Button
                title="Back"
                onPress={goToPrevious}
                variant="outline"
                style={{ flex: 1 }}
              />
            )}
            <Button
              title="Next"
              onPress={goToNext}
              style={{
                flex: currentIndex === 0 ? 1 : 1,
                backgroundColor: theme.colors.primary,
              }}
            />
          </View>
        )}
      </View>
    </View>
  );
}
