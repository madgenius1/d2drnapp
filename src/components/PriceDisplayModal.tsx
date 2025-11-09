/**
 * Price Display Modal component
 * Simplified - only shows final calculated rate
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider, IconButton, Modal, Portal, Text } from 'react-native-paper';
import { useTheme } from '../hooks/useTheme';
import { formatCurrency } from '../utils/formatters';

interface PriceDisplayModalProps {
  visible: boolean;
  onDismiss: () => void;
  price: number;
  isSameRoute: boolean;
}

export const PriceDisplayModal: React.FC<PriceDisplayModalProps> = ({
  visible,
  onDismiss,
  price,
  isSameRoute,
}) => {
  const { colors } = useTheme();

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          styles.modal,
          { backgroundColor: colors.card },
        ]}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Delivery Rate
          </Text>
          <IconButton icon="close" size={24} onPress={onDismiss} />
        </View>

        <Divider />

        <View style={styles.content}>
          <Text style={[styles.routeType, { color: colors.placeholder }]}>
            {isSameRoute ? 'Same Route Delivery' : 'Different Routes Delivery'}
          </Text>

          <View style={styles.priceContainer}>
            <Text style={[styles.priceAmount, { color: colors.primary }]}>
              {formatCurrency(price)}
            </Text>
          </View>

          <Text style={[styles.note, { color: colors.placeholder }]}>
            This is the estimated delivery cost for your selected route and stops.
          </Text>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 20,
    borderRadius: 16,
    maxHeight: '60%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  routeType: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  priceContainer: {
    paddingVertical: 24,
  },
  priceAmount: {
    fontSize: 48,
    fontWeight: '700',
    textAlign: 'center',
  },
  note: {
    fontSize: 12,
    marginTop: 16,
    textAlign: 'center',
    lineHeight: 18,
  },
});