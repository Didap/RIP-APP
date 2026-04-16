import { FlatList, RefreshControl, View, Text, StyleSheet } from 'react-native';
import { useFeed } from '../../hooks/useFeed';
import MemorialFeedCard from '../../components/feed/MemorialFeedCard';
import ContributionFeedCard from '../../components/feed/ContributionFeedCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorView from '../../components/ui/ErrorView';

export default function FeedScreen() {
  const { data, isLoading, error, refetch } = useFeed();

  if (isLoading) return <LoadingSpinner />;
  if (error) {
    return <ErrorView message="Errore nel caricamento del feed" onRetry={() => refetch()} />;
  }

  const items = data?.data ?? [];

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={() => refetch()} />
        }
        contentContainerStyle={items.length === 0 ? styles.emptyContainer : styles.list}
        renderItem={({ item }) => {
          if (item.type === 'memorial') {
            return <MemorialFeedCard item={item} />;
          }
          return <ContributionFeedCard item={item} />;
        }}
        ListHeaderComponent={<View style={styles.header}><Text style={styles.headerTitle}>Feed</Text></View>}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🕊️</Text>
            <Text style={styles.emptyText}>Nessun memoriale pubblico trovato</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  emptyContainer: {
    flex: 1,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    color: '#9BA1A6',
    fontSize: 14,
  },
});
