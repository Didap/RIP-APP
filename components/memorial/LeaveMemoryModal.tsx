import { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  Modal, 
  StyleSheet, 
  Platform, 
  KeyboardAvoidingView, 
  TouchableWithoutFeedback, 
  Keyboard,
  Switch
} from 'react-native';
import { api } from '../../services/api';
import { Colors, FontFamilies, Spacing, Radii, Shadows } from '../../constants/theme';

interface Props {
  visible: boolean;
  memorialSlug: string;
  onClose: () => void;
  onSubmitted?: () => void;
}

export default function LeaveMemoryModal({ visible, memorialSlug, onClose, onSubmitted }: Props) {
  const [text, setText] = useState('');
  const [year, setYear] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    try {
      // Use Jan 1st of that year if only year is provided
      const dateStr = year.trim() ? `${year.trim()}-01-01` : undefined;
      await api.createContribution(memorialSlug, 'text', text.trim(), dateStr, isAnonymous);
      setText('');
      setYear('');
      setIsAnonymous(false);
      onSubmitted?.();
      onClose();
    } catch (error) {
      console.error('Errore invio ricordo:', error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal 
      visible={visible} 
      animationType="slide" 
      transparent={Platform.OS !== 'ios'} 
      presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'overFullScreen'}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>
              <View style={styles.header}>
                <Pressable onPress={onClose}>
                  <Text style={styles.cancelText}>Annulla</Text>
                </Pressable>
                <Text style={styles.title}>Lascia un ricordo</Text>
                <Pressable onPress={handleSubmit} disabled={!text.trim() || submitting}>
                  <Text style={[styles.submitText, (!text.trim() || submitting) && styles.submitDisabled]}>Invia</Text>
                </Pressable>
              </View>

              <View style={styles.yearContainer}>
                <Text style={styles.yearLabel}>In che anno è successo?</Text>
                <TextInput
                  style={styles.yearInput}
                  placeholder="Esempio: 2014"
                  placeholderTextColor={Colors.textTertiary}
                  value={year}
                  onChangeText={setYear}
                  keyboardType="number-pad"
                  maxLength={4}
                  blurOnSubmit={false}
                />
              </View>

              <TextInput
                style={styles.input}
                multiline
                placeholder="Scrivi un pensiero, un ricordo o un messaggio..."
                placeholderTextColor={Colors.textTertiary}
                value={text}
                onChangeText={setText}
                maxLength={2000}
                textAlignVertical="top"
              />

              <Text style={styles.counter}>{text.length}/2000</Text>

              <View style={styles.anonymousRow}>
                <View style={styles.anonymousTextWrapper}>
                  <Text style={styles.anonymousLabel}>Rimani anonimo</Text>
                  <Text style={styles.anonymousHelp}>Il tuo nome non verrà mostrato nel ricordo.</Text>
                </View>
                <Switch
                  value={isAnonymous}
                  onValueChange={setIsAnonymous}
                  trackColor={{ false: Colors.border, true: Colors.accent }}
                  thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : isAnonymous ? Colors.surface : '#f4f3f4'}
                />
              </View>
            </Pressable>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  keyboardView: {
    width: '100%',
  },
  modal: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : Spacing.xxl,
    minHeight: 400, // Slightly taller
    margin: Spacing.md,
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  cancelText: {
    fontSize: 16,
    fontFamily: FontFamilies.sans,
    color: Colors.textSecondary,
  },
  title: {
    fontSize: 16,
    fontFamily: FontFamilies.sansSemiBold,
    color: Colors.textPrimary,
  },
  submitText: {
    fontSize: 16,
    fontFamily: FontFamilies.sansSemiBold,
    color: Colors.accent,
  },
  submitDisabled: {
    color: Colors.border,
  },
  yearContainer: {
    marginBottom: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  yearLabel: {
    fontSize: 12,
    fontFamily: FontFamilies.sansSemiBold,
    color: Colors.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  yearInput: {
    fontSize: 16,
    fontFamily: FontFamilies.sans,
    color: Colors.textPrimary,
    padding: 0,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: FontFamilies.sans,
    color: Colors.textPrimary,
    lineHeight: 24,
    minHeight: 150, // Added minHeight
    textAlignVertical: 'top',
  },
  counter: {
    textAlign: 'right',
    fontSize: 12,
    fontFamily: FontFamilies.sans,
    color: Colors.textTertiary,
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  anonymousRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.searchBg,
    padding: Spacing.md,
    borderRadius: Radii.md,
    marginTop: Spacing.md,
  },
  anonymousTextWrapper: {
    flex: 1,
    marginRight: Spacing.md,
  },
  anonymousLabel: {
    fontSize: 14,
    fontFamily: FontFamilies.sansSemiBold,
    color: Colors.textPrimary,
  },
  anonymousHelp: {
    fontSize: 12,
    fontFamily: FontFamilies.sans,
    color: Colors.textTertiary,
    marginTop: 2,
  },
});
