import { useState, useEffect, useCallback } from 'react';
import type { User, UserSession } from '@/types';
// Note: login is now handled directly in the LoginPage to call the auth API.

const AUTH_STORAGE_KEY = 'dormswap_auth';

function readSession(): User | null {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!stored) return null;

  try {
    const session: UserSession = JSON.parse(stored);
    if (new Date(session.expiresAt) > new Date()) {
      return session.user;
    }
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(() => readSession());
  const isLoading = false;

  // Load user from storage on mount
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === AUTH_STORAGE_KEY) {
        setUser(readSession());
      }
    };

    const handleAuthUpdated = () => setUser(readSession());

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-updated', handleAuthUpdated);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-updated', handleAuthUpdated);
    };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    setUser(updatedUser);
    
    // Update storage
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      const session: UserSession = JSON.parse(stored);
      session.user = updatedUser;
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    }
  }, [user]);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    logout,
    updateUser,
  };
}

