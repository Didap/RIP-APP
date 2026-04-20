import { useState } from 'react';
import { View, Text, TextInput, Pressable, Modal, StyleSheet, Platform } from 'react-native';
import { api } from '../../services/api';
import { Colors, FontFamilies, Spacing, Radii } from '../../constants/theme';

interface Props {
  visible: boolean;
  memorialSlug: string;
  onClose: () => void;
  onSubmitted?: () => void;
}

export default function LeaveMemoryModal({ visible, memorialSlug, onClose, onSubmitted }: Props) {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    try {
      await api.createContribution(memorialSlug, 'text', text.trim());
      setText('');
      onSubmitted?.();
      onClose();
    } catch (error) {
      console.error('Errore invio ricordo:', error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Pressable onPress={onClose}>
              <Text style={styles.cancelText}>Annulla</Text>
            </Pressable>
            <Text style={styles.title}>Lascia un ricordo</Text>
            <Pressable onPress={handleSubmit} disabled={!text.trim() || submitting}>
              <Text style={[styles.submitText, (!text.trim() || submitting) && styles.submitDisabled]}>Invia</Text>
            </Pressable>
          </View>

          <TextInput
            style={styles.input}
            multiline
            placeholder="Scrivi un pensiero, un ricordo o un messaggio..."
            placeholderTextColor={Colors.textTertiary}
            value={text}
            onChangeText={setText}
            autoFocus
            maxLength={2000}
          />

          <Text style={styles.counter}>{text.length}/2000</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modal: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radii.xl,
    borderTopRightRadius: Radii.xl,
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : Spacing.xxl,
    minHeight: 300,
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
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: FontFamilies.sans,
    color: Colors.textPrimary,
    lineHeight: 24,
    textAlignVertical: 'top',
  },
  counter: {
    textAlign: 'right',
    fontSize: 12,
    fontFamily: FontFamilies.sans,
    color: Colors.textTertiary,
    marginTop: Spacing.sm,
  },
});
