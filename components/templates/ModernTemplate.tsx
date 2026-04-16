import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import type { MemorialDetail } from '../../services/api';

interface Props {
  memorial: MemorialDetail;
}

function formatDate(date: string | undefined | null) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function authorName(author: any) {
  if (!author) return 'Anonimo';
  return [author.first_name, author.last_name].filter(Boolean).join(' ') || author.username;
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m fa`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h fa`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}g fa`;
  return formatDate(date);
}

export default function ModernTemplate({ memorial }: Props) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        {memorial.profile_image?.url ? (
          <Image source={{ uri: memorial.profile_image.url }} style={styles.profileImg} />
        ) : (
          <View style={styles.profilePlaceholder}>
            <Text style={styles.profilePlaceholderText}>{getInitials(memorial.full_name)}</Text>
          </View>
        )}
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{memorial.full_name}</Text>
          {memorial.dates ? (
            <Text style={styles.dates}>
              {memorial.dates.birth ? formatDate(memorial.dates.birth) : ''}
              {memorial.dates.birth && memorial.dates.death ? ' — ' : ''}
              {memorial.dates.death ? formatDate(memorial.dates.death) : ''}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Slogan badge */}
      {memorial.slogan ? (
        <View style={styles.sloganBadge}>
          <Text style={styles.sloganText}>{memorial.slogan}</Text>
        </View>
      ) : null}

      {/* Stats chips */}
      <View style={styles.statsRow}>
        <View style={styles.statChip}>
          <Text>🌸</Text>
          <Text style={styles.statChipText}>{memorial.stats.flowers} Fiori</Text>
        </View>
        <View style={styles.statChip}>
          <Text>🕯️</Text>
          <Text style={styles.statChipText}>{memorial.stats.candles} Candele</Text>
        </View>
        <View style={styles.statChip}>
          <Text>💭</Text>
          <Text style={styles.statChipText}>{memorial.stats.memories} Ricordi</Text>
        </View>
      </View>

      {/* Biography */}
      {memorial.biography ? (
        <View style={styles.bioCard}>
          <Text style={styles.cardTitle}>La sua storia</Text>
          <Text style={styles.bioText}>{memorial.biography.replace(/<[^>]*>/g, '\n')}</Text>
        </View>
      ) : null}

      {/* Connections */}
      {memorial.connections.length > 0 ? (
        <View style={styles.connectionsCard}>
          <Text style={styles.cardTitle}>Famiglia</Text>
          <View style={styles.tagsList}>
            {memorial.connections.map((conn, i) => (
              <View key={i} style={styles.tag}>
                <Text style={styles.tagText}>{conn.relation_type}: {conn.user?.first_name} {conn.user?.last_name}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {/* Contributions feed */}
      <View style={styles.contributionsCard}>
        <Text style={styles.cardTitle}>
          Ricordi <Text style={styles.countText}>({memorial.stats.total})</Text>
        </Text>
        {memorial.contributions.length === 0 ? (
          <Text style={styles.emptyText}>Nessun ricordo ancora</Text>
        ) : (
          memorial.contributions.map((c) => (
            <View key={c.id} style={styles.feedItem}>
              <View style={styles.feedAvatar}>
                <Text>
                  {c.content_type === 'flower' ? '🌸' : c.content_type === 'candle' ? '🕯️' : '💭'}
                </Text>
              </View>
              <View style={styles.feedBody}>
                <View style={styles.feedHeader}>
                  <Text style={styles.feedAuthor}>{authorName(c.author)}</Text>
                  <Text style={styles.feedTime}>{timeAgo(c.createdAt)}</Text>
                </View>
                {c.text_content ? (
                  <Text style={styles.feedText}>{c.text_content.replace(/<[^>]*>/g, '')}</Text>
                ) : null}
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 0, paddingBottom: 120 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 20 },
  profileImg: { width: 72, height: 72, borderRadius: 18 },
  profilePlaceholder: {
    width: 72, height: 72, borderRadius: 18, backgroundColor: '#F1F5F9',
    justifyContent: 'center', alignItems: 'center',
  },
  profilePlaceholderText: { fontSize: 22, color: '#64748B', fontWeight: '600' },
  headerInfo: { flex: 1 },
  name: { fontSize: 22, fontWeight: '700', color: '#0F172A' },
  dates: { fontSize: 13, color: '#64748B', marginTop: 2 },
  sloganBadge: { marginLeft: 20, marginBottom: 12, alignSelf: 'flex-start', backgroundColor: '#10B981', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  sloganText: { fontSize: 13, color: '#FFFFFF', fontWeight: '500' },
  statsRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, paddingBottom: 16 },
  statChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F8FAFC', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  statChipText: { fontSize: 12, color: '#475569', fontWeight: '500' },
  bioCard: { marginHorizontal: 20, marginBottom: 12, padding: 16, backgroundColor: '#F8FAFC', borderRadius: 16 },
  cardTitle: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, color: '#64748B', marginBottom: 10 },
  countText: { fontWeight: '400', color: '#94A3B8' },
  bioText: { fontSize: 14, color: '#475569', lineHeight: 22 },
  connectionsCard: { marginHorizontal: 20, marginBottom: 12, padding: 16, backgroundColor: '#F8FAFC', borderRadius: 16 },
  tagsList: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { backgroundColor: '#E2E8F0', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  tagText: { fontSize: 12, color: '#475569' },
  contributionsCard: { marginHorizontal: 20, marginBottom: 16, padding: 16, backgroundColor: '#F8FAFC', borderRadius: 16 },
  emptyText: { textAlign: 'center', color: '#94A3B8', fontSize: 14, paddingVertical: 30 },
  feedItem: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  feedAvatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  feedBody: { flex: 1 },
  feedHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  feedAuthor: { fontSize: 13, fontWeight: '600', color: '#0F172A' },
  feedTime: { fontSize: 11, color: '#94A3B8' },
  feedText: { fontSize: 13, color: '#475569', lineHeight: 18 },
});
