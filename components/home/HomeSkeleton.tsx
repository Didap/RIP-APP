import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { useAnimatedStyle, withRepeat, withTiming, useSharedValue } from 'react-native-reanimated';
import { useEffect } from 'react';
import { Colors, Radii, Spacing } from '../../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeSkeleton() {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.7, { duration: 800 }), -1, true);
  }, []);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <View style={styles.container}>
      {/* Featured Carousel Skeleton */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Animated.View style={[styles.titleLine, animStyle]} />
          <Animated.View style={[styles.linkLine, animStyle]} />
        </View>
        <View style={styles.carousel}>
          {[1, 2].map((i) => (
            <View key={i} style={styles.featuredCard}>
              <Animated.View style={[styles.cardImage, animStyle]} />
              <View style={styles.cardInfo}>
                <Animated.View style={[styles.cardLineLong, animStyle]} />
                <Animated.View style={[styles.cardLineShort, animStyle]} />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Recents List Skeleton */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
            <Animated.View style={[styles.titleLine, animStyle]} />
        </View>
        <View style={styles.list}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={styles.listItem}>
              <Animated.View style={[styles.listAvatar, animStyle]} />
              <View style={styles.listInfo}>
                <Animated.View style={[styles.cardLineLong, animStyle]} />
                <Animated.View style={[styles.cardLineShort, animStyle]} />
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginTop: Spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  titleLine: {
    height: 24,
    width: 120,
    backgroundColor: Colors.searchBg,
    borderRadius: 4,
  },
  linkLine: {
    height: 16,
    width: 80,
    backgroundColor: Colors.searchBg,
    borderRadius: 4,
  },
  carousel: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  featuredCard: {
    width: 260,
    height: 180,
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    overflow: 'hidden',
  },
  cardImage: {
    flex: 1,
    backgroundColor: Colors.searchBg,
  },
  cardInfo: {
    padding: Spacing.md,
    gap: 6,
  },
  cardLineLong: {
    height: 14,
    width: '70%',
    backgroundColor: Colors.searchBg,
    borderRadius: 4,
  },
  cardLineShort: {
    height: 10,
    width: '40%',
    backgroundColor: Colors.searchBg,
    borderRadius: 4,
  },
  list: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: Radii.md,
    gap: Spacing.md,
  },
  listAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.searchBg,
  },
  listInfo: {
    flex: 1,
    gap: 6,
  },
});
