import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { api } from '../../services/api';

interface Props {
  memorialSlug: string;
  stats: { total: number; flowers: number; candles: number; memories: number };
  onMemoryPress?: () => void;
}

export default function ActionButtons({ memorialSlug, stats, onMemoryPress }: Props) {
  const [flowers, setFlowers] = useState(stats.flowers);
  const [candles, setCandles] = useState(stats.candles);
  const [loading, setLoading] = useState<string | null>(null);

  async function handleAction(type: 'flower' | 'candle') {
    const setCount = type === 'flower' ? setFlowers : setCandles;
    setCount(prev => prev + 1);
    setLoading(type);
    try {
      await api.createContribution(memorialSlug, type);
    } catch {
      setCount(prev => prev - 1);
    } finally {
      setLoading(null);
    }
  }

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.button, loading === 'flower' && styles.buttonDisabled]}
        onPress={() => handleAction('flower')}
        disabled={!!loading}
      >
        <Text style={styles.emoji}>🌸</Text>
        <Text style={styles.label}>Fiore</Text>
        <Text style={styles.count}>{flowers}</Text>
      </Pressable>

      <Pressable
        style={[styles.button, loading === 'candle' && styles.buttonDisabled]}
        onPress={() => handleAction('candle')}
        disabled={!!loading}
      >
        <Text style={styles.emoji}>🕯️</Text>
        <Text style={styles.label}>Candela</Text>
        <Text style={styles.count}>{candles}</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={onMemoryPress}>
        <Text style={styles.emoji}>💭</Text>
        <Text style={styles.label}>Ricordo</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
    paddingBottom: 28,
    paddingHorizontal: 20,
    gap: 12,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
  },
  buttonDisabled: { opacity: 0.5 },
  emoji: { fontSize: 22 },
  label: { fontSize: 12, color: '#475569', fontWeight: '500' },
  count: { fontSize: 11, color: '#94A3B8' },
});
