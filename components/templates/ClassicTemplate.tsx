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

export default function ClassicTemplate({ memorial }: Props) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Image */}
      <View style={styles.profileWrapper}>
        {memorial.profile_image?.url ? (
          <Image source={{ uri: memorial.profile_image.url }} style={styles.profileImg} />
        ) : (
          <View style={styles.profilePlaceholder}>
            <Text style={styles.profilePlaceholderText}>{getInitials(memorial.full_name)}</Text>
          </View>
        )}
      </View>

      {/* Name */}
      <Text style={styles.name}>{memorial.full_name}</Text>

      {/* Slogan */}
      {memorial.slogan ? (
        <Text style={styles.slogan}>"{memorial.slogan}"</Text>
      ) : null}

      {/* Dates */}
      {memorial.dates ? (
        <Text style={styles.dates}>
          {memorial.dates.birth ? formatDate(memorial.dates.birth) : ''}
          {memorial.dates.birth && memorial.dates.death ? ' — ' : ''}
          {memorial.dates.death ? formatDate(memorial.dates.death) : ''}
        </Text>
      ) : null}

      <View style={styles.divider} />

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>🌸</Text>
          <Text style={styles.statCount}>{memorial.stats.flowers}</Text>
          <Text style={styles.statLabel}>Fiori</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>🕯️</Text>
          <Text style={styles.statCount}>{memorial.stats.candles}</Text>
          <Text style={styles.statLabel}>Candele</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>💭</Text>
          <Text style={styles.statCount}>{memorial.stats.memories}</Text>
          <Text style={styles.statLabel}>Ricordi</Text>
        </View>
      </View>

      {/* Biography */}
      {memorial.biography ? (
        <View style={styles.bioSection}>
          <Text style={styles.sectionTitle}>Biografia</Text>
          <Text style={styles.bioText}>{memorial.biography.replace(/<[^>]*>/g, '\n')}</Text>
        </View>
      ) : null}

      {/* Connections */}
      {memorial.connections.length > 0 ? (
        <View style={styles.connectionsSection}>
          <Text style={styles.sectionTitle}>Famiglia</Text>
          {memorial.connections.map((conn, i) => (
            <View key={i} style={styles.connectionItem}>
              <View style={styles.relationBadge}>
                <Text style={styles.relationText}>{conn.relation_type}</Text>
              </View>
              <Text style={styles.connectionName}>
                {conn.user?.first_name} {conn.user?.last_name}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      {/* Contributions */}
      {memorial.contributions.length > 0 ? (
        <View style={styles.contributionsSection}>
          <Text style={styles.sectionTitle}>Messaggi e Ricordi</Text>
          {memorial.contributions.map((c) => (
            <View key={c.id} style={styles.contributionCard}>
              <View style={styles.contributionHeader}>
                <Text style={styles.contributionIcon}>{contributionIcon(c.content_type)}</Text>
                <Text style={styles.contributionAuthor}>{authorName(c.author)}</Text>
              </View>
              {c.text_content ? (
                <Text style={styles.contributionText}>{c.text_content.replace(/<[^>]*>/g, '')}</Text>
              ) : null}
            </View>
          ))}
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAF9' },
  content: { alignItems: 'center', padding: 24, paddingBottom: 120 },
  profileWrapper: { marginBottom: 16 },
  profileImg: { width: 140, height: 140, borderRadius: 70, borderWidth: 4, borderColor: '#B8860B' },
  profilePlaceholder: {
    width: 140, height: 140, borderRadius: 70, borderWidth: 4, borderColor: '#B8860B',
    backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center',
  },
  profilePlaceholderText: { fontSize: 32, color: '#6B7280', fontWeight: '600' },
  name: { fontSize: 26, fontWeight: '600', color: '#374151', textAlign: 'center', marginBottom: 4, fontFamily: 'Georgia, serif' },
  slogan: { fontSize: 14, color: '#6B7280', fontStyle: 'italic', textAlign: 'center', marginBottom: 8, fontFamily: 'Georgia, serif' },
  dates: { fontSize: 13, color: '#6B7280', textAlign: 'center', marginBottom: 16 },
  divider: { width: 60, height: 2, backgroundColor: '#B8860B', marginBottom: 20 },
  statsRow: { flexDirection: 'row', gap: 32, paddingVertical: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#E5E7EB', marginBottom: 20, width: '100%', justifyContent: 'center' },
  statItem: { alignItems: 'center', gap: 2 },
  statIcon: { fontSize: 20 },
  statCount: { fontSize: 20, fontWeight: '700', color: '#374151' },
  statLabel: { fontSize: 11, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5 },
  bioSection: { backgroundColor: '#F9FAFB', borderTopWidth: 3, borderColor: '#B8860B', borderRadius: 8, padding: 16, marginBottom: 20, width: '100%' },
  sectionTitle: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: '#6B7280', marginBottom: 8, fontWeight: '600' },
  bioText: { fontSize: 14, color: '#4B5563', lineHeight: 22 },
  connectionsSection: { marginBottom: 20, width: '100%' },
  connectionItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8, borderBottomWidth: 1, borderColor: '#F3F4F6' },
  relationBadge: { backgroundColor: '#FEF3C7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  relationText: { fontSize: 12, color: '#92400E', fontWeight: '500' },
  connectionName: { fontSize: 14, color: '#374151' },
  contributionsSection: { marginBottom: 20, width: '100%' },
  contributionCard: { backgroundColor: '#F9FAFB', borderRadius: 8, padding: 12, marginBottom: 8 },
  contributionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  contributionIcon: { fontSize: 16 },
  contributionAuthor: { fontSize: 12, color: '#6B7280' },
  contributionText: { fontSize: 14, color: '#4B5563', lineHeight: 20 },
});
