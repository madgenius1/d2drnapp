/**
 * Stop Picker component
 * Now with full-width button
 */

import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Menu, Text } from 'react-native-paper';
import { useTheme } from '../hooks/useTheme';
import type { Route } from '../types';

interface StopPickerProps {
  route: Route | null;
  selectedStopName: string | null;
  onSelect: (stopName: string) => void;
  label?: string;
  disabled?: boolean;
  excludeStopName?: string | null;
}

export const StopPicker: React.FC<StopPickerProps> = ({
  route,
  selectedStopName,
  onSelect,
  label = 'Select Stop',
  disabled = false,
  excludeStopName = null,
}) => {
  const [visible, setVisible] = useState(false);
  const { colors } = useTheme();

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleSelect = (stopName: string) => {
    onSelect(stopName);
    closeMenu();
  };

  const availableStops = route?.stops.filter((s) => s !== excludeStopName) || [];

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        contentStyle={styles.menuContent}
        anchor={
          <Button
            mode="outlined"
            onPress={openMenu}
            disabled={disabled || !route}
            style={[styles.button, { borderColor: colors.border }]}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            {selectedStopName || 'Choose a stop'}
          </Button>
        }
      >
        <ScrollView style={styles.menuScroll}>
          {availableStops.map((stopName) => (
            <Menu.Item
              key={stopName}
              onPress={() => handleSelect(stopName)}
              title={stopName}
              style={styles.menuItem}
            />
          ))}
        </ScrollView>
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  button: {
    width: '100%',
    justifyContent: 'flex-start',
  },
  buttonContent: {
    width: '100%',
    justifyContent: 'flex-start',
  },
  buttonLabel: {
    textAlign: 'left',
  },
  menuContent: {
    width: '90%',
    maxWidth: 400,
    maxHeight: 300,
  },
  menuScroll: {
    maxHeight: 250,
  },
  menuItem: {
    maxWidth: '100%',
  },
});