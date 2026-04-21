import { useState } from 'react';
import { View, Text, ScrollView, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontFamilies, Spacing } from '../../constants/theme';
import { getGreeting } from '../../services/api';
import { useFeed } from '../../hooks/useFeed';
import { HapticNotification } from '../../utils/haptics';
import FeaturedMemorialCard from '../../components/home/FeaturedMemorialCard';
import AnniversaryCard from '../../components/home/AnniversaryCard';
import QuoteSection from '../../components/home/QuoteSection';
import ErrorView from '../../components/ui/ErrorView';
import HomeSkeleton from '../../components/home/HomeSkeleton';
import RefreshIndicatorWeb from '../../components/ui/RefreshIndicatorWeb';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { data, isLoading, error, refetch } = useFeed();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
    HapticNotification.success();
  };

  const items = data?.data ?? [];
  const memorials = items.filter(i => i.type === 'memorial');
  const featured = memorials.slice(0, 5);
  const anniversaries = memorials.slice(0, 4);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingTop: insets.top + Spacing.lg, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh} 
          tintColor={Colors.accent}
          colors={[Colors.accent]}
        />
      }
    >
      <RefreshIndicatorWeb refreshing={refreshing} />
      <View style={styles.header}>
        <Text style={styles.brand}>REST IN PIXEL</Text>
        <Text style={styles.greeting}>
          {getGreeting()}.
        </Text>
      </View>

      <QuoteSection
        text="Chi viene ricordato, vive."
        author="Detto antico"
      />

      {isLoading ? (
        <HomeSkeleton />
      ) : error ? (
        <View style={styles.errorSection}>
          <ErrorView
            message="Impossibile caricare i memoriali"
            onRetry={() => refetch()}
          />
        </View>
      ) : (
        <>
          {featured.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>In evidenza</Text>
                <Text style={styles.sectionLink}>Esplora tutti</Text>
              </View>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={featured}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <FeaturedMemorialCard item={item} />}
                contentContainerStyle={styles.carousel}
              />
            </View>
          )}

          {anniversaries.length > 0 && (
            <View style={styles.section}>
              <View style={[styles.sectionHeader, { marginBottom: Spacing.md }]}>
                <Ionicons name="flame" size={18} color={Colors.gold} />
                <Text style={styles.sectionTitle}>Recenti</Text>
              </View>
              <View style={styles.anniversaryList}>
                {anniversaries.map(item => (
                  <AnniversaryCard key={item.id} item={item} />
                ))}
              </View>
            </View>
          )}

          {items.length === 0 && (
            <View style={styles.empty}>
              <Ionicons name="leaf-outline" size={48} color={Colors.border} />
              <Text style={styles.emptyText}>Nessun memoriale trovato</Text>
              <Text style={styles.emptySubtext}>I memoriali creati appariranno qui</Text>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  brand: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 11,
    color: Colors.textTertiary,
    letterSpacing: 3,
    marginBottom: Spacing.sm,
  },
  greeting: {
    fontFamily: FontFamilies.serifBold,
    fontSize: 30,
    color: Colors.textPrimary,
    lineHeight: 36,
  },
  section: {
    marginTop: Spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontFamily: FontFamilies.serif,
    fontSize: 20,
    color: Colors.textPrimary,
  },
  sectionLink: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 14,
    color: Colors.accent,
  },
  carousel: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  anniversaryList: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  loading: {
    alignItems: 'center',
    paddingTop: 60,
    gap: Spacing.md,
  },
  loadingText: {
    fontFamily: FontFamilies.sans,
    fontSize: 14,
    color: Colors.textTertiary,
  },
  errorSection: {
    paddingTop: 40,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
    gap: Spacing.md,
  },
  emptyText: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  emptySubtext: {
    fontFamily: FontFamilies.sans,
    fontSize: 13,
    color: Colors.textTertiary,
  },
});
