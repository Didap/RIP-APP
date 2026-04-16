import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';
import type { FeedItem } from '../../services/api';

interface Props {
  item: FeedItem;
}

export default function MemorialFeedCard({ item }: Props) {
  const router = useRouter();

  const timeAgo = formatDistanceToNow(new Date(item.timestamp), {
    addSuffix: true,
    locale: it,
  });

  const initials = item.full_name
    ? item.full_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <Pressable
      style={styles.card}
      onPress={() => item.slug && router.push(`/memorial/${item.slug}`)}
    >
      <View style={styles.header}>
        {item.profile_image?.url ? (
          <Image source={{ uri: item.profile_image.url }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        )}
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{item.full_name}</Text>
          <Text style={styles.time}>{timeAgo}</Text>
        </View>
      </View>

      {item.slogan && <Text style={styles.slogan}>"{item.slogan}"</Text>}

      {item.dates && (
        <Text style={styles.dates}>
          {item.dates.birth && new Date(item.dates.birth).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
          {item.dates.birth && item.dates.death ? ' — ' : ''}
          {item.dates.death && new Date(item.dates.death).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
        </Text>
      )}

      <View style={styles.footer}>
        <Text style={styles.visitLabel}>Visita il memoriale</Text>
        <Text style={styles.arrow}>→</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  time: {
    fontSize: 12,
    color: '#9BA1A6',
    marginTop: 2,
  },
  slogan: {
    fontSize: 13,
    color: '#6B7280',
    fontStyle: 'italic',
    marginTop: 10,
    lineHeight: 18,
  },
  dates: {
    fontSize: 12,
    color: '#9BA1A6',
    marginTop: 6,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 4,
  },
  visitLabel: {
    fontSize: 13,
    color: '#0a7ea4',
    fontWeight: '500',
  },
  arrow: {
    fontSize: 14,
    color: '#0a7ea4',
  },
});
