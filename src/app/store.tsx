import {
  signUp as signUpAction,
  signIn as signInAction,
  signOut as signOutAction,
  getUser as getUserAction,
} from '@/actions/authApi';
import type {
  AuthResult,
  PlaylistRow,
  TrackRow,
  UserWithArtist,
} from '@/actions/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Modal {
  isOpen: boolean;
  type?: string;
  message?: string;
  redirectUrl?: string;
}

interface AuthState {
  isAuth: boolean;
  isLoading: boolean;
  user: UserWithArtist | undefined;
  modal: Modal;
  currentTrack: TrackRow | null;
  isPlaying: boolean;
  currentTime: number;
  chosenTrack: TrackRow | undefined;
  setModal: (value: Modal) => void;
  setIsAuth: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setUser: (value: UserWithArtist) => void;
  setChosenTrack: (track: TrackRow | undefined) => void;
  playTrack: (track: TrackRow) => void;
  togglePlay: () => void;
  setCurrentTime: (time: number) => void;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (
    email: string,
    password: string,
    username: string
  ) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  update: () => Promise<void>;
  currentPlaylist: PlaylistRow | undefined;
  setCurrentPlaylist: (playlist: PlaylistRow) => void;
}

function normalizeUser({
  user,
}: {
  user: UserWithArtist | null;
}): UserWithArtist | undefined {
  if (!user) return undefined;
  return {
    ...user,
    is_activated:
      typeof user.is_activated === 'boolean' ? user.is_activated : false,
  };
}

export const useStore = create<AuthState>()(
  devtools((set, get) => ({
    isAuth: false,
    isLoading: true,
    user: undefined,
    modal: {
      isOpen: false,
      type: undefined,
      message: undefined,
      redirectUrl: undefined,
    },
    currentTrack: null,
    currentPlaylist: undefined,
    isPlaying: false,
    currentTime: 0,
    chosenTrack: undefined,

    setModal: (value: Modal) => set({ modal: value }),
    setIsAuth: (value: boolean) => set({ isAuth: value }),
    setIsLoading: (value: boolean) => set({ isLoading: value }),
    setUser: (value: UserWithArtist) => set({ user: value }),
    setChosenTrack: (track: TrackRow | undefined) =>
      set({ chosenTrack: track }),
    setCurrentPlaylist: (currentPlaylist: PlaylistRow) =>
      set({ currentPlaylist: currentPlaylist }),

    playTrack: (track: TrackRow) =>
      set({ currentTrack: track, isPlaying: true, currentTime: 0 }),

    togglePlay: () =>
      set((state) => ({
        isPlaying: !state.isPlaying,
      })),
    setCurrentTime: (time: number) => set({ currentTime: time }),

    signIn: async (email: string, password: string) => {
      const response = await signInAction({ email, password });
      if (!response.error) {
        const user = normalizeUser({ user: response.data?.user ?? null });
        set({ isAuth: Boolean(user), user });
      }
      return response;
    },

    signUp: async (email: string, password: string, username: string) => {
      const response = await signUpAction({ email, password, username });
      if (!response.error) {
        const user = normalizeUser({ user: response.data?.user ?? null });
        set({ isAuth: Boolean(user), user });
      }
      return response;
    },

    signOut: async () => {
      const response = await signOutAction();
      if (response.error) {
        console.error(response.error?.message ?? response.error);
      }
      set({ isAuth: false, user: undefined });
    },

    update: async () => {
      set({ isLoading: true });
      const response = await getUserAction();
      if (response.error || !response.data?.user) {
        if (response.error) {
          console.error(response.error?.message ?? response.error);
        }
        set({ isAuth: false, user: undefined, isLoading: false });
        return;
      }

      const user = normalizeUser({ user: response.data.user });
      set({ isAuth: true, user, isLoading: false });
    },
  }))
);
