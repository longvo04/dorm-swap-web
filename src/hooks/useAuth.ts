import { useState, useEffect, useCallback } from 'react';
import type { User, UserSession } from '@/types';

const AUTH_STORAGE_KEY = 'dormswap_auth';

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (googleToken: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from storage on mount
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        const session: UserSession = JSON.parse(stored);
        // Check if token is expired
        if (new Date(session.expiresAt) > new Date()) {
          setUser(session.user);
        } else {
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (googleToken: string) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/google', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ token: googleToken }),
      // });
      // const data = await response.json();
      
      // Mock user for development
      const mockSession: UserSession = {
        accessToken: 'mock_access_token',
        refreshToken: 'mock_refresh_token',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        user: {
          id: '1',
          email: 'sarah.johnson@university.edu.vn',
          name: 'Sarah Johnson',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
          dormBuilding: 'A3',
          roomNumber: '501',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mockSession));
      setUser(mockSession.user);
      console.log('Login with Google token:', googleToken);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
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
    login,
    logout,
    updateUser,
  };
}

