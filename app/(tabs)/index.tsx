import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  CheckCircle2,
  ClipboardList,
  CreditCard,
  FileText,
  Heart,
  LucideIcon,
  Package,
  Plus,
  PlusCircle,
  Search,
  ShoppingCart,
  UtensilsCrossed,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import { ERRAND_TEMPLATES } from '../../data/errandTemplates';
import { useOrders } from '../../hooks/useOrders';
import { useTheme } from "../../theme/index";

interface ErrandTemplate {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export default function HomeScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  // const { errandTemplates } = useAppStore();
  const { getOrderStats } = useOrders();
  const [trackOrderId, setTrackOrderId] = useState('');


  const orderStats = getOrderStats();

  const getIconComponent = (iconName: string): LucideIcon => {
    const icons: Record<string, LucideIcon> = {
      ShoppingCart,
      Package,
      CreditCard,
      Heart,
      FileText,
      UtensilsCrossed,
    };
    return icons[iconName] || Package;
  };

  const handleTrackOrder = () => {
    if (trackOrderId.trim()) {
      router.push(`/order/track-order?id=${trackOrderId}`);
    }
  };

  const handleErrandTemplate = (template: ErrandTemplate) => {
    router.push({
      pathname: '/(tabs)/errands',
      params: { template: template.title },
    });
  };

  return (
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
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          style={{
            paddingHorizontal: 20,
            marginBottom: 24,
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontFamily: "Quicksand-Bold",
              color: theme.colors.text.primary,
              marginBottom: 4,
              fontWeight: "700",
            }}
          >
            D2D Dashboard
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Quicksand-Regular",
              color: theme.colors.text.secondary,
            }}
          >
            Pick. Drop. Done.
          </Text>
        </View>

        {/* Summary Cards */}
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 20,
            marginBottom: 32,
            gap: 12,
          }}
        >
          <Card
            style={{
              flex: 1,
              alignItems: "center",
              backgroundColor: theme.colors.primary + "10",
              borderColor: theme.colors.primary + "20",
            }}
            padding={16}
          >
            <PlusCircle
              size={24}
              color={theme.colors.primary}
              strokeWidth={1.5}
            />
            <Text
              style={{
                fontSize: 20,
                fontFamily: "Quicksand-Bold",
                color: theme.colors.text.primary,
                marginTop: 8,
                marginBottom: 4,
                fontWeight: "700",
              }}
            >
              {orderStats.created}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Quicksand-Medium",
                color: theme.colors.text.secondary,
                textAlign: "center",
              }}
            >
              Created Orders
            </Text>
          </Card>

          <Card
            style={{
              flex: 1,
              alignItems: "center",
              backgroundColor: theme.colors.pending + "10",
              borderColor: theme.colors.pending + "20",
            }}
            padding={16}
          >
            <ClipboardList
              size={24}
              color={theme.colors.pending}
              strokeWidth={1.5}
            />
            <Text
              style={{
                fontSize: 20,
                fontFamily: "Quicksand-Bold",
                color: theme.colors.text.primary,
                marginTop: 8,
                marginBottom: 4,
                fontWeight: "700",
              }}
            >
              {orderStats.pending}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Quicksand-Medium",
                color: theme.colors.text.secondary,
                textAlign: "center",
              }}
            >
              Pending Orders
            </Text>
          </Card>

          <Card
            style={{
              flex: 1,
              alignItems: "center",
              backgroundColor: theme.colors.success + "10",
              borderColor: theme.colors.success + "20",
            }}
            padding={16}
          >
            <CheckCircle2
              size={24}
              color={theme.colors.success}
              strokeWidth={1.5}
            />
            <Text
              style={{
                fontSize: 20,
                fontFamily: "Quicksand-Bold",
                color: theme.colors.text.primary,
                marginTop: 8,
                marginBottom: 4,
                fontWeight: "700",
              }}
            >
              {orderStats.completed}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Quicksand-Medium",
                color: theme.colors.text.secondary,
                textAlign: "center",
              }}
            >
              Completed Orders
            </Text>
          </Card>
        </View>

        {/* Create Order Button */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Button
            title="Create Order"
            leftIcon={Plus}
            onPress={() => router.push("/order/create-order")}
            style={{
              backgroundColor: theme.colors.primary,
              paddingVertical: 18,
            }}
            textStyle={{
              fontSize: 18,
              fontFamily: "Quicksand-SemiBold",
            }}
          />
        </View>

        {/* Track Order */}
        <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Quicksand-SemiBold",
              color: theme.colors.text.primary,
              marginBottom: 12,
              fontWeight: "600",
            }}
          >
            Quick Track
          </Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Input
              placeholder="Enter Order ID"
              value={trackOrderId}
              onChangeText={setTrackOrderId}
              leftIcon={Search}
              style={{ flex: 1 }}
              onSubmitEditing={handleTrackOrder}
            />
            <Button
              title="Track"
              size="medium"
              fullWidth={false}
              onPress={handleTrackOrder}
              style={{
                paddingHorizontal: 20,
                backgroundColor: theme.colors.primary,
              }}
            />
          </View>
        </View>

        {/* Errand Templates */}
        <View style={{ paddingHorizontal: 20 }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Quicksand-SemiBold",
              color: theme.colors.text.primary,
              marginBottom: 16,
              fontWeight: "600",
            }}
          >
            Quick Errands
          </Text>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            {ERRAND_TEMPLATES.map((template) => {
              const IconComponent = getIconComponent(template.icon);
              return (
                <TouchableOpacity
                  key={template.id}
                  onPress={() => handleErrandTemplate(template)}
                  style={{
                    width: '47%',
                    backgroundColor: theme.colors.card.background,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    borderRadius: 12,
                    padding: 16,
                    alignItems: 'center',
                    shadowColor: theme.colors.shadow,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: theme.colors.primary + '15',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: 12,
                    }}
                  >
                    <IconComponent
                      size={24}
                      color={theme.colors.primary}
                      strokeWidth={1.5}
                    />
                  </View>

                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'Quicksand-SemiBold',
                      color: theme.colors.text.primary,
                      textAlign: 'center',
                      marginBottom: 4,
                      fontWeight: '600',
                    }}
                  >
                    {template.title}
                  </Text>

                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: 'Quicksand-Regular',
                      color: theme.colors.text.secondary,
                      textAlign: 'center',
                      lineHeight: 16,
                    }}
                  >
                    {template.description}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}