/**
 * Orders tab screen
 */

import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    View,
} from 'react-native';
import { Chip, Searchbar, Text } from 'react-native-paper';
import { OrderCard } from '../../components/OrderCard';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../hooks/useOrders';
import { useTheme } from '../../hooks/useTheme';
import type { OrderStatus } from '../../types';

const STATUS_FILTERS: Array<{ label: string; value: OrderStatus | 'all' }> = [
  { label: 'All', value: 'all' },
  { label: 'Scheduled', value: 'scheduled' },
  { label: 'In Progress', value: 'picked' },
  { label: 'Completed', value: 'completed' },
];

export default function OrdersScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();
  
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const { orders, loading } = useOrders({
    userId: user?.uid || null,
    statusFilter: statusFilter === 'all' ? undefined : statusFilter,
  });

  const filteredOrders = orders.filter((order) => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      order.id.toLowerCase().includes(searchLower) ||
      order.sender.itemDescription.toLowerCase().includes(searchLower) ||
      order.recipient.name.toLowerCase().includes(searchLower)
    );
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    // The useOrders hook automatically refreshes via Firestore listener
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (loading && !refreshing) {
    return <LoadingSpinner message="Loading orders..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search orders..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />

        <View style={styles.filters}>
          {STATUS_FILTERS.map((filter) => (
            <Chip
              key={filter.value}
              selected={statusFilter === filter.value}
              onPress={() => setStatusFilter(filter.value)}
              style={styles.chip}
              mode={statusFilter === filter.value ? 'flat' : 'outlined'}
            >
              {filter.label}
            </Chip>
          ))}
        </View>
      </View>

      {filteredOrders.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: colors.placeholder }]}>
            {searchQuery
              ? 'No orders match your search'
              : statusFilter === 'all'
              ? 'No orders yet. Create your first order!'
              : `No ${statusFilter} orders`}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              onPress={() =>
                router.push({
                  pathname: '/order-details',
                  params: { orderId: item.id },
                })
              }
            />
          )}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  searchbar: {
    marginBottom: 12,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  list: {
    padding: 16,
    paddingTop: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});