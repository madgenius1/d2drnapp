/**
 * Order Card component
 */

import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Divider, Text } from 'react-native-paper';
import { useTheme } from '../hooks/useTheme';
import type { Order } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { StatusBadge } from './StatusBadge';
import { Card } from './ui/Card';

interface OrderCardProps {
  order: Order;
  onPress: () => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onPress }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={[styles.orderId, { color: colors.text }]}>
              #{order.id.slice(0, 8)}
            </Text>
            <StatusBadge status={order.status} size="small" />
          </View>

          <Divider style={styles.divider} />

          <View style={styles.info}>
            <Text style={[styles.label, { color: colors.placeholder }]}>
              Pickup Date
            </Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {formatDate(order.sender.date)}
            </Text>
          </View>

          <View style={styles.info}>
            <Text style={[styles.label, { color: colors.placeholder }]}>
              Item
            </Text>
            <Text
              style={[styles.value, { color: colors.text }]}
              numberOfLines={1}
            >
              {order.sender.itemDescription}
            </Text>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.price, { color: colors.primary }]}>
              {formatCurrency(order.price)}
            </Text>
            <Text style={[styles.paymentType, { color: colors.placeholder }]}>
              {order.paymentType === 'payNow' ? 'Paid' : 'Pay on Pickup'}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
  },
  divider: {
    marginBottom: 12,
  },
  info: {
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
  },
  paymentType: {
    fontSize: 12,
  },
});