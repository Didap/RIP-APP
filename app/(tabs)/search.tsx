import { useState } from 'react';
import { View, Text, TextInput, FlatList, Dimensions, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, FontFamilies, Spacing, Radii } from '../../constants/theme';
import { useExplore } from '../../hooks/useExplore';
import TabSelector from '../../components/explore/TabSelector';
import FilterChip from '../../components/explore/FilterChip';
import ExploreMemorialCard from '../../components/explore/ExploreMemorialCard';
import EmptyExploreState from '../../components/explore/EmptyExploreState';
import SkeletonCard from '../../components/explore/SkeletonCard';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_GAP = Spacing.md;
const H_PADDING = Spacing.xl;
const CARD_WIDTH = (SCREEN_WIDTH - H_PADDING * 2 - CARD_GAP) / 2;

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const {
    searchQuery, setSearchQuery,
    activeTab, setActiveTab,
    locationFilter, setLocationFilter,
    typeFilter, setTypeFilter,
    filteredResults, cities, isLoading,
  } = useExplore();

  const [showLocationFilter, setShowLocationFilter] = useState(false);

  return (
    <View style={styles.container}>
      <View style={{ paddingTop: insets.top }}>
        <View style={styles.header}>
          <Text style={styles.title}>Esplora</Text>
        </View>

        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Cerca per nome, luogo, anno..."
            placeholderTextColor={Colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <TabSelector
          tabs={['Persone', 'Animali']}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <View style={styles.filterRow}>
          <FilterChip
            icon="location-outline"
            label={locationFilter || 'Località'}
            active={!!locationFilter}
            onPress={() => {
              if (locationFilter) {
                setLocationFilter(null);
              } else {
                setShowLocationFilter(!showLocationFilter);
              }
            }}
          />
          {activeTab === 1 && (
            <FilterChip
              icon="grid-outline"
              label={typeFilter || 'Tipo'}
              active={!!typeFilter}
              onPress={() => {
                if (typeFilter === 'cane') setTypeFilter(null);
                else if (typeFilter === 'gatto') setTypeFilter('cane');
                else setTypeFilter('gatto');
              }}
            />
          )}
          {(locationFilter || typeFilter) && (
            <Text
              style={styles.resetLink}
              onPress={() => { setLocationFilter(null); setTypeFilter(null); }}
            >
              Reset
            </Text>
          )}
        </View>

        {showLocationFilter && !locationFilter && (
          <View style={styles.filterDropdown}>
            {cities.map(city => (
              <Text
                key={city}
                style={styles.filterOption}
                onPress={() => { setLocationFilter(city); setShowLocationFilter(false); }}
              >
                {city}
              </Text>
            ))}
          </View>
        )}
      </View>

      <View style={styles.resultHeader}>
        <Text style={styles.resultCount}>{filteredResults.length} memoriali</Text>
      </View>

      {isLoading ? (
        <View style={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} cardWidth={CARD_WIDTH} />
          ))}
        </View>
      ) : (
        <FlatList
          data={filteredResults}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.gridContent}
          renderItem={({ item }) => (
            <ExploreMemorialCard item={item} cardWidth={CARD_WIDTH} />
          )}
          ListEmptyComponent={<EmptyExploreState />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: {
    fontFamily: FontFamilies.serifBold,
    fontSize: 32,
    color: Colors.textPrimary,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.searchBg,
    borderRadius: Radii.pill,
    marginHorizontal: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    height: 44,
    gap: Spacing.sm,
  },
  searchIcon: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontFamily: FontFamilies.sans,
    fontSize: 15,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.md,
    gap: Spacing.md,
    alignItems: 'center',
  },
  resetLink: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 13,
    color: Colors.accent,
  },
  filterDropdown: {
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radii.sm,
    padding: Spacing.sm,
    gap: Spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  filterOption: {
    fontFamily: FontFamilies.sans,
    fontSize: 14,
    color: Colors.textPrimary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  resultHeader: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  resultCount: {
    fontFamily: FontFamilies.sans,
    fontSize: 13,
    color: Colors.textTertiary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: H_PADDING,
    gap: CARD_GAP,
  },
  gridContent: {
    paddingHorizontal: H_PADDING,
    gap: CARD_GAP,
    paddingBottom: 100,
  },
  row: {
    gap: CARD_GAP,
  },
});
