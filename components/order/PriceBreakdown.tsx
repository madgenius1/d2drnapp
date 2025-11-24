/**
 * PriceBreakdown Component
 * Displays price breakdown with same/different route details
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DollarSign, ChevronDown, ChevronUp, Info } from 'lucide-react-native';
import { useTheme } from '../../theme';
import { PriceBreakdown as PriceBreakdownType } from '../../types/models/PriceBreakdown';
import { formatPrice } from '../../utils/formatting/priceFormatter';
import Card from '../common/Card';

interface PriceBreakdownProps {
  priceBreakdown: PriceBreakdownType;
  showBreakdown?: boolean;
  style?: any;
}

export default function PriceBreakdownComponent({
  priceBreakdown,
  showBreakdown = true,
  style,
}: PriceBreakdownProps) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const { isSameRoute, total, currency } = priceBreakdown;

  return (
    <Card style={[styles.container, style]} shadow={true}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: theme.colors.primary + '15' },
            ]}
          >
            <DollarSign
              size={20}
              color={theme.colors.primary}
              strokeWidth={1.5}
            />
          </View>

          <View>
            <Text
              style={[
                styles.headerTitle,
                {
                  fontFamily: theme.fonts.semibold,
                  color: theme.colors.text.primary,
                },
              ]}
            >
              Price Breakdown
            </Text>
            <Text
              style={[
                styles.routeType,
                {
                  fontFamily: theme.fonts.regular,
                  color: theme.colors.text.secondary,
                },
              ]}
            >
              {isSameRoute ? 'Same Route' : 'Different Routes'}
            </Text>
          </View>
        </View>

        {showBreakdown && (
          <TouchableOpacity
            onPress={() => setExpanded(!expanded)}
            style={styles.expandButton}
          >
            {expanded ? (
              <ChevronUp size={20} color={theme.colors.text.tertiary} />
            ) : (
              <ChevronDown size={20} color={theme.colors.text.tertiary} />
            )}
          </TouchableOpacity>
        )}
      </View>

      {expanded && showBreakdown && (
        <View
          style={[
            styles.detailsContainer,
            { borderTopColor: theme.colors.divider },
          ]}
        >
          {isSameRoute ? (
            <View>
              <View style={styles.row}>
                <Text
                  style={[
                    styles.label,
                    {
                      fontFamily: theme.fonts.regular,
                      color: theme.colors.text.secondary,
                    },
                  ]}
                >
                  Same Route Price
                </Text>
                <Text
                  style={[
                    styles.value,
                    {
                      fontFamily: theme.fonts.medium,
                      color: theme.colors.text.primary,
                    },
                  ]}
                >
                  {formatPrice(total, currency)}
                </Text>
              </View>

              <View
                style={[
                  styles.infoBox,
                  {
                    backgroundColor: theme.colors.info + '10',
                    borderColor: theme.colors.info + '20',
                  },
                ]}
              >
                <Info size={14} color={theme.colors.info} />
                <Text
                  style={[
                    styles.infoText,
                    {
                      fontFamily: theme.fonts.regular,
                      color: theme.colors.text.secondary,
                    },
                  ]}
                >
                  Delivery on the same route is more affordable
                </Text>
              </View>
            </View>
          ) : (
            <View>
              <View style={styles.row}>
                <Text
                  style={[
                    styles.label,
                    {
                      fontFamily: theme.fonts.regular,
                      color: theme.colors.text.secondary,
                    },
                  ]}
                >
                  Pickup Cost
                </Text>
                <Text
                  style={[
                    styles.value,
                    {
                      fontFamily: theme.fonts.medium,
                      color: theme.colors.text.primary,
                    },
                  ]}
                >
                  {formatPrice(priceBreakdown.pickupCost, currency)}
                </Text>
              </View>

              <View style={styles.row}>
                <Text
                  style={[
                    styles.label,
                    {
                      fontFamily: theme.fonts.regular,
                      color: theme.colors.text.secondary,
                    },
                  ]}
                >
                  Transfer Fee
                </Text>
                <Text
                  style={[
                    styles.value,
                    {
                      fontFamily: theme.fonts.medium,
                      color: theme.colors.text.primary,
                    },
                  ]}
                >
                  {formatPrice(priceBreakdown.transferFee, currency)}
                </Text>
              </View>

              <View style={styles.row}>
                <Text
                  style={[
                    styles.label,
                    {
                      fontFamily: theme.fonts.regular,
                      color: theme.colors.text.secondary,
                    },
                  ]}
                >
                  Drop-off Cost
                </Text>
                <Text
                  style={[
                    styles.value,
                    {
                      fontFamily: theme.fonts.medium,
                      color: theme.colors.text.primary,
                    },
                  ]}
                >
                  {formatPrice(priceBreakdown.dropoffCost, currency)}
                </Text>
              </View>
            </View>
          )}
        </View>
      )}

      <View
        style={[styles.totalContainer, { borderTopColor: theme.colors.divider }]}
      >
        <Text
          style={[
            styles.totalLabel,
            {
              fontFamily: theme.fonts.bold,
              color: theme.colors.text.primary,
            },
          ]}
        >
          Total Price
        </Text>
        <Text
          style={[
            styles.totalValue,
            {
              fontFamily: theme.fonts.bold,
              color: theme.colors.primary,
            },
          ]}
        >
          {formatPrice(total, currency)}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 16,
    marginBottom: 2,
    fontWeight: '600',
  },
  routeType: {
    fontSize: 14,
  },
  expandButton: {
    padding: 8,
  },
  detailsContainer: {
    borderTopWidth: 1,
    paddingTop: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
  },
  value: {
    fontSize: 14,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
  },
  infoText: {
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 16,
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