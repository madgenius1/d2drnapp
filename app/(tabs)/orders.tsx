import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { Package, Clock, CheckCircle2, Filter } from "lucide-react-native";
import { format } from "date-fns";
import { useTheme } from "../../theme/index";
import { useAppStore } from "../../store/index";
import Card from "@/components/common/Card";

const statusConfig = {
  created: { color: "#099d15", label: "Created" },
  picked: { color: "#F59E0B", label: "Picked Up" },
  in_transit: { color: "#1485FF", label: "In Transit" },
  delivered: { color: "#22C75A", label: "Delivered" },
};

export default function OrdersScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { orders } = useAppStore();
  const [filter, setFilter] = useState("all");

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ];

  const getFilteredOrders = () => {
    if (filter === "all") return orders;
    if (filter === "pending")
      return orders.filter((o) => o.status === "created");
    if (filter === "in_progress")
      return orders.filter((o) => ["picked", "in_transit"].includes(o.status));
    if (filter === "completed")
      return orders.filter((o) => o.status === "delivered");
    return orders;
  };

  const filteredOrders = getFilteredOrders();

  const renderOrderItem = ({ item }) => {
    const statusInfo = statusConfig[item.status] || statusConfig.created;

    return (
      <Card
        onPress={() => router.push(`/order-details?id=${item.id}`)}
        style={{ marginBottom: 12, marginHorizontal: 20 }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            marginBottom: 12,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: statusInfo.color + "20",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
            }}
          >
            <Package size={20} color={statusInfo.color} strokeWidth={1.5} />
          </View>

          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Quicksand-SemiBold",
                  color: theme.colors.text.primary,
                  flex: 1,
                  fontWeight: "600",
                }}
              >
                {item.type === "errand"
                  ? `Errand: ${item.description?.slice(0, 30)}...`
                  : `Order #${item.id.slice(-6)}`}
              </Text>
              <View
                style={{
                  backgroundColor: statusInfo.color,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Quicksand-Medium",
                    color: "#ffffff",
                  }}
                >
                  {statusInfo.label}
                </Text>
              </View>
            </View>

            {item.type !== "errand" && (
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Quicksand-Regular",
                  color: theme.colors.text.secondary,
                  marginBottom: 4,
                }}
              >
                {item.pickupLocation} → {item.dropoffLocation}
              </Text>
            )}

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Clock
                size={14}
                color={theme.colors.text.tertiary}
                strokeWidth={1.5}
              />
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Quicksand-Regular",
                  color: theme.colors.text.tertiary,
                  marginLeft: 4,
                }}
              >
                {format(new Date(item.createdAt), "MMM dd, yyyy • h:mm a")}
              </Text>
            </View>

            {item.totalPrice && (
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Quicksand-SemiBold",
                  color: theme.colors.primary,
                  marginTop: 8,
                  fontWeight: "600",
                }}
              >
                KES {item.totalPrice}
              </Text>
            )}
          </View>
        </View>
      </Card>
    );
  };

  const renderEmptyState = () => (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 40,
        paddingVertical: 60,
      }}
    >
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: theme.colors.primary + "15",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <Package size={36} color={theme.colors.primary} strokeWidth={1.5} />
      </View>

      <Text
        style={{
          fontSize: 20,
          fontFamily: "Quicksand-Bold",
          color: theme.colors.text.primary,
          textAlign: "center",
          marginBottom: 8,
          fontWeight: "700",
        }}
      >
        No Orders Yet
      </Text>

      <Text
        style={{
          fontSize: 16,
          fontFamily: "Quicksand-Regular",
          color: theme.colors.text.secondary,
          textAlign: "center",
          lineHeight: 22,
        }}
      >
        {filter === "all"
          ? "Create your first order to get started with D2D delivery service."
          : `No ${filter} orders found. Try changing the filter or create a new order.`}
      </Text>
    </View>
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <StatusBar style={theme.isDark ? "light" : "dark"} />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 20,
          paddingHorizontal: 20,
          paddingBottom: 20,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.divider,
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontFamily: "Quicksand-Bold",
            color: theme.colors.text.primary,
            marginBottom: 16,
            fontWeight: "700",
          }}
        >
          My Orders
        </Text>

        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12 }}
        >
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => setFilter(option.value)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor:
                  filter === option.value
                    ? theme.colors.primary
                    : theme.colors.elevated,
                borderWidth: 1,
                borderColor:
                  filter === option.value
                    ? theme.colors.primary
                    : theme.colors.border,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Quicksand-Medium",
                  color:
                    filter === option.value
                      ? "#ffffff"
                      : theme.colors.text.primary,
                }}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Orders List */}
      <View style={{ flex: 1 }}>
        {filteredOrders.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={filteredOrders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              paddingTop: 20,
              paddingBottom: insets.bottom + 20,
            }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}
