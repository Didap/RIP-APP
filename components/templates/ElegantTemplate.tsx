import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import type { MemorialDetail } from '../../services/api';

interface Props {
  memorial: MemorialDetail;
}

function formatDate(date: string | undefined | null) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
}

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function authorName(author: any) {
  if (!author) return 'Anonimo';
  return [author.first_name, author.last_name].filter(Boolean).join(' ') || author.username;
}

function contributionIcon(type: string) {
  switch (type) {
    case 'flower': return '🌸';
    case 'candle': return '🕯️';
    default: return '💭';
  }
}

export default function ElegantTemplate({ memorial }: Props) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Cover */}
      <View style={styles.coverSection}>
        {memorial.cover_image?.url ? (
          <Image source={{ uri: memorial.cover_image.url }} style={styles.coverImg} />
        ) : (
          <View style={styles.coverGradient} />
        )}
        <View style={styles.coverOverlay}>
          <Text style={styles.coverName}>{memorial.full_name}</Text>
          {memorial.slogan ? <Text style={styles.coverSlogan}>{memorial.slogan}</Text> : null}
        </View>
      </View>

      {/* Profile (overlapping cover) */}
      <View style={styles.profileWrapper}>
        {memorial.profile_image?.url ? (
          <Image source={{ uri: memorial.profile_image.url }} style={styles.profileImg} />
        ) : (
          <View style={styles.profilePlaceholder}>
            <Text style={styles.profilePlaceholderText}>{getInitials(memorial.full_name)}</Text>
          </View>
        )}
      </View>

      {/* Dates */}
      {memorial.dates ? (
        <Text style={styles.dates}>
          {(memorial.dates.birth ? formatDate(memorial.dates.birth) : '').toUpperCase()}
          {memorial.dates.birth && memorial.dates.death ? ' — ' : ''}
          {(memorial.dates.death ? formatDate(memorial.dates.death) : '').toUpperCase()}
        </Text>
      ) : null}

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>🌸</Text>
          <Text style={styles.statCount}>{memorial.stats.flowers}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>🕯️</Text>
          <Text style={styles.statCount}>{memorial.stats.candles}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>💭</Text>
          <Text style={styles.statCount}>{memorial.stats.memories}</Text>
        </View>
      </View>

      {/* Biography */}
      {memorial.biography ? (
        <View style={styles.bioSection}>
          <Text style={styles.bioText}>{memorial.biography.replace(/<[^>]*>/g, '\n')}</Text>
        </View>
      ) : null}

      {/* Connections */}
      {memorial.connections.length > 0 ? (
        <View style={styles.connectionsSection}>
          {memorial.connections.map((conn, i) => (
            <View key={i} style={styles.connectionBadge}>
              <Text style={styles.badgeType}>{conn.relation_type}</Text>
              <Text style={styles.badgeName}>{conn.user?.first_name} {conn.user?.last_name}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {/* Contributions */}
      {memorial.contributions.length > 0 ? (
        <View style={styles.contributionsSection}>
          <Text style={styles.sectionTitle}>Ricordi</Text>
          {memorial.contributions.map((c) => (
            <View key={c.id} style={styles.contributionItem}>
              <Text style={styles.contributionIcon}>{contributionIcon(c.content_type)}</Text>
              <View style={styles.contributionBody}>
                <Text style={styles.contributionAuthor}>{authorName(c.author)}</Text>
                {c.text_content ? (
                  <Text style={styles.contributionText}>{c.text_content.replace(/<[^>]*>/g, '')}</Text>
                ) : null}
              </View>
            </View>
          ))}
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { paddingBottom: 120 },
  coverSection: { height: 280, position: 'relative' },
  coverImg: { width: '100%', height: '100%' },
  coverGradient: { width: '100%', height: '100%', backgroundColor: '#1E293B' },
  coverOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingBottom: 60, paddingTop: 40, paddingHorizontal: 16, backgroundColor: 'rgba(15,23,42,0.7)', alignItems: 'center' },
  coverName: { fontSize: 24, fontWeight: '300', color: '#F8FAFC', letterSpacing: 0.5 },
  coverSlogan: { fontSize: 13, color: '#94A3B8', marginTop: 6 },
  profileWrapper: { justifyContent: 'center', alignItems: 'center', marginTop: -50, zIndex: 1 },
  profileImg: { width: 100, height: 100, borderRadius: 16, borderWidth: 4, borderColor: '#FFFFFF' },
  profilePlaceholder: {
    width: 100, height: 100, borderRadius: 16, borderWidth: 4, borderColor: '#FFFFFF',
    backgroundColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center',
  },
  profilePlaceholderText: { fontSize: 24, color: '#475569', fontWeight: '500' },
  dates: { textAlign: 'center', paddingVertical: 12, fontSize: 11, letterSpacing: 2, color: '#94A3B8' },
  statsBar: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 20,
    paddingVertical: 12, marginHorizontal: 16, backgroundColor: 'rgba(241,245,249,0.9)',
    borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0',
  },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statIcon: { fontSize: 16 },
  statCount: { fontSize: 16, fontWeight: '600', color: '#1E293B' },
  statDivider: { width: 1, height: 20, backgroundColor: '#CBD5E1' },
  bioSection: {
    margin: 16, padding: 16, backgroundColor: '#F8FAFC', borderRadius: 12,
    borderLeftWidth: 3, borderLeftColor: '#1E293B',
  },
  bioText: { fontSize: 14, color: '#475569', lineHeight: 22 },
  connectionsSection: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16, marginBottom: 16 },
  connectionBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  badgeType: { fontSize: 12, color: '#64748B', fontWeight: '500' },
  badgeName: { fontSize: 12, color: '#1E293B' },
  sectionTitle: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, color: '#94A3B8', marginBottom: 12, fontWeight: '600' },
  contributionsSection: { paddingHorizontal: 16, paddingBottom: 16 },
  contributionItem: { flexDirection: 'row', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderColor: '#F1F5F9' },
  contributionIcon: { fontSize: 18, marginTop: 2 },
  contributionBody: { flex: 1 },
  contributionAuthor: { fontSize: 13, fontWeight: '500', color: '#1E293B', marginBottom: 4 },
  contributionText: { fontSize: 13, color: '#64748B', lineHeight: 18 },
});
