import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { authService } from '../services/auth.service';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setToken: (token: string) => void;
  fetchUser: () => Promise<void>;
  logout: () => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setToken: (token: string) => {
        localStorage.setItem('auth_token', token);
        set({ token, isAuthenticated: true });
      },

      fetchUser: async () => {
        set({ isLoading: true });
        try {
          const user = await authService.getProfile();
          set({ user, isAuthenticated: true, isLoading: false });
        } catch {
          set({ user: null, isAuthenticated: false, isLoading: false, token: null });
          localStorage.removeItem('auth_token');
        }
      },

      logout: () => {
        localStorage.removeItem('auth_token');
        set({ user: null, token: null, isAuthenticated: false });
      },

      initialize: async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          set({ isLoading: false });
          return;
        }
        set({ token, isLoading: true });
        await get().fetchUser();
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ token: state.token }),
    },
  ),
);
