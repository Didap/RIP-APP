import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontFamilies, Spacing, Radii } from '../../constants/theme';

interface Props {
  stats: { flowers: number; candles: number; memories: number };
  variant: 'light' | 'dark';
  onLightCandle: () => void;
  onLeaveFlower: () => void;
  onLeaveMemory: () => void;
}

export default function ContributionSection({ stats, variant, onLightCandle, onLeaveFlower, onLeaveMemory }: Props) {
  const isDark = variant === 'dark';

  return (
    <View style={styles.container}>
      <Text style={[styles.label, isDark && styles.labelDark]}>
        CONTRIBUTI DALLA COMUNITÀ
      </Text>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={[styles.count, isDark && styles.countDark]}>{stats.candles}</Text>
          <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>Candele</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.count, isDark && styles.countDark]}>{stats.flowers}</Text>
          <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>Fiori</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.count, isDark && styles.countDark]}>{stats.memories}</Text>
          <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>Ricordi</Text>
        </View>
      </View>

      <View style={styles.buttonsGrid}>
        <Pressable
          style={[styles.button, isDark ? styles.buttonDark : styles.buttonLight, { flex: 1 }]}
          onPress={onLightCandle}
        >
          <Ionicons name="flame" size={16} color="#fff" />
          <Text style={styles.buttonText}>Candela</Text>
        </Pressable>

        <Pressable
          style={[styles.button, isDark ? styles.buttonDark : styles.buttonLight, { flex: 1 }]}
          onPress={onLeaveFlower}
        >
          <Ionicons name="rose" size={16} color="#fff" />
          <Text style={styles.buttonText}>Fiore</Text>
        </Pressable>
      </View>

      <Pressable
        style={[styles.button, styles.memoryButton, { width: '100%' }]}
        onPress={onLeaveMemory}
      >
        <Ionicons name="chatbubble-ellipses" size={16} color="#fff" />
        <Text style={styles.buttonText}>Lascia un ricordo</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl,
    gap: Spacing.md,
  },
  label: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 11,
    color: Colors.textTertiary,
    letterSpacing: 2,
    marginBottom: Spacing.xs,
  },
  labelDark: {
    color: 'rgba(255,255,255,0.5)',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  statItem: {
    alignItems: 'flex-start',
  },
  count: {
    fontFamily: FontFamilies.serifBold,
    fontSize: 32,
    color: Colors.textPrimary,
    lineHeight: 40,
  },
  countDark: {
    color: '#fff',
  },
  statLabel: {
    fontFamily: FontFamilies.sans,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  statLabelDark: {
    color: 'rgba(255,255,255,0.6)',
  },
  buttonsGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radii.pill,
    gap: Spacing.xs,
  },
  buttonLight: {
    backgroundColor: Colors.accent,
  },
  buttonDark: {
    backgroundColor: Colors.gold,
  },
  memoryButton: {
    backgroundColor: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  buttonText: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 14,
    color: '#fff',
  },
});
