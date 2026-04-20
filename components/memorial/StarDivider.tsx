import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing } from '../../constants/theme';

interface Props {
  variant?: 'light' | 'dark';
}

export default function StarDivider({ variant = 'light' }: Props) {
  return (
    <View style={styles.container}>
      <View style={[styles.line, variant === 'dark' && styles.lineDark]} />
      <Text style={[styles.star, variant === 'dark' && styles.starDark]}>✦</Text>
      <View style={[styles.line, variant === 'dark' && styles.lineDark]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.gold,
    opacity: 0.3,
  },
  lineDark: {
    backgroundColor: Colors.gold,
    opacity: 0.4,
  },
  star: {
    color: Colors.gold,
    fontSize: 12,
  },
  starDark: {
    opacity: 0.7,
  },
});
