import { createTrackLike, deleteTrackLike } from '@/actions/trackLikeApi';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface LikesState {
  likedTrackIds: Set<number>;
  toggleTrackLike: (trackId: number) => Promise<void>;
  reset: () => void;
}

const withTrack = (ids: Set<number>, trackId: number, liked: boolean) => {
  const next = new Set(ids);
  if (liked) next.add(trackId);
  else next.delete(trackId);
  return next;
};

export const useLikesStore = create<LikesState>()(
  devtools(
    (set, get) => ({
      likedTrackIds: new Set<number>(),

      toggleTrackLike: async (trackId) => {
        const wasLiked = get().likedTrackIds.has(trackId);
        set((s) => ({
          likedTrackIds: withTrack(s.likedTrackIds, trackId, !wasLiked),
        }));
        try {
          if (wasLiked) await deleteTrackLike({ trackId });
          else await createTrackLike({ trackId });
        } catch (error) {
          set((s) => ({
            likedTrackIds: withTrack(s.likedTrackIds, trackId, wasLiked),
          }));
          throw error;
        }
      },

      reset: () => set({ likedTrackIds: new Set<number>() }),
    }),
    { name: 'likes' }
  )
);
