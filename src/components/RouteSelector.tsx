/**
 * Route Selector component
 * Updated to use new Route type (name + stops array)
 * Now with full-width button
 */

import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Menu, Text } from 'react-native-paper';
import { useTheme } from '../hooks/useTheme';
import type { Route } from '../types';

interface RouteSelectorProps {
  routes: Route[];
  selectedRoute: Route | null;
  onSelect: (route: Route) => void;
  label?: string;
  disabled?: boolean;
}

export const RouteSelector: React.FC<RouteSelectorProps> = ({
  routes,
  selectedRoute,
  onSelect,
  label = 'Select Route',
  disabled = false,
}) => {
  const [visible, setVisible] = useState(false);
  const { colors } = useTheme();

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleSelect = (route: Route) => {
    onSelect(route);
    closeMenu();
  };

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
            disabled={disabled}
            style={[styles.button, { borderColor: colors.border }]}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            {selectedRoute ? selectedRoute.name : 'Choose a route'}
          </Button>
        }
      >
        {routes.map((route) => (
          <Menu.Item
            key={route.name}
            onPress={() => handleSelect(route)}
            title={route.name}
            style={styles.menuItem}
          />
        ))}
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
  },
  menuItem: {
    maxWidth: '100%',
  },
});