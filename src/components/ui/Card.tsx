/**
 * Custom Card component
 */

import React, { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import type { CardProps as PaperCardProps } from 'react-native-paper';
import { Card as PaperCard } from 'react-native-paper';
import { useTheme } from '../../hooks/useTheme';

interface CardProps extends PaperCardProps {
  children: ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, style, ...props }) => {
  const { colors } = useTheme();

  return (
    <PaperCard
      style={[styles.card, { backgroundColor: colors.card }, style]}
      {...props}
    >
      {children}
    </PaperCard>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    elevation: 2,
    marginVertical: 8,
  },
});