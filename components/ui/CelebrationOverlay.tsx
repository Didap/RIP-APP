import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Text, Platform, Animated } from 'react-native';
import LottieView from 'lottie-react-native';
import { Colors, FontFamilies, Spacing, Radii } from '../../constants/theme';

const { width, height } = Dimensions.get('window');

interface Props {
  visible: boolean;
  type: 'candle' | 'flower' | 'text' | null;
  onFinished: () => void;
}

const LOTTIE_ASSETS = {
  flower: require('../../assets/animations/flower.json'),
  candle: null,
  text: null,
};

const EMOJIS = {
  flower: '🌺',
  candle: '🕯️',
  text: '💖',
};

export default function CelebrationOverlay({ visible, type, onFinished }: Props) {
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 6,
            tension: 40,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(2000),
        Animated.parallel([
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 0.8,
            friction: 8,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        onFinished();
      });
    } else {
      scaleAnim.setValue(0.5);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  if (!visible || !type) return null;

  const getLabel = () => {
    switch (type) {
      case 'candle': return 'Una luce splende ora in memoria';
      case 'flower': return 'Un fiore è stato posato';
      case 'text': return 'Il tuo pensiero è stato salvato';
      default: return 'Grazie per il tuo contributo';
    }
  };

  return (
    <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
      <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
        {type && LOTTIE_ASSETS[type] ? (
          <LottieView
            source={LOTTIE_ASSETS[type]}
            autoPlay
            loop={false}
            style={styles.lottie}
          />
        ) : (
          <Text style={styles.emoji}>
            {type ? EMOJIS[type] : ''}
          </Text>
        )}
        <Text style={styles.text}>{getLabel()}</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  card: {
    width: width * 0.8,
    backgroundColor: '#fff',
    borderRadius: Radii.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
      },
      default: {
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
    }),
  },
  lottie: {
    width: 200,
    height: 200,
    marginBottom: Spacing.md,
  },
  emoji: {
    fontSize: 80,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  text: {
    fontFamily: FontFamilies.serifBold,
    fontSize: 18,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
});
