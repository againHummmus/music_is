// store/authStore.ts
import AuthApi from "@/actions/authApi";
import axios from "axios";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface Modal {
  isOpen: boolean;
  type?: string;
  message?: string;
  redirectUrl?: string;
}

interface AuthState {
  isAuth: boolean;
  isLoading: boolean;
  user: User;
  modal: Modal;
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  setModal: (value: Modal) => void;
  setIsAuth: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setUser: (value: User) => void;
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  setCurrentTime: (time: number) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string, avatar: string) => Promise<void>;
  signOut: () => Promise<void>;
  update: () => Promise<void>;
}

export const useStore = create<AuthState>()(
  devtools((set, get) => ({
    // Базовое состояние
    isAuth: false,
    isLoading: true,
    user: null,
    modal: {
      isOpen: false,
      type: undefined,
      message: undefined,
      redirectUrl: undefined,
    },
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,

    setModal: (value: Modal) => set({ modal: value }),
    setIsAuth: (value: boolean) => set({ isAuth: value }),
    setIsLoading: (value: boolean) => set({ isLoading: value }),
    setUser: (value: User) => set({ user: value }),

    playTrack: (track: Track) =>
      set({ currentTrack: track, isPlaying: true, currentTime: 0 }),
    togglePlay: () => set((state) => ({ 
      isPlaying: !state.isPlaying 
    })),
    setCurrentTime: (time: number) => set({ currentTime: time }),

    signIn: async (email: string, password: string) => {
      try {
        const response = await AuthApi.signIn({ email, password });
        set({ isAuth: true, user: response.data.user });
      } catch (e: any) {
        console.error(e.response?.data?.message);
      }
    },

    signUp: async (email: string, password: string, username: string, avatar: string) => {
      try {
        const response = await AuthApi.signUp({ email, password, username, avatar });
        set({ isAuth: true, user: response.data.user });
      } catch (e: any) {
        console.error(e.response?.data?.message);
      }
    },

    signOut: async () => {
      try {
        await AuthApi.signOut();
        set({ isAuth: false, user: undefined });
      } catch (e: any) {
        console.error(e.response?.data?.message);
      }
    },

    update: async () => {
      set({ isLoading: true });
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/refresh`,
          {},
          { withCredentials: true }
        );
        set({ isAuth: true, user: response.data });
      } catch (e: any) {
        console.error(e.response?.data?.message);
        set({ isAuth: false, user: undefined });
      } finally {
        set({ isLoading: false });
      }
    },
  }))
);
