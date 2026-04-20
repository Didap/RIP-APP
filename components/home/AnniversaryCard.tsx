import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontFamilies, Spacing, Radii, Shadows } from '../../constants/theme';
import type { FeedItem } from '../../services/api';

interface Props {
  item: FeedItem;
}

export default function AnniversaryCard({ item }: Props) {
  const router = useRouter();
  const birthYear = item.dates?.birth?.slice(0, 4);
  const deathYear = item.dates?.death?.slice(0, 4);

  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/memorial/${item.slug}`)}
    >
      <Image
        source={{ uri: item.profile_image?.url }}
        style={styles.avatar}
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{item.full_name}</Text>
        <Text style={styles.dates}>{birthYear} — {deathYear}</Text>
        {item.city ? (
          <View style={styles.meta}>
            <Ionicons name="location-outline" size={11} color={Colors.textTertiary} />
            <Text style={styles.city}>{item.city}</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radii.md,
    padding: Spacing.md,
    gap: Spacing.md,
    ...Shadows.card,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    resizeMode: 'cover',
  },
  info: {
    flex: 1,
    gap: 1,
  },
  name: {
    fontFamily: FontFamilies.serif,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  dates: {
    fontFamily: FontFamilies.sans,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  city: {
    fontFamily: FontFamilies.sans,
    fontSize: 11,
    color: Colors.textTertiary,
  },
});
