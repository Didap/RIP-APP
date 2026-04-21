import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontFamilies, Spacing, Radii, Shadows } from '../../constants/theme';

interface Contribution {
  id: string;
  content_type: string;
  text_content: string | null;
  author: { username: string; first_name?: string; last_name?: string } | null;
  createdAt: string;
  event_date: string | null;
}

interface Props {
  contributions: Contribution[];
  variant: 'light' | 'dark';
  primaryColor?: string;
}

export default function MemorialTimeline({ contributions, variant, primaryColor }: Props) {
  const isDark = variant === 'dark';

  // Filter out non-timeline types (flowers, candles)
  const timelineItems = (contributions || []).filter(
    item => !['flower', 'candle'].includes(item.content_type)
  );

  if (timelineItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, isDark && styles.emptyTextDark]}>
          Ancora nessun ricordo nella storia. Sii il primo a aggiungerne uno.
        </Text>
      </View>
    );
  }

  // Sort by event_date descending, fallback to createdAt
  const sorted = [...timelineItems].sort((a, b) => {
    const dateA = new Date(a.event_date || a.createdAt).getTime();
    const dateB = new Date(b.event_date || b.createdAt).getTime();
    return dateB - dateA;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'photo': return 'image';
      default: return 'chatbubble-ellipses';
    }
  };

  const formatDate = (dateStr: string, hasEventDate: boolean) => {
    const date = new Date(dateStr);
    
    // If it's a specific event date (e.g. 2014-01-01), just show the year if it looks like a placeholder
    // Or just show the full date. User said "tipo questa cosa è successa nel 2014"
    if (hasEventDate) {
      return date.getFullYear().toString();
    }

    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
      return 'Oggi';
    }

    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('it-IT', options);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, isDark && styles.titleDark]}>LA NOSTRA STORIA</Text>
      
      <View style={styles.list}>
        {sorted.map((item, index) => (
          <View key={item.id} style={styles.itemWrapper}>
            {/* Timeline Line */}
            <View style={[
              styles.line, 
              isDark ? styles.lineDark : styles.lineLight,
              index === sorted.length - 1 && { height: '50%' }
            ]} />
            
            {/* Dot/Icon */}
            <View style={[
              styles.iconCircle, 
              isDark ? styles.iconCircleDark : styles.iconCircleLight,
              primaryColor ? { borderColor: primaryColor } : null
            ]}>
              <Ionicons name={getIcon(item.content_type) as any} size={14} color={primaryColor || (isDark ? Colors.gold : Colors.accent)} />
            </View>

            {/* Content */}
            <View style={styles.content}>
              <View style={styles.itemHeader}>
                <Text style={[styles.author, isDark && styles.authorDark]}>
                  {item.author?.username || 'Anonimo'}
                </Text>
                <Text style={styles.date}>{formatDate(item.event_date || item.createdAt, !!item.event_date)}</Text>
              </View>
              
              {item.text_content && (
                <View style={[
                  styles.bubble, 
                  isDark ? styles.bubbleDark : styles.bubbleLight,
                  primaryColor ? { borderLeftColor: primaryColor } : null
                ]}>
                  <Text style={[styles.text, isDark && styles.textDark]}>
                    {item.text_content}
                  </Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
  },
  title: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 12,
    color: Colors.textTertiary,
    letterSpacing: 2,
    marginBottom: Spacing.xl,
  },
  titleDark: {
    color: 'rgba(255,255,255,0.5)',
  },
  list: {
    gap: 0,
  },
  itemWrapper: {
    flexDirection: 'row',
    minHeight: 80,
  },
  line: {
    position: 'absolute',
    left: 15,
    top: 0,
    bottom: 0,
    width: 2,
    zIndex: 0,
  },
  lineLight: {
    backgroundColor: '#E2E8F0',
  },
  lineDark: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    ...Shadows.card,
  },
  iconCircleLight: {
    backgroundColor: '#fff',
    borderColor: '#E2E8F0',
  },
  iconCircleDark: {
    backgroundColor: '#1A1A2E',
    borderColor: 'rgba(255,255,255,0.2)',
  },
  content: {
    flex: 1,
    marginLeft: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  author: {
    fontFamily: FontFamilies.sansBold,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  authorDark: {
    color: '#fff',
  },
  date: {
    fontFamily: FontFamilies.sans,
    fontSize: 12,
    color: Colors.textTertiary,
  },
  bubble: {
    backgroundColor: '#fff',
    padding: Spacing.md,
    borderRadius: Radii.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
    ...Shadows.card,
  },
  bubbleLight: {
    backgroundColor: '#fff',
  },
  bubbleDark: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderLeftColor: Colors.gold,
  },
  text: {
    fontFamily: FontFamilies.serifRegular,
    fontSize: 15,
    lineHeight: 22,
    color: Colors.textSecondary,
  },
  textDark: {
    color: 'rgba(255,255,255,0.9)',
  },
  actionText: {
    fontFamily: FontFamilies.sans,
    fontSize: 13,
    fontStyle: 'italic',
    color: Colors.textTertiary,
  },
  actionTextDark: {
    color: 'rgba(255,255,255,0.4)',
  },
  emptyContainer: {
    padding: Spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: FontFamilies.sans,
    fontSize: 14,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
  emptyTextDark: {
    color: 'rgba(255,255,255,0.4)',
  },
});
