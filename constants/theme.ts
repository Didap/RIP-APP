import { Platform } from 'react-native';

export const Colors = {
  background: '#F8F6F2',
  backgroundAlt: '#FAF8F5',
  surface: '#FFFFFF',
  textPrimary: '#333333',
  textSecondary: '#666666',
  textTertiary: '#999999',
  accent: '#4A7C59',
  accentLight: '#E8F0EA',
  gold: '#D4AF37',
  goldLight: '#F5EDD0',
  border: '#E8E5E0',
  shadow: 'rgba(0,0,0,0.06)',
  darkBackground: '#1A1A2E',
  darkGradientEnd: '#16213E',
  searchBg: '#F0EDE8',
};

export const FontFamilies = {
  serif: 'CormorantGaramond_600SemiBold',
  serifRegular: 'CormorantGaramond_400Regular',
  serifItalic: 'CormorantGaramond_400Regular_Italic',
  serifBold: 'CormorantGaramond_700Bold',
  sans: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  sansSemiBold: 'Inter_600SemiBold',
  sansBold: 'Inter_700Bold',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  section: 40,
};

export const Radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 100,
};

export const Shadows = {
  card: Platform.select({
    web: { boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
  }) as any,
  subtle: Platform.select({
    web: { boxShadow: '0 1px 4px rgba(0,0,0,0.03)' },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.03,
      shadowRadius: 4,
      elevation: 1,
    },
  }) as any,
};
