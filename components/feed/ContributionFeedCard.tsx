import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';
import type { FeedItem } from '../../services/api';

interface Props {
  item: FeedItem;
}

function getIcon(type: string) {
  switch (type) {
    case 'flower': return '🌸';
    case 'candle': return '🕯️';
    case 'photo': return '📷';
    default: return '💭';
  }
}

function getTypeLabel(type: string) {
  switch (type) {
    case 'flower': return 'ha lasciato un fiore';
    case 'candle': return 'ha acceso una candela';
    case 'photo': return 'ha aggiunto una foto';
    default: return 'ha lasciato un ricordo';
  }
}

export default function ContributionFeedCard({ item }: Props) {
  const router = useRouter();

  const timeAgo = formatDistanceToNow(new Date(item.timestamp), {
    addSuffix: true,
    locale: it,
  });

  const authorName = item.author
    ? [item.author.first_name, item.author.last_name].filter(Boolean).join(' ') || item.author.username
    : 'Anonimo';

  return (
    <Pressable
      style={styles.card}
      onPress={() => item.tombstone?.slug && router.push(`/memorial/${item.tombstone.slug}`)}
    >
      <View style={styles.header}>
        <View style={styles.iconBubble}>
          <Text style={styles.iconEmoji}>{getIcon(item.content_type || 'text')}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerText}>
            <Text style={styles.authorName}>{authorName}</Text>
            {' '}
            <Text style={styles.actionText}>{getTypeLabel(item.content_type || 'text')}</Text>
          </Text>
          <Text style={styles.time}>{timeAgo}</Text>
        </View>
      </View>

      {item.tombstone && (
        <View style={styles.memorialBadge}>
          <Text style={styles.memorialName}>{item.tombstone.full_name}</Text>
        </View>
      )}

      {item.text_content && (
        <Text style={styles.textContent} numberOfLines={3}>
          {item.text_content.replace(/<[^>]*>/g, '')}
        </Text>
      )}
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
  iconBubble: {
    width: 42,
    height: 42,
    borderRadius: 50,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconEmoji: {
    fontSize: 18,
  },
  headerInfo: {
    flex: 1,
  },
  headerText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 18,
  },
  authorName: {
    fontWeight: '600',
    color: '#111827',
  },
  actionText: {
    color: '#6B7280',
  },
  time: {
    fontSize: 12,
    color: '#9BA1A6',
    marginTop: 2,
  },
  memorialBadge: {
    marginTop: 10,
    backgroundColor: '#F8FAFC',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  memorialName: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  textContent: {
    fontSize: 13,
    color: '#4B5563',
    marginTop: 8,
    lineHeight: 18,
  },
});
