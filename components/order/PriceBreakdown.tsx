/**
 * Price Breakdown Component
 * Displays detailed pricing calculation
 */

import { ChevronDown, ChevronUp, Info } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme';
import type { PriceBreakdown as PriceBreakdownType } from '../../types';
import { formatCurrency } from '../../utils/formatting';
import Card from '../common/Card';

interface PriceBreakdownProps {
  breakdown: PriceBreakdownType;
  showDetails?: boolean;
  style?: object;
}

export default function PriceBreakdown({
  breakdown,
  showDetails = true,
  style,
}: PriceBreakdownProps) {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card style={style}>
      {/* Header */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => showDetails && setIsExpanded(!isExpanded)}
        activeOpacity={showDetails ? 0.7 : 1}
        disabled={!showDetails}
      >
        <View style={styles.headerLeft}>
          <Text
            style={[
              styles.headerTitle,
              {
                color: theme.colors.text.primary,
                fontFamily: 'Quicksand-SemiBold',
              },
            ]}
          >
            Price Breakdown
          </Text>
          {breakdown.isSameRoute && (
            <View
              style={[
                styles.badge,
                { backgroundColor: theme.colors.info + '15' },
              ]}
            >
              <Info size={12} color={theme.colors.info} strokeWidth={2} />
              <Text
                style={[
                  styles.badgeText,
                  {
                    color: theme.colors.info,
                    fontFamily: 'Quicksand-Medium',
                  },
                ]}
              >
                Same Route
              </Text>
            </View>
          )}
        </View>
        {showDetails &&
          (isExpanded ? (
            <ChevronUp
              size={20}
              color={theme.colors.text.tertiary}
              strokeWidth={1.5}
            />
          ) : (
            <ChevronDown
              size={20}
              color={theme.colors.text.tertiary}
              strokeWidth={1.5}
            />
          ))}
      </TouchableOpacity>

      {/* Details */}
      {isExpanded && showDetails && (
        <View style={styles.details}>
          <View
            style={[styles.divider, { backgroundColor: theme.colors.divider }]}
          />

          {breakdown.isSameRoute ? (
            <View style={styles.row}>
              <Text
                style={[
                  styles.label,
                  {
                    color: theme.colors.text.secondary,
                    fontFamily: 'Quicksand-Regular',
                  },
                ]}
              >
                Same Route Price
              </Text>
              <Text
                style={[
                  styles.value,
                  {
                    color: theme.colors.text.primary,
                    fontFamily: 'Quicksand-Medium',
                  },
                ]}
              >
                {formatCurrency(breakdown.total)}
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.row}>
                <Text
                  style={[
                    styles.label,
                    {
                      color: theme.colors.text.secondary,
                      fontFamily: 'Quicksand-Regular',
                    },
                  ]}
                >
                  Pickup Cost
                </Text>
                <Text
                  style={[
                    styles.value,
                    {
                      color: theme.colors.text.primary,
                      fontFamily: 'Quicksand-Medium',
                    },
                  ]}
                >
                  {formatCurrency(breakdown.pickupCost)}
                </Text>
              </View>

              <View style={styles.row}>
                <Text
                  style={[
                    styles.label,
                    {
                      color: theme.colors.text.secondary,
                      fontFamily: 'Quicksand-Regular',
                    },
                  ]}
                >
                  Transfer Fee
                </Text>
                <Text
                  style={[
                    styles.value,
                    {
                      color: theme.colors.text.primary,
                      fontFamily: 'Quicksand-Medium',
                    },
                  ]}
                >
                  {formatCurrency(breakdown.transferFee)}
                </Text>
              </View>

              <View style={styles.row}>
                <Text
                  style={[
                    styles.label,
                    {
                      color: theme.colors.text.secondary,
                      fontFamily: 'Quicksand-Regular',
                    },
                  ]}
                >
                  Drop-off Cost
                </Text>
                <Text
                  style={[
                    styles.value,
                    {
                      color: theme.colors.text.primary,
                      fontFamily: 'Quicksand-Medium',
                    },
                  ]}
                >
                  {formatCurrency(breakdown.dropoffCost)}
                </Text>
              </View>
            </>
          )}
        </View>
      )}

      {/* Total */}
      <View
        style={[
          styles.total,
          isExpanded && showDetails && {
            borderTopWidth: 1,
            borderTopColor: theme.colors.divider,
            paddingTop: 16,
          },
        ]}
      >
        <Text
          style={[
            styles.totalLabel,
            {
              color: theme.colors.text.primary,
              fontFamily: 'Quicksand-Bold',
            },
          ]}
        >
          Total Price
        </Text>
        <Text
          style={[
            styles.totalValue,
            {
              color: theme.colors.primary,
              fontFamily: 'Quicksand-Bold',
            },
          ]}
        >
          {formatCurrency(breakdown.total)}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 12,
  },
  badgeText: {
    fontSize: 12,
    marginLeft: 4,
  },
  details: {
    marginTop: 16,
  },
  divider: {
    height: 1,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
  },
  value: {
    fontSize: 14,
  },
  total: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '700',
  },
});