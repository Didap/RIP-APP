import { useState, useCallback } from 'react';
import { View, StyleSheet, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useMemorial } from '../../hooks/useMemorial';
import { useProtectedAction } from '../../components/ui/ProtectedAction';
import { HapticNotification } from '../../utils/haptics';
import MemorialDetailScreen from '../../components/memorial/MemorialDetailScreen';
import LeaveMemoryModal from '../../components/memorial/LeaveMemoryModal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorView from '../../components/ui/ErrorView';

export default function MemorialScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [memoryModalVisible, setMemoryModalVisible] = useState(false);

  const { data: memorial, isLoading, error, refetch } = useMemorial(slug);
  const { runProtected } = useProtectedAction();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
    HapticNotification.success();
  }, [refetch]);

  const handleShare = useCallback(async () => {
    if (!memorial) return;
    try {
      const url = `https://restinpixel.it/m/${slug}`;
      await Share.share({
        message: `In Memoria di ${memorial.full_name}. Chi viene ricordato, vive.`,
        url: url,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }, [memorial, slug]);

  const handleMemorySubmitted = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['memorial', slug] });
    queryClient.invalidateQueries({ queryKey: ['feed'] });
    HapticNotification.success();
  }, [queryClient, slug]);

  if (isLoading) return <LoadingSpinner />;
  if (error || !memorial) {
    return <ErrorView message="Memoriale non trovato" onRetry={() => refetch()} />;
  }

  const isDark = memorial.template === 'elegant';

  return (
    <View style={styles.container}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <MemorialDetailScreen
        memorial={memorial}
        onBack={() => router.back()}
        onContribution={() => {
          refetch();
          HapticNotification.success();
        }}
        onLeaveMemory={() => runProtected(() => setMemoryModalVisible(true), 'lasciare un ricordo')}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onShare={handleShare}
      />
      <LeaveMemoryModal
        visible={memoryModalVisible}
        memorialSlug={slug}
        onClose={() => setMemoryModalVisible(false)}
        onSubmitted={handleMemorySubmitted}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
