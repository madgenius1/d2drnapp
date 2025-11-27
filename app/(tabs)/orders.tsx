/**
 * Orders Screen (TypeScript)
 * List and filter user orders
 */

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Package } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import OrderCard from '../../components/order/OrderCard';
import { useOrders } from '../../hooks/useOrders';
import { useTheme } from '../../theme';
import type { Order } from '../../types';

type FilterType = 'all' | 'pending' | 'in_progress' | 'completed';

const filterOptions: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

export default function OrdersScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { orders, getFilteredOrders } = useOrders();
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredOrders = getFilteredOrders(filter);

  const renderOrderItem = ({ item }: { item: Order }) => (
    <OrderCard
      order={item}
      onPress={() => router.push(`/order/order-details?id=${item.id}`)}
    />
  );

  const renderEmptyState = () => (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingVertical: 60,
      }}
    >
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: theme.colors.primary + '15',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <Package size={36} color={theme.colors.primary} strokeWidth={1.5} />
      </View>

      <Text
        style={{
          fontSize: 20,
          fontFamily: 'Quicksand-Bold',
          color: theme.colors.text.primary,
          textAlign: 'center',
          marginBottom: 8,
          fontWeight: '700',
        }}
      >
        No Orders Yet
      </Text>

      <Text
        style={{
          fontSize: 16,
          fontFamily: 'Quicksand-Regular',
          color: theme.colors.text.secondary,
          textAlign: 'center',
          lineHeight: 22,
        }}
      >
        {filter === 'all'
          ? 'Create your first order to get started with D2D delivery service.'
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
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />

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
            fontFamily: 'Quicksand-Bold',
            color: theme.colors.text.primary,
            marginBottom: 16,
            fontWeight: '700',
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
                  fontFamily: 'Quicksand-Medium',
                  color:
                    filter === option.value
                      ? '#ffffff'
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