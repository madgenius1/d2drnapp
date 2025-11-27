/**
 * Payment Selector Component
 * Toggle between payment methods
 */

import { Banknote, CheckCircle2, CreditCard } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme';
import type { PaymentMethod } from '../../types';
import { PAYMENT_METHOD_CONFIG } from '../../utils/constants';

interface PaymentSelectorProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  disabled?: boolean;
  style?: object;
}

export default function PaymentSelector({
  value,
  onChange,
  disabled = false,
  style,
}: PaymentSelectorProps) {
  const theme = useTheme();

  const paymentMethods: PaymentMethod[] = ['payNow', 'payOnPickup'];

  const getIcon = (method: PaymentMethod) => {
    return method === 'payNow' ? CreditCard : Banknote;
  };

  return (
    <View style={style}>
      {/* Section Header */}
      <Text
        style={[
          styles.header,
          {
            color: theme.colors.text.primary,
            fontFamily: 'Quicksand-SemiBold',
          },
        ]}
      >
        Payment Method
      </Text>

      {/* Payment Options */}
      <View style={styles.optionsContainer}>
        {paymentMethods.map((method) => {
          const isSelected = value === method;
          const config = PAYMENT_METHOD_CONFIG[method];
          const Icon = getIcon(method);

          return (
            <TouchableOpacity
              key={method}
              style={[
                styles.option,
                {
                  backgroundColor: isSelected
                    ? theme.colors.primary + '15'
                    : theme.colors.card.background,
                  borderColor: isSelected
                    ? theme.colors.primary
                    : theme.colors.border,
                },
              ]}
              onPress={() => onChange(method)}
              disabled={disabled}
              activeOpacity={0.7}
            >
              <View style={styles.optionLeft}>
                <View
                  style={[
                    styles.iconContainer,
                    {
                      backgroundColor: isSelected
                        ? theme.colors.primary + '20'
                        : theme.colors.elevated,
                    },
                  ]}
                >
                  <Icon
                    size={20}
                    color={
                      isSelected ? theme.colors.primary : theme.colors.text.secondary
                    }
                    strokeWidth={1.5}
                  />
                </View>

                <View style={styles.optionText}>
                  <Text
                    style={[
                      styles.optionLabel,
                      {
                        color: isSelected
                          ? theme.colors.primary
                          : theme.colors.text.primary,
                        fontFamily: 'Quicksand-SemiBold',
                      },
                    ]}
                  >
                    {config.label}
                  </Text>
                  <Text
                    style={[
                      styles.optionDescription,
                      {
                        color: theme.colors.text.secondary,
                        fontFamily: 'Quicksand-Regular',
                      },
                    ]}
                  >
                    {config.description}
                  </Text>
                </View>
              </View>

              {isSelected && (
                <CheckCircle2
                  size={24}
                  color={theme.colors.primary}
                  strokeWidth={2}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});