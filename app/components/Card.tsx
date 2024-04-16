import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../theme/useTheme';
import { spacing } from '../theme/theme';
import { CardPropsType } from '../types/components';

const Card = ({ children, style }: CardPropsType) => {
  const { theme } = useTheme();
  const responsivePadding = spacing.layoutPaddingH; // This will be used for both horizontal and vertical padding

  return (
    <View style={[styles.card, { backgroundColor: theme.cardBg, padding: responsivePadding }, style]}>
      {children}
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  card: {
    width: '100%', // Full width
    backgroundColor: '#ffffff', // Default white background
    borderRadius: spacing.borderRadius, // Border radius from theme
    // Removed explicit paddingHorizontal and paddingVertical
  },
});
