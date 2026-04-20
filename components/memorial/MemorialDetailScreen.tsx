import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontFamilies, Spacing } from '../../constants/theme';
import type { MemorialDetail } from '../../services/api';
import { api, stripHtml } from '../../services/api';
import HeroImage from './HeroImage';
import ContributionSection from './ContributionSection';
import StarDivider from './StarDivider';

interface Props {
  memorial: MemorialDetail;
  onBack: () => void;
  onContribution?: () => void;
  onLeaveMemory: () => void;
}

export default function MemorialDetailScreen({ memorial, onBack, onContribution, onLeaveMemory }: Props) {
  const variant = memorial.template === 'elegant' ? 'dark' : 'light';
  const isDark = variant === 'dark';
  const birthYear = memorial.dates?.birth?.slice(0, 4);
  const deathYear = memorial.dates?.death?.slice(0, 4);
  const city = memorial.city || '';

  const handleContribution = async (type: 'candle' | 'flower' | 'text') => {
    try {
      await api.createContribution(memorial.slug, type);
      const msg = type === 'candle' ? 'Hai acceso una candela ✦' : 'Hai lasciato un fiore 🌸';
      Alert.alert('', msg);
      onContribution?.();
    } catch {
      Alert.alert('Errore', 'Impossibile completare l\'azione');
    }
  };

  return (
    <ScrollView
      style={[styles.container, isDark && styles.containerDark]}
      showsVerticalScrollIndicator={false}
    >
      <HeroImage
        imageUrl={memorial.cover_image?.url || memorial.profile_image?.url || ''}
        onBack={onBack}
      />

      <View style={styles.nameSection}>
        <Text style={[styles.name, isDark && styles.nameDark]}>
          {memorial.full_name}
        </Text>
        <Text style={[styles.dates, isDark && styles.datesDark]}>
          {birthYear} ✦ {deathYear}
        </Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color={isDark ? 'rgba(255,255,255,0.6)' : Colors.textSecondary} />
          <Text style={[styles.location, isDark && styles.locationDark]}>{city}</Text>
        </View>
        {memorial.funeral_home && (
          <View style={styles.funeralRow}>
            <Ionicons name="document-text-outline" size={14} color={isDark ? 'rgba(255,255,255,0.4)' : Colors.textTertiary} />
            <Text style={[styles.funeral, isDark && styles.funeralDark]}>
              A cura di {memorial.funeral_home}
            </Text>
          </View>
        )}
      </View>

      <ContributionSection
        stats={memorial.stats}
        variant={variant}
        onLightCandle={() => handleContribution('candle')}
        onLeaveFlower={() => handleContribution('flower')}
        onLeaveMemory={onLeaveMemory}
      />

      <StarDivider variant={variant} />

      <View style={styles.bioSection}>
        <Text style={[styles.sectionLabel, isDark && styles.sectionLabelDark]}>
          IN MEMORIA
        </Text>
        <Text style={[styles.bioText, isDark && styles.bioTextDark]}>
          {stripHtml(memorial.biography)}
        </Text>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  containerDark: {
    backgroundColor: Colors.darkBackground,
  },
  nameSection: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.lg,
    gap: Spacing.xs,
  },
  name: {
    fontFamily: FontFamilies.serifBold,
    fontSize: 30,
    color: Colors.textPrimary,
    lineHeight: 36,
  },
  nameDark: {
    color: '#fff',
  },
  dates: {
    fontFamily: FontFamilies.serifRegular,
    fontSize: 18,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  datesDark: {
    color: 'rgba(255,255,255,0.7)',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  location: {
    fontFamily: FontFamilies.sans,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  locationDark: {
    color: 'rgba(255,255,255,0.6)',
  },
  funeralRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  funeral: {
    fontFamily: FontFamilies.sans,
    fontSize: 12,
    color: Colors.textTertiary,
  },
  funeralDark: {
    color: 'rgba(255,255,255,0.4)',
  },
  bioSection: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
  },
  sectionLabel: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 11,
    color: Colors.textTertiary,
    letterSpacing: 2,
  },
  sectionLabelDark: {
    color: 'rgba(255,255,255,0.5)',
  },
  bioText: {
    fontFamily: FontFamilies.sans,
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  bioTextDark: {
    color: 'rgba(255,255,255,0.85)',
  },
});
