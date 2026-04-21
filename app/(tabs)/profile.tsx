import { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { getGreeting } from '../../services/api';
import { HapticNotification } from '../../utils/haptics';
import { Colors, FontFamilies, Spacing, Radii, Shadows } from '../../constants/theme';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout, refreshAuth } = useAuth();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshAuth();
    setRefreshing(false);
    HapticNotification.success();
  };

  const handleLogout = () => {
    Alert.alert(
      "Disconnetti",
      "Sei sicuro di voler uscire?",
      [
        { text: "Annulla", style: "cancel" },
        { text: "Esci", style: "destructive", onPress: logout }
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingTop: insets.top + Spacing.xl, paddingBottom: 100 }}
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
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Ionicons name="person-outline" size={32} color={Colors.textTertiary} />
        </View>
        <Text style={styles.title}>{user ? user.username : 'Profilo'}</Text>
        <Text style={styles.subtitle}>
          {user ? user.email : 'Accedi per gestire i tuoi memoriali'}
        </Text>
      </View>

      {!user ? (
        <View style={styles.section}>
          <Pressable 
            style={styles.loginButton} 
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.loginButtonText}>Accedi</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.section}>
          <Pressable style={styles.settingsItem} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            <Text style={[styles.settingsLabel, { color: '#EF4444' }]}>Disconnetti</Text>
          </Pressable>
        </View>
      )}

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
