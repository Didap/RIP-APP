import React from 'react';
import { View, ActivityIndicator, StyleSheet, Platform, Text } from 'react-native';
import { Colors, Spacing, FontFamilies } from '../../constants/theme';

interface Props {
  refreshing: boolean;
  color?: string;
}

export default function RefreshIndicatorWeb({ refreshing, color }: Props) {
  if (Platform.OS !== 'web' || !refreshing) return null;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ActivityIndicator size="small" color={color || Colors.accent} />
        <Text style={[styles.text, { color: color || Colors.accent }]}>
          Aggiornamento in corso...
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    backgroundColor: 'transparent',
    zIndex: 100,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    gap: Spacing.sm,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  text: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 13,
  },
});
