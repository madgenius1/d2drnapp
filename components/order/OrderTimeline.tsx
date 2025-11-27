/**
 * Order Timeline Component
 * Visual timeline showing order status progression
 */

import { CheckCircle2, Circle, Clock, Package, Truck } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme';
import type { Order, OrderStatus } from '../../types';
import { formatDateTime } from '../../utils/formatting';

interface OrderTimelineProps {
  order: Order;
}

interface TimelineStep {
  status: OrderStatus;
  label: string;
  icon: any;
  timestamp?: string;
}

export default function OrderTimeline({ order }: OrderTimelineProps) {
  const theme = useTheme();

  const steps: TimelineStep[] = [
    {
      status: 'scheduled',
      label: 'Order Created',
      icon: Clock,
      timestamp: order.createdAt,
    },
    {
      status: 'picked',
      label: 'Picked Up',
      icon: Package,
      timestamp: order.pickedAt,
    },
    {
      status: 'onTheWay',
      label: 'On The Way',
      icon: Truck,
      timestamp: undefined, // No specific timestamp for onTheWay
    },
    {
      status: 'dropped',
      label: 'Delivered',
      icon: CheckCircle2,
      timestamp: order.deliveredAt,
    },
  ];

  const currentStatusIndex = steps.findIndex((step) => step.status === order.status);
  const isCancelled = order.status === 'cancelled';

  const getStepStatus = (index: number): 'completed' | 'current' | 'upcoming' | 'cancelled' => {
    if (isCancelled) return 'cancelled';
    if (index < currentStatusIndex) return 'completed';
    if (index === currentStatusIndex) return 'current';
    return 'upcoming';
  };

  const getStepColor = (status: ReturnType<typeof getStepStatus>) => {
    switch (status) {
      case 'completed':
        return theme.colors.success;
      case 'current':
        return theme.colors.primary;
      case 'cancelled':
        return theme.colors.error;
      default:
        return theme.colors.text.tertiary;
    }
  };

  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const stepStatus = getStepStatus(index);
        const stepColor = getStepColor(stepStatus);
        const Icon = step.icon;
        const isLast = index === steps.length - 1;

        return (
          <View key={step.status} style={styles.stepContainer}>
            <View style={styles.iconColumn}>
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: stepColor + '20',
                    borderColor: stepColor,
                    borderWidth: stepStatus === 'current' ? 2 : 0,
                  },
                ]}
              >
                {stepStatus === 'completed' ? (
                  <CheckCircle2 size={20} color={stepColor} strokeWidth={2} />
                ) : stepStatus === 'current' ? (
                  <Icon size={20} color={stepColor} strokeWidth={2} />
                ) : (
                  <Circle size={20} color={stepColor} strokeWidth={1.5} />
                )}
              </View>
              {!isLast && (
                <View
                  style={[
                    styles.connector,
                    {
                      backgroundColor:
                        stepStatus === 'completed'
                          ? theme.colors.success
                          : theme.colors.border,
                    },
                  ]}
                />
              )}
            </View>

            <View style={styles.contentColumn}>
              <Text
                style={[
                  styles.label,
                  {
                    color:
                      stepStatus === 'upcoming'
                        ? theme.colors.text.tertiary
                        : theme.colors.text.primary,
                    fontFamily:
                      stepStatus === 'current'
                        ? 'Quicksand-SemiBold'
                        : 'Quicksand-Medium',
                  },
                ]}
              >
                {step.label}
              </Text>
              {step.timestamp && (
                <Text
                  style={[
                    styles.timestamp,
                    {
                      color: theme.colors.text.secondary,
                      fontFamily: 'Quicksand-Regular',
                    },
                  ]}
                >
                  {formatDateTime(step.timestamp)}
                </Text>
              )}
              {stepStatus === 'current' && (
                <Text
                  style={[
                    styles.currentLabel,
                    {
                      color: theme.colors.primary,
                      fontFamily: 'Quicksand-Medium',
                    },
                  ]}
                >
                  Current Status
                </Text>
              )}
            </View>
          </View>
        );
      })}

      {isCancelled && (
        <View style={styles.cancelledBanner}>
          <Text
            style={[
              styles.cancelledText,
              {
                color: theme.colors.error,
                fontFamily: 'Quicksand-SemiBold',
              },
            ]}
          >
            Order Cancelled
          </Text>
          {order.cancelledAt && (
            <Text
              style={[
                styles.cancelledTimestamp,
                {
                  color: theme.colors.text.secondary,
                  fontFamily: 'Quicksand-Regular',
                },
              ]}
            >
              {formatDateTime(order.cancelledAt)}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  stepContainer: {
    flexDirection: 'row',
    minHeight: 60,
  },
  iconColumn: {
    alignItems: 'center',
    marginRight: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connector: {
    width: 2,
    flex: 1,
    marginTop: 4,
    marginBottom: 4,
  },
  contentColumn: {
    flex: 1,
    paddingBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 14,
  },
  currentLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  cancelledBanner: {
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
  },
  cancelledText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cancelledTimestamp: {
    fontSize: 14,
  },
});