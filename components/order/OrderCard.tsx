/**
 * Order Card Component
 * Displays order summary in list view
 */

import { ArrowRight, Clock, Package } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme';
import type { Order } from '../../types';
import { ORDER_STATUS_CONFIG } from '../../utils/constants';
import { formatCurrency, formatDateTime } from '../../utils/formatting';

interface OrderCardProps {
  order: Order;
  onPress: () => void;
}

export default function OrderCard({ order, onPress }: OrderCardProps) {
  const theme = useTheme();
  const statusConfig = ORDER_STATUS_CONFIG[order.status];

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.card.background,
          borderColor: theme.colors.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.header}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: statusConfig.color + '20' },
          ]}
        >
          <Package size={20} color={statusConfig.color} strokeWidth={1.5} />
        </View>

        <View style={styles.headerText}>
          <Text
            style={[
              styles.orderId,
              {
                color: theme.colors.text.primary,
                fontFamily: 'Quicksand-SemiBold',
              },
            ]}
          >
            {order.type === 'errand' ? 'Errand Order' : `Order #${order.id.slice(-6)}`}
          </Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusConfig.color },
            ]}
          >
            <Text style={[styles.statusText, { fontFamily: 'Quicksand-Medium' }]}>
              {statusConfig.label}
            </Text>
          </View>
        </View>
      </View>

      {/* Locations */}
      <View style={styles.locations}>
        <View style={styles.locationRow}>
          <View
            style={[styles.locationDot, { backgroundColor: theme.colors.primary }]}
          />
          <Text
            style={[
              styles.locationText,
              {
                color: theme.colors.text.secondary,
                fontFamily: 'Quicksand-Regular',
              },
            ]}
            numberOfLines={1}
          >
            {order.pickup.fullAddress}
          </Text>
        </View>

        <View style={styles.locationConnector}>
          <View
            style={[
              styles.connectorLine,
              { backgroundColor: theme.colors.border },
            ]}
          />
        </View>

        <View style={styles.locationRow}>
          <View
            style={[styles.locationDot, { backgroundColor: theme.colors.error }]}
          />
          <Text
            style={[
              styles.locationText,
              {
                color: theme.colors.text.secondary,
                fontFamily: 'Quicksand-Regular',
              },
            ]}
            numberOfLines={1}
          >
            {order.dropoff.fullAddress}
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Clock
            size={14}
            color={theme.colors.text.tertiary}
            strokeWidth={1.5}
          />
          <Text
            style={[
              styles.dateText,
              {
                color: theme.colors.text.tertiary,
                fontFamily: 'Quicksand-Regular',
              },
            ]}
          >
            {formatDateTime(order.createdAt)}
          </Text>
        </View>

        <Text
          style={[
            styles.priceText,
            {
              color: theme.colors.primary,
              fontFamily: 'Quicksand-SemiBold',
            },
          ]}
        >
          {formatCurrency(order.totalPrice)}
        </Text>
      </View>

      {/* Arrow indicator */}
      <View style={styles.arrowContainer}>
        <ArrowRight
          size={20}
          color={theme.colors.text.tertiary}
          strokeWidth={1.5}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#ffffff',
  },
  locations: {
    marginBottom: 12,
    paddingLeft: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  locationText: {
    fontSize: 14,
    flex: 1,
  },
  locationConnector: {
    height: 16,
    justifyContent: 'center',
    paddingLeft: 4,
  },
  connectorLine: {
    width: 2,
    height: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    marginLeft: 4,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
  },
  arrowContainer: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -10,
  },
});