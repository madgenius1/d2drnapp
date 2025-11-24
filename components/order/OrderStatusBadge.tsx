/**
 * OrderStatusBadge Component
 * Displays order status with color-coded badge
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { 
  PlusCircle, 
  PackageCheck, 
  Truck, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react-native';
import { useTheme } from '../../theme';
import { OrderStatus } from '../../types/models/Order';
import { getStatusConfig } from '../../data/constants/orderStatuses';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'small' | 'medium' | 'large';
  showIcon?: boolean;
  style?: any;
}

export default function OrderStatusBadge({
  status,
  size = 'medium',
  showIcon = true,
  style,
}: OrderStatusBadgeProps) {
  const theme = useTheme();
  const config = getStatusConfig(status);

  const getIconComponent = () => {
    switch (status) {
      case OrderStatus.CREATED:
        return PlusCircle;
      case OrderStatus.PICKED:
        return PackageCheck;
      case OrderStatus.IN_TRANSIT:
        return Truck;
      case OrderStatus.DELIVERED:
        return CheckCircle2;
      case OrderStatus.CANCELLED:
        return XCircle;
      default:
        return PlusCircle;
    }
  };

  const IconComponent = getIconComponent();

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingHorizontal: 8,
          paddingVertical: 4,
          fontSize: 12,
          iconSize: 12,
        };
      case 'large':
        return {
          paddingHorizontal: 16,
          paddingVertical: 10,
          fontSize: 16,
          iconSize: 18,
        };
      default: // medium
        return {
          paddingHorizontal: 12,
          paddingVertical: 6,
          fontSize: 14,
          iconSize: 14,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.color,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          paddingVertical: sizeStyles.paddingVertical,
        },
        style,
      ]}
    >
      {showIcon && (
        <IconComponent
          size={sizeStyles.iconSize}
          color="#ffffff"
          strokeWidth={2}
        />
      )}
      <Text
        style={[
          styles.text,
          {
            fontFamily: theme.fonts.medium,
            fontSize: sizeStyles.fontSize,
            marginLeft: showIcon ? 6 : 0,
          },
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    color: '#ffffff',
  },
});