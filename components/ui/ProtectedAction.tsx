import React from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

interface ProtectedActionProps {
  children: (execute: () => void) => React.ReactNode;
  actionName?: string;
}

/**
 * Componente wrapper per proteggere azioni che richiedono l'autenticazione.
 * Se l'utente non è loggato, mostra un avviso e reindirizza alla pagina di login.
 */
export function ProtectedAction({ children, actionName = 'questa azione' }: ProtectedActionProps) {
  const { user } = useAuth();
  const router = useRouter();

  const handlePress = (onExecute: () => void) => {
    if (!user) {
      Alert.alert(
        'Accesso Richiesto',
        `Devi aver effettuato l'accesso per ${actionName}. Vuoi accedere ora?`,
        [
          { text: 'Annulla', style: 'cancel' },
          { 
            text: 'Accedi', 
            onPress: () => router.push('/(auth)/login') 
          },
        ]
      );
      return;
    }
    onExecute();
  };

  return <>{children((execute) => handlePress(execute))}</>;
}

/**
 * Hook per proteggere una funzione con un controllo di autenticazione.
 */
export function useProtectedAction() {
  const { user } = useAuth();
  const router = useRouter();

  const runProtected = (action: () => void, actionName = 'questa azione') => {
    if (!user) {
      Alert.alert(
        'Accesso Richiesto',
        `Devi aver effettuato l'accesso per ${actionName}. Vuoi accedere ora?`,
        [
          { text: 'Annulla', style: 'cancel' },
          { 
            text: 'Accedi', 
            onPress: () => router.push('/(auth)/login') 
          },
        ]
      );
      return;
    }
    action();
  };

  return { runProtected };
}
