import AuthApi from "@/actions/authApi";
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
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, username: string) => Promise<any>;
  signOut: () => Promise<any>;
  update: () => Promise<any>;
  currentPlaylist: Playlist;
  setCurrentPlaylist: (tracks: Track[]) => void;
}

function normalizeUser({ user }: { user: any | null }): any | undefined {
  if (!user) return undefined;
  return {
    ...user,
    is_activated:
      typeof user.is_activated === "boolean" ? user.is_activated : false,
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
    currentTrack: undefined,
    currentPlaylist: [],
    isPlaying: false,
    currentTime: 0,
    chosenTrack: undefined,

    setModal: (value: Modal) => set({ modal: value }),
    setIsAuth: (value: boolean) => set({ isAuth: value }),
    setIsLoading: (value: boolean) => set({ isLoading: value }),
    setUser: (value: User) => set({ user: value }),
    setChosenTrack: (track: Track) => set({ chosenTrack: track }),
    setCurrentPlaylist: (currentPlaylist: Playlist) =>
      set({ currentPlaylist: currentPlaylist }),

    playTrack: (track: Track) =>
      set({ currentTrack: track, isPlaying: true, currentTime: 0 }),
    
    togglePlay: () => set((state) => ({
      isPlaying: !state.isPlaying
    })),
    setCurrentTime: (time: number) => set({ currentTime: time }),

    signIn: async (email: string, password: string) => {
      const response = await AuthApi.signIn({ email, password });
      if (!response.error) {
        const user = normalizeUser({ user: response.data?.user ?? null });
        set({ isAuth: Boolean(user), user });
      }
      return response;
    },

    signUp: async (email: string, password: string, username: string) => {
      const response = await AuthApi.signUp({ email, password, username });
      if (!response.error) {
        const user = normalizeUser({ user: response.data?.user ?? null });
        set({ isAuth: Boolean(user), user });
      }
      return response;
    },

    signOut: async () => {
      const response = await AuthApi.signOut();
      if (response.error) {
        console.error(response.error?.message ?? response.error);
      }
      set({ isAuth: false, user: undefined });
    },

    update: async () => {
      set({ isLoading: true });
      const response = await AuthApi.getSession();
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
