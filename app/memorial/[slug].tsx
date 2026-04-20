import { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useMemorial } from '../../hooks/useMemorial';
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

  const handleMemorySubmitted = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['memorial', slug] });
    queryClient.invalidateQueries({ queryKey: ['feed'] });
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
        onContribution={() => refetch()}
        onLeaveMemory={() => setMemoryModalVisible(true)}
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
