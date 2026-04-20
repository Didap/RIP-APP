import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import { useEffect } from 'react';
import { Colors, FontFamilies, Spacing } from '../../constants/theme';

interface Props {
  tabs: string[];
  activeTab: number;
  onTabChange: (index: number) => void;
}

export default function TabSelector({ tabs, activeTab, onTabChange }: Props) {
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withTiming(activeTab * 120, { duration: 250 });
  }, [activeTab]);

  const underlineStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.tabsRow}>
        {tabs.map((tab, i) => (
          <Pressable
            key={tab}
            style={styles.tab}
            onPress={() => onTabChange(i)}
          >
            <Text style={[
              styles.tabText,
              activeTab === i && styles.tabTextActive,
            ]}>
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.underlineContainer}>
        <Animated.View style={[styles.underline, underlineStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.md,
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.xxxl,
  },
  tab: {
    paddingVertical: Spacing.md,
  },
  tabText: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 16,
    color: Colors.textTertiary,
  },
  tabTextActive: {
    color: Colors.textPrimary,
  },
  underlineContainer: {
    height: 2,
    backgroundColor: Colors.border,
    marginLeft: Spacing.xl,
    width: 240,
  },
  underline: {
    width: 120,
    height: 2,
    backgroundColor: Colors.accent,
  },
});
