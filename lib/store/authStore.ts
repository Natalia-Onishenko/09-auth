import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/user';

type AuthStore = {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  clearIsAuthenticated: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    set => ({
      user: null,
      isAuthenticated: false,
      setUser: user =>
        set({
          user,
          isAuthenticated: true,
        }),
      clearIsAuthenticated: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-store',
    }
  )
);
