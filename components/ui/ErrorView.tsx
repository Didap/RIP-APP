import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, FontFamilies, Radii, Spacing } from '../../constants/theme';

interface Props {
  message: string;
  onRetry: () => void;
}

export default function ErrorView({ message, onRetry }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Text style={styles.icon}>!</Text>
      </View>
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity style={styles.button} onPress={onRetry}>
        <Text style={styles.buttonText}>Riprova</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.xxxl,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  icon: {
    color: '#DC2626',
    fontSize: 24,
    fontFamily: FontFamilies.sansBold,
  },
  message: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontFamily: FontFamilies.sans,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  button: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    borderRadius: Radii.sm,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: FontFamilies.sansSemiBold,
  },
});
