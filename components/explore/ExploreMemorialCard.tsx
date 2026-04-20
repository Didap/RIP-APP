import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontFamilies, Spacing, Radii, Shadows } from '../../constants/theme';
import type { MemorialDetail } from '../../services/api';

interface Props {
  item: MemorialDetail;
  cardWidth: number;
}

export default function ExploreMemorialCard({ item, cardWidth }: Props) {
  const router = useRouter();
  const birthYear = item.dates?.birth?.slice(0, 4);
  const deathYear = item.dates?.death?.slice(0, 4);

  return (
    <Pressable
      style={[styles.card, { width: cardWidth }]}
      onPress={() => router.push(`/memorial/${item.slug}`)}
    >
      <Image
        source={{ uri: item.profile_image?.url }}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{item.full_name}</Text>
        <Text style={styles.dates}>{birthYear} — {deathYear}</Text>
        {item.city ? (
          <View style={styles.meta}>
            <Ionicons name="location-outline" size={10} color={Colors.textTertiary} />
            <Text style={styles.city}>{item.city}</Text>
          </View>
        ) : null}
        <View style={styles.candles}>
          <Ionicons name="flame" size={11} color={Colors.gold} />
          <Text style={styles.candleCount}>{item.stats?.candles ?? 0}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.md,
    overflow: 'hidden',
    ...Shadows.card,
  },
  image: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  info: {
    padding: Spacing.md,
    gap: 2,
  },
  name: {
    fontFamily: FontFamilies.serif,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  dates: {
    fontFamily: FontFamilies.sans,
    fontSize: 11,
    color: Colors.textSecondary,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 1,
  },
  city: {
    fontFamily: FontFamilies.sans,
    fontSize: 10,
    color: Colors.textTertiary,
  },
  candles: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 4,
  },
  candleCount: {
    fontFamily: FontFamilies.sans,
    fontSize: 11,
    color: Colors.textSecondary,
  },
});
