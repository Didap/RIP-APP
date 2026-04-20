import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontFamilies, Spacing } from '../../constants/theme';

interface Props {
  text: string;
  author: string;
}

export default function QuoteSection({ text, author }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.goldLine} />
      <View style={styles.content}>
        <Text style={styles.quote}>{text}</Text>
        <Text style={styles.author}>— {author}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxxl,
    gap: Spacing.lg,
  },
  goldLine: {
    width: 3,
    backgroundColor: Colors.gold,
    borderRadius: 2,
    minHeight: 60,
  },
  content: {
    flex: 1,
    gap: Spacing.xs,
  },
  quote: {
    fontFamily: FontFamilies.serifItalic,
    fontSize: 20,
    color: Colors.textPrimary,
    lineHeight: 28,
  },
  author: {
    fontFamily: FontFamilies.sans,
    fontSize: 13,
    color: Colors.textTertiary,
    marginTop: Spacing.xs,
  },
});
