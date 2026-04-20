import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontFamilies, Spacing, Radii } from '../../constants/theme';

interface Props {
  icon: string;
  label: string;
  active?: boolean;
  onPress: () => void;
}

export default function FilterChip({ icon, label, active, onPress }: Props) {
  return (
    <Pressable
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
    >
      <Ionicons
        name={icon as any}
        size={16}
        color={active ? Colors.accent : Colors.textSecondary}
      />
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.searchBg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.pill,
    gap: Spacing.xs,
  },
  chipActive: {
    backgroundColor: Colors.accentLight,
  },
  label: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  labelActive: {
    color: Colors.accent,
  },
});
