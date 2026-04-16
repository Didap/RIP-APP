import { View, Text, StyleSheet } from 'react-native';

export default function SearchScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Cerca</Text>
      <Text style={styles.subtext}>La ricerca sara disponibile prossimamente.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  text: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 8 },
  subtext: { fontSize: 14, color: '#9BA1A6' },
});
