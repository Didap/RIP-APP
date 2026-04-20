import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontFamilies, Spacing, Radii, Shadows } from '../../constants/theme';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingTop: insets.top + Spacing.xl, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Ionicons name="person-outline" size={32} color={Colors.textTertiary} />
        </View>
        <Text style={styles.title}>Profilo</Text>
        <Text style={styles.subtitle}>Accedi per gestire i tuoi memoriali</Text>
      </View>

      <View style={styles.section}>
        <Pressable style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Accedi</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Impostazioni</Text>
        <View style={styles.settingsList}>
          <Pressable style={styles.settingsItem}>
            <Ionicons name="notifications-outline" size={20} color={Colors.textSecondary} />
            <Text style={styles.settingsLabel}>Notifiche</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
          </Pressable>
          <Pressable style={styles.settingsItem}>
            <Ionicons name="settings-outline" size={20} color={Colors.textSecondary} />
            <Text style={styles.settingsLabel}>Impostazioni</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
          </Pressable>
          <Pressable style={styles.settingsItem}>
            <Ionicons name="help-circle-outline" size={20} color={Colors.textSecondary} />
            <Text style={styles.settingsLabel}>Aiuto</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.searchBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontFamily: FontFamilies.serifBold,
    fontSize: 24,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontFamily: FontFamilies.sans,
    fontSize: 14,
    color: Colors.textTertiary,
    marginTop: Spacing.xs,
  },
  section: {
    marginTop: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
  },
  sectionTitle: {
    fontFamily: FontFamilies.serif,
    fontSize: 20,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  loginButton: {
    backgroundColor: Colors.accent,
    paddingVertical: Spacing.lg,
    borderRadius: Radii.md,
    alignItems: 'center',
  },
  loginButtonText: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 16,
    color: '#fff',
  },
  settingsList: {
    gap: 1,
    backgroundColor: Colors.border,
    borderRadius: Radii.md,
    overflow: 'hidden',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  settingsLabel: {
    flex: 1,
    fontFamily: FontFamilies.sansMedium,
    fontSize: 15,
    color: Colors.textPrimary,
  },
});
