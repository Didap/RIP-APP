import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../services/storage';
import { api } from '../services/api';

interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, userData: User) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: User) => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  async function loadStoredAuth() {
    try {
      const storedToken = await storage.getItem('userToken');
      if (storedToken) {
        setToken(storedToken);
        // Validate token and get fresh user data
        const userData = await api.getMe(storedToken);
        setUser(userData);
      }
    } catch (error) {
      console.error('Errore durante il caricamento della sessione:', error);
      // In caso di errore (es: token scaduto), puliamo tutto
      await logout();
    } finally {
      setIsLoading(false);
    }
  }

  async function login(newToken: string, userData: User) {
    setToken(newToken);
    setUser(userData);
    await storage.setItem('userToken', newToken);
  }

  async function logout() {
    setToken(null);
    setUser(null);
    await storage.removeItem('userToken');
  }

  function updateUser(userData: User) {
    setUser(userData);
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, updateUser, refreshAuth: loadStoredAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve essere utilizzato all\'interno di un AuthProvider');
  }
  return context;
}
