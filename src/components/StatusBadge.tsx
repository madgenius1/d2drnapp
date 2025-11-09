/**
 * Order Status Badge component
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';
import type { OrderStatus } from '../types';
import { STATUS_COLORS, STATUS_LABELS } from '../utils/constants';

interface StatusBadgeProps {
  status: OrderStatus;
  size?: 'small' | 'medium';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'medium' }) => {
  const label = STATUS_LABELS[status] || status;
  const color = STATUS_COLORS[status] || '#757575';

  return (
    <Chip
      mode="flat"
      style={[
        styles.chip,
        { backgroundColor: color },
        size === 'small' && styles.smallChip,
      ]}
      textStyle={[styles.text, size === 'small' && styles.smallText]}
    >
      {label}
    </Chip>
  );
};

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
  },
  smallChip: {
    height: 24,
  },
  text: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  smallText: {
    fontSize: 10,
  },
});