import {
  signUp as signUpAction,
  signIn as signInAction,
  signOut as signOutAction,
  getUser as getUserAction,
} from '@/actions/authApi';
import type { AuthResult, UserWithArtist } from '@/actions/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { usePlayerStore } from './playerStore';

interface AuthState {
  isAuth: boolean;
  isLoading: boolean;
  user: UserWithArtist | undefined;
  setIsAuth: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setUser: (value: UserWithArtist) => void;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (
    email: string,
    password: string,
    username: string
  ) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  update: () => Promise<void>;
}

function normalizeUser(user: UserWithArtist | null): UserWithArtist | undefined {
  if (!user) return undefined;
  return {
    ...user,
    is_activated:
      typeof user.is_activated === 'boolean' ? user.is_activated : false,
  };
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      isAuth: false,
      isLoading: true,
      user: undefined,

      setIsAuth: (value) => set({ isAuth: value }),
      setIsLoading: (value) => set({ isLoading: value }),
      setUser: (value) => set({ user: value }),

      signIn: async (email, password) => {
        const response = await signInAction({ email, password });
        if (!response.error) {
          const user = normalizeUser(response.data?.user ?? null);
          set({ isAuth: Boolean(user), user });
        }
        return response;
      },

      signUp: async (email, password, username) => {
        const response = await signUpAction({ email, password, username });
        if (!response.error) {
          const user = normalizeUser(response.data?.user ?? null);
          set({ isAuth: Boolean(user), user });
        }
        return response;
      },

      signOut: async () => {
        const response = await signOutAction();
        if (response.error) {
          console.error(response.error.message);
        }
        set({ isAuth: false, user: undefined });
        usePlayerStore.getState().reset();
      },

      update: async () => {
        set({ isLoading: true });
        const response = await getUserAction();
        if (response.error || !response.data?.user) {
          if (response.error) {
            console.error(response.error.message);
          }
          set({ isAuth: false, user: undefined, isLoading: false });
          return;
        }

        set({
          isAuth: true,
          user: normalizeUser(response.data.user),
          isLoading: false,
        });
      },
    }),
    { name: 'auth' }
  )
);
