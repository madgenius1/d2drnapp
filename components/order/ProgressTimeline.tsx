/**
 * ProgressTimeline Component
 * Visual timeline showing delivery progress
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { 
  PlusCircle, 
  PackageCheck, 
  Truck, 
  CheckCircle2 
} from 'lucide-react-native';
import { useTheme } from '../../theme';
import { OrderStatus } from '../../types/models/Order';
import { TIMELINE_STEPS, getCurrentStepIndex } from '../../data/constants/orderStatuses';

interface ProgressTimelineProps {
  currentStatus: OrderStatus;
  style?: any;
}

export default function ProgressTimeline({
  currentStatus,
  style,
}: ProgressTimelineProps) {
  const theme = useTheme();
  const currentIndex = getCurrentStepIndex(currentStatus);

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      PlusCircle,
      PackageCheck,
      Truck,
      CheckCircle2,
    };
    return icons[iconName] || PlusCircle;
  };

  const isStepCompleted = (index: number): boolean => {
    return index <= currentIndex;
  };

  const isStepCurrent = (index: number): boolean => {
    return index === currentIndex;
  };

  return (
    <View style={[styles.container, style]}>
      {TIMELINE_STEPS.map((step, index) => {
        const IconComponent = getIconComponent(step.icon);
        const completed = isStepCompleted(index);
        const current = isStepCurrent(index);
        const isLast = index === TIMELINE_STEPS.length - 1;

        return (
          <View key={step.status} style={styles.stepContainer}>
            <View style={styles.stepContent}>
              {/* Icon */}
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: completed
                      ? step.color
                      : theme.colors.text.tertiary + '30',
                    borderColor: current ? step.color : 'transparent',
                    borderWidth: current ? 3 : 0,
                  },
                ]}
              >
                <IconComponent
                  size={18}
                  color={completed ? '#ffffff' : theme.colors.text.tertiary}
                  strokeWidth={2}
                />
              </View>

              {/* Connector Line */}
              {!isLast && (
                <View
                  style={[
                    styles.connector,
                    {
                      backgroundColor: completed
                        ? step.color
                        : theme.colors.text.tertiary + '30',
                    },
                  ]}
                />
              )}
            </View>

            {/* Label */}
            <Text
              style={[
                styles.label,
                {
                  fontFamily: current ? theme.fonts.semibold : theme.fonts.regular,
                  color: completed
                    ? theme.colors.text.primary
                    : theme.colors.text.tertiary,
                  fontWeight: current ? '600' : '400',
                },
              ]}
            >
              {step.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  stepContainer: {
    flex: 1,
    alignItems: 'center',
  },
  stepContent: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  connector: {
    position: 'absolute',
    top: 22,
    left: '50%',
    right: '-50%',
    height: 2,
    zIndex: 1,
  },
  label: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
});