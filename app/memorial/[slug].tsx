import { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useMemorial } from '../../hooks/useMemorial';
import MemorialTemplateRenderer from '../../components/templates/MemorialTemplateRenderer';
import ActionButtons from '../../components/memorial/ActionButtons';
import LeaveMemoryModal from '../../components/memorial/LeaveMemoryModal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorView from '../../components/ui/ErrorView';

export default function MemorialScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
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

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <MemorialTemplateRenderer memorial={memorial} />
      </View>
      <ActionButtons
        memorialSlug={slug}
        stats={memorial.stats}
        onMemoryPress={() => setMemoryModalVisible(true)}
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
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1 },
});
