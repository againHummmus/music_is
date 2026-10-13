import type { PlaylistWithTracksRow, TrackRow } from '@/actions/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface PlayerQueue {
  id: string;
  tracks: TrackRow[];
}

export const queueFromPlaylist = (playlist: PlaylistWithTracksRow): PlayerQueue => ({
  id: `playlist-${playlist.id}`,
  tracks: playlist.Playlist_track.flatMap((pt) => (pt.Track ? [pt.Track] : [])),
});

interface PlayerState {
  currentTrack: TrackRow | null;
  queue: PlayerQueue | undefined;
  isPlaying: boolean;
  playTrack: (track: TrackRow) => void;
  togglePlay: () => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setQueue: (queue: PlayerQueue) => void;
  reset: () => void;
}

const initialState = {
  currentTrack: null,
  queue: undefined,
  isPlaying: false,
};

export const usePlayerStore = create<PlayerState>()(
  devtools(
    (set) => ({
      ...initialState,

      playTrack: (track) => set({ currentTrack: track, isPlaying: true }),

      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

      setIsPlaying: (isPlaying) => set({ isPlaying }),

      setQueue: (queue) => set({ queue }),

      reset: () => set(initialState),
    }),
    { name: 'player' }
  )
);
