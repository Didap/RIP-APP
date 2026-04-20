import { View, Image, Pressable, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radii, Shadows } from '../../constants/theme';

interface Props {
  imageUrl: string;
  onBack: () => void;
  onShare?: () => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function HeroImage({ imageUrl, onBack, onShare }: Props) {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
      />
      <View style={styles.overlay} />
      <View style={styles.buttons}>
        <Pressable style={styles.circleButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </Pressable>
        <Pressable style={styles.circleButton} onPress={onShare}>
          <Ionicons name="share-outline" size={20} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: SCREEN_WIDTH,
    height: 320,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  buttons: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.subtle,
  },
});
