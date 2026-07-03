import { User } from '@/types/auth/auth.types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  setToken: (token: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  user: User | null;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      user: null,

      setToken: (token) => set({ token }),
      setRefreshToken: (refreshToken:string) => set({ refreshToken }),
      setUser: (user: User) => set({ user }),
      logout: () => set({ token: null, refreshToken: null, user: null }),

      isAuthenticated: () => !!get().token,
    }),
    {
      name: 'auth-storage',
    }
  )
);