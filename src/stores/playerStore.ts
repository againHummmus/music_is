import type { PlaylistRow, TrackRow } from '@/actions/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface PlayerState {
  currentTrack: TrackRow | null;
  currentPlaylist: PlaylistRow | undefined;
  isPlaying: boolean;
  currentTime: number;
  playTrack: (track: TrackRow) => void;
  togglePlay: () => void;
  setCurrentTime: (time: number) => void;
  setCurrentPlaylist: (playlist: PlaylistRow) => void;
  reset: () => void;
}

const initialState = {
  currentTrack: null,
  currentPlaylist: undefined,
  isPlaying: false,
  currentTime: 0,
};

export const usePlayerStore = create<PlayerState>()(
  devtools(
    (set) => ({
      ...initialState,

      playTrack: (track) =>
        set({ currentTrack: track, isPlaying: true, currentTime: 0 }),

      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

      setCurrentTime: (time) => set({ currentTime: time }),

      setCurrentPlaylist: (playlist) => set({ currentPlaylist: playlist }),

      reset: () => set(initialState),
    }),
    { name: 'player' }
  )
);
