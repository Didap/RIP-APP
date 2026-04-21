import { View, Text, ScrollView, Alert, StyleSheet, Dimensions, Image, RefreshControl, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontFamilies, Spacing, Radii, Shadows } from '../../constants/theme';
import type { MemorialDetail } from '../../services/api';
import { api, stripHtml } from '../../services/api';
import HeroImage from './HeroImage';
import ContributionSection from './ContributionSection';
import StarDivider from './StarDivider';
import MemorialTimeline from './MemorialTimeline';
import CelebrationOverlay from '../ui/CelebrationOverlay';
import RefreshIndicatorWeb from '../ui/RefreshIndicatorWeb';
import { useState } from 'react';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
  memorial: MemorialDetail;
  onBack: () => void;
  onContribution?: () => void;
  onLeaveMemory: () => void;
  refreshing?: boolean;
  onRefresh?: () => void;
  onShare?: () => void;
}

export default function MemorialDetailScreen({ 
  memorial, 
  onBack, 
  onContribution, 
  onLeaveMemory,
  refreshing = false,
  onRefresh,
  onShare
 }: Props) {
  const [celebration, setCelebration] = useState<{ visible: boolean, type: 'candle' | 'flower' | 'text' | null }>({
    visible: false,
    type: null
  });

  const customization = memorial.customization || {};
  const template = memorial.template;
  const primaryColor = customization.primary_color;
  const backgroundColor = customization.background_color;

  const handleContribution = async (type: 'candle' | 'flower' | 'text') => {
    try {
      await api.createContribution(memorial.slug, type);
      setCelebration({ visible: true, type });
      onContribution?.();
    } catch {
      Alert.alert('Errore', 'Impossibile completare l\'azione');
    }
  };

  // --- RENDERERS ---

  const renderClassic = () => {
    return (
      <ScrollView 
        style={[styles.container, { backgroundColor: backgroundColor || '#F9F6F0' }]} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={primaryColor || Colors.accent}
            colors={[primaryColor || Colors.accent]}
            progressViewOffset={SCREEN_WIDTH > 500 ? 0 : 80}
          />
        }
      >
        <RefreshIndicatorWeb refreshing={refreshing} color={primaryColor || Colors.accent} />
        <HeroImage imageUrl={memorial.cover_image?.url || memorial.profile_image?.url || ''} onBack={onBack} onShare={onShare} />
        
        <View style={styles.classicHeader}>
           <Text style={styles.classicEyebrow}>In Memoria di</Text>
           <Text style={styles.classicName}>{memorial.full_name}</Text>
           <View style={styles.classicDatesRow}>
              <Text style={styles.classicDate}>{memorial.dates?.birth?.slice(0, 10)}</Text>
              <Text style={{ color: primaryColor || Colors.gold }}> ❧ </Text>
              <Text style={styles.classicDate}>{memorial.dates?.death?.slice(0, 10)}</Text>
           </View>
        </View>

        <StarDivider color={primaryColor} />

        {!customization.hide_biography && (
          <View style={styles.classicBio}>
             <Text style={styles.classicBioText}>{stripHtml(memorial.biography)}</Text>
          </View>
        )}

        {!customization.hide_stats && (
          <ContributionSection
            stats={memorial.stats}
            variant="light"
            primaryColor={primaryColor}
            onLightCandle={() => handleContribution('candle')}
            onLeaveFlower={() => handleContribution('flower')}
            onLeaveMemory={onLeaveMemory}
          />
        )}

        <MemorialTimeline 
          contributions={memorial.contributions} 
          variant="light" 
          primaryColor={primaryColor} 
        />

        <View style={{ height: 100 }} />
      </ScrollView>
    );
  };

  const renderElegant = () => {
    return (
      <View style={[styles.container, { backgroundColor: backgroundColor || Colors.darkBackground }]}>
         <ScrollView 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              tintColor={primaryColor || Colors.gold}
              colors={[primaryColor || Colors.gold]}
              progressViewOffset={SCREEN_WIDTH > 500 ? 0 : 80}
            />
          }
         >
            <RefreshIndicatorWeb refreshing={refreshing} color={primaryColor || Colors.gold} />
            <View style={styles.elegantHero}>
                <HeroImage 
                  imageUrl={memorial.cover_image?.url || memorial.profile_image?.url || ''} 
                  onBack={onBack} 
                  onShare={onShare}
                  height={420} 
                />
                
                <LinearGradient
                    colors={['transparent', 'rgba(26, 26, 46, 0.9)']}
                    style={styles.elegantHeroContent}
                >
                    <Text style={styles.elegantName}>{memorial.full_name}</Text>
                    {memorial.slogan && <Text style={styles.elegantSlogan}>{memorial.slogan}</Text>}
                </LinearGradient>
            </View>

            <View style={styles.elegantContent}>
                {/* Overlapping Profile */}
                <View style={styles.elegantProfileOverlap}>
                    <View style={styles.elegantProfileContainer}>
                        <Image 
                            source={{ uri: memorial.profile_image?.url }}
                            style={{ width: 140, height: 140, borderRadius: 70 }} 
                        />
                    </View>
                </View>

                {!customization.hide_biography && (
                    <View style={styles.elegantGlassCard}>
                        <Text style={styles.elegantBioText}>{stripHtml(memorial.biography)}</Text>
                    </View>
                )}

                {!customization.hide_stats && (
                    <ContributionSection
                        stats={memorial.stats}
                        variant="dark"
                        primaryColor={primaryColor || Colors.gold}
                        onLightCandle={() => handleContribution('candle')}
                        onLeaveFlower={() => handleContribution('flower')}
                        onLeaveMemory={onLeaveMemory}
                    />
                )}

                <MemorialTimeline 
                    contributions={memorial.contributions} 
                    variant="dark" 
                    primaryColor={primaryColor || Colors.gold} 
                />
            </View>
            <View style={{ height: 100 }} />
         </ScrollView>
      </View>
    );
  };

  const renderModern = () => {
    return (
      <ScrollView 
        style={[styles.container, { backgroundColor: backgroundColor || '#F8FAFC' }]} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={primaryColor || '#6366f1'}
            colors={[primaryColor || '#6366f1']}
            progressViewOffset={SCREEN_WIDTH > 500 ? 0 : 80}
          />
        }
      >
        <RefreshIndicatorWeb refreshing={refreshing} color={primaryColor || '#6366f1'} />
        <HeroImage imageUrl={memorial.cover_image?.url || memorial.profile_image?.url || ''} onBack={onBack} onShare={onShare} />
        
        <View style={styles.modernContent}>
          <View style={styles.modernHeader}>
             <View style={styles.modernPill}><Text style={styles.modernPillText}>MEMORIALE</Text></View>
             <Text style={styles.modernTitle}>{memorial.full_name}</Text>
             <Text style={styles.modernDates}>{memorial.dates?.birth?.slice(0, 4)} — {memorial.dates?.death?.slice(0, 4)}</Text>
          </View>

          <View style={styles.modernBento}>
             {!customization.hide_stats && (
                 <View style={styles.modernStatsGrid}>
                     <View style={styles.modernStatCard}><Text style={styles.modernStatNum}>{memorial.stats.flowers}</Text><Text style={styles.modernStatLabel}>Fiori</Text></View>
                     <View style={styles.modernStatCard}><Text style={styles.modernStatNum}>{memorial.stats.candles}</Text><Text style={styles.modernStatLabel}>Luci</Text></View>
                 </View>
             )}

             {!customization.hide_biography && (
                 <View style={styles.modernBioCard}>
                    <Text style={styles.modernBioText}>{stripHtml(memorial.biography)}</Text>
                 </View>
             )}
          </View>

          <ContributionSection
            stats={memorial.stats}
            variant="light"
            primaryColor={primaryColor || '#6366f1'}
            onLightCandle={() => handleContribution('candle')}
            onLeaveFlower={() => handleContribution('flower')}
            onLeaveMemory={onLeaveMemory}
          />

          <MemorialTimeline 
            contributions={memorial.contributions} 
            variant="light" 
            primaryColor={primaryColor || '#6366f1'} 
          />
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    );
  };

  return (
    <>
      {template === 'elegant' ? renderElegant() : (template === 'modern' ? renderModern() : renderClassic())}
      
      <CelebrationOverlay 
        visible={celebration.visible} 
        type={celebration.type} 
        onFinished={() => setCelebration({ visible: false, type: null })} 
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // CLASSIC STYLES
  classicHeader: {
    padding: Spacing.xxl,
    alignItems: 'center',
  },
  classicEyebrow: {
    fontFamily: FontFamilies.serif,
    fontSize: 16,
    fontStyle: 'italic',
    color: Colors.textTertiary,
    marginBottom: Spacing.sm,
  },
  classicName: {
    fontFamily: FontFamilies.serifBold,
    fontSize: 36,
    textAlign: 'center',
    color: '#1A1A1A',
  },
  classicDatesRow: {
    flexDirection: 'row',
    marginTop: Spacing.md,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  classicDate: {
    fontFamily: FontFamilies.serif,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  classicBio: {
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.lg,
  },
  classicBioText: {
    fontFamily: FontFamilies.serif,
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'center',
    color: '#333',
  },

  // ELEGANT STYLES
  elegantHero: {
    height: 420,
    position: 'relative',
    backgroundColor: '#1A1A2E',
  },
  elegantHeroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.xxl,
    paddingBottom: 80, // Space for the profile overlap
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 1,
  },
  elegantProfileOverlap: {
    alignItems: 'center',
    marginTop: -70,
    marginBottom: Spacing.xxl,
    zIndex: 10,
  },
  elegantProfileContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: Colors.darkBackground,
    backgroundColor: 'rgba(255,255,255,0.1)',
    elevation: 15,
    boxShadow: '0 15px 20px rgba(0,0,0,0.4)',
  },
  elegantName: {
    fontFamily: FontFamilies.serifBold,
    fontSize: 48,
    color: '#fff',
    textAlign: 'center',
    ...Platform.select({
      web: {
        textShadow: '0px 4px 20px rgba(0, 0, 0, 0.6)',
      },
      default: {
        textShadowColor: 'rgba(0, 0, 0, 0.6)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 20,
      },
    }),
  },
  elegantSlogan: {
    fontFamily: FontFamilies.serifItalic,
    fontSize: 22,
    color: 'rgba(255,255,255,0.9)',
    marginTop: Spacing.lg,
    textAlign: 'center',
    ...Platform.select({
      web: {
        textShadow: '0px 2px 10px rgba(0, 0, 0, 0.4)',
      },
      default: {
        textShadowColor: 'rgba(0, 0, 0, 0.4)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 10,
      },
    }),
  },
  elegantContent: {
    padding: Spacing.xl,
    paddingBottom: 100,
  },
  elegantGlassCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: Radii.lg,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: Spacing.xxl,
  },
  elegantBioText: {
    fontFamily: FontFamilies.serifRegular,
    fontSize: 18,
    lineHeight: 28,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },

  // MODERN STYLES
  modernContent: {
    padding: Spacing.xl,
  },
  modernHeader: {
    marginBottom: Spacing.xxl,
  },
  modernPill: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  modernPillText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  modernTitle: {
    fontFamily: FontFamilies.sansBold,
    fontSize: 32,
    marginTop: 10,
    color: '#000',
  },
  modernDates: {
    fontFamily: FontFamilies.sans,
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  modernBento: {
    gap: Spacing.lg,
    marginBottom: Spacing.xxl,
  },
  modernStatsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  modernStatCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: Spacing.lg,
    borderRadius: Radii.md,
    ...Shadows.card,
  },
  modernStatNum: {
    fontFamily: FontFamilies.sansBold,
    fontSize: 24,
    color: '#000',
  },
  modernStatLabel: {
    fontSize: 10,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  modernBioCard: {
    backgroundColor: '#fff',
    padding: Spacing.xl,
    borderRadius: Radii.md,
    ...Shadows.card,
  },
  modernBioText: {
    fontFamily: FontFamilies.sans,
    fontSize: 15,
    lineHeight: 22,
    color: '#334155',
  },
});
