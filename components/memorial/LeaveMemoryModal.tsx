import { useState } from 'react';
import { View, Text, TextInput, Pressable, Modal, StyleSheet, Platform } from 'react-native';
import { api } from '../../services/api';

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
            placeholderTextColor="#9BA1A6"
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
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    minHeight: 300,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cancelText: { fontSize: 16, color: '#0a7ea4' },
  title: { fontSize: 16, fontWeight: '600', color: '#111827' },
  submitText: { fontSize: 16, color: '#0a7ea4', fontWeight: '600' },
  submitDisabled: { color: '#CBD5E1' },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    lineHeight: 24,
    textAlignVertical: 'top',
  },
  counter: { textAlign: 'right', fontSize: 12, color: '#CBD5E1', marginTop: 8 },
});
