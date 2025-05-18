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
  chosenTrack: Track;
  setModal: (value: Modal) => void;
  setIsAuth: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setUser: (value: User) => void;
  setChosenTrack: (track: Track | undefined) => void;
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  setCurrentTime: (time: number) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  update: () => Promise<void>;
  currentPlaylist: Playlist;
  setCurrentPlaylist: (tracks: Track[]) => void;
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
    currentTrack: undefined,
    currentPlaylist: [],
    isPlaying: false,
    currentTime: 0,
    chosenTrack: undefined,

    setModal: (value: Modal) => set({ modal: value }),
    setIsAuth: (value: boolean) => set({ isAuth: value }),
    setIsLoading: (value: boolean) => set({ isLoading: value }),
    setUser: (value: User) => set({ user: value }),
    setChosenTrack: (track: Track) =>  set({ chosenTrack: track }),
    setCurrentPlaylist: (currentPlaylist: Playlist) =>
      set({ currentPlaylist: currentPlaylist }),

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
        console.error('error in action ' + e.message);
      }
    },

    signUp: async (email: string, password: string, username: string) => {
      try {
        const response = await AuthApi.signUp({ email, password, username });
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
        set({ isAuth: true, user: response.data, isLoading: false });
      } catch (e: any) {
        console.error(e.response?.data?.message);
        set({ isAuth: false, user: undefined, isLoading: false });
      }
    },
  }))
);
