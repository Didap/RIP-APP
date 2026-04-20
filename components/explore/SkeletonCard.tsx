import { View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withRepeat, withTiming, useSharedValue } from 'react-native-reanimated';
import { useEffect } from 'react';
import { Colors, Radii, Spacing } from '../../constants/theme';

interface Props {
  cardWidth: number;
}

export default function SkeletonCard({ cardWidth }: Props) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.7, { duration: 800 }), -1, true);
  }, []);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <View style={[styles.card, { width: cardWidth }]}>
      <Animated.View style={[styles.imageBlock, animStyle]} />
      <View style={styles.info}>
        <Animated.View style={[styles.lineLong, animStyle]} />
        <Animated.View style={[styles.lineShort, animStyle]} />
        <Animated.View style={[styles.lineTiny, animStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.md,
    overflow: 'hidden',
  },
  imageBlock: {
    width: '100%',
    height: 140,
    backgroundColor: Colors.searchBg,
  },
  info: {
    padding: Spacing.md,
    gap: 6,
  },
  lineLong: {
    height: 14,
    width: '80%',
    backgroundColor: Colors.searchBg,
    borderRadius: 4,
  },
  lineShort: {
    height: 10,
    width: '60%',
    backgroundColor: Colors.searchBg,
    borderRadius: 4,
  },
  lineTiny: {
    height: 10,
    width: '40%',
    backgroundColor: Colors.searchBg,
    borderRadius: 4,
  },
});
