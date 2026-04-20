import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontFamilies, Spacing } from '../../constants/theme';

export default function EmptyExploreState() {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={48} color={Colors.border} />
      <Text style={styles.title}>Nessun memoriale trovato</Text>
      <Text style={styles.subtitle}>Prova a modificare i filtri o la ricerca</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
    gap: Spacing.md,
  },
  title: {
    fontFamily: FontFamilies.sansMedium,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  subtitle: {
    fontFamily: FontFamilies.sans,
    fontSize: 13,
    color: Colors.textTertiary,
  },
});
