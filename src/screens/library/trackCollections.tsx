import type { ReactNode } from 'react';
import {
  getChartTracks,
  getFriendsLikeTracks,
  getLikedTracks,
} from '@/actions/libraryApi';
import type { TrackRow } from '@/actions/types';

export interface TrackCollection {
  slug: string;
  title: ReactNode;
  emptyText: string;
  load: (limit: number) => Promise<TrackRow[]>;
}

export const TRACK_COLLECTIONS = {
  liked: {
    slug: 'liked',
    title: <span className="text-mainOrange">Your favourite:</span>,
    emptyText: 'Like some tracks and they will show up here!',
    load: getLikedTracks,
  },
  charts: {
    slug: 'charts',
    title: 'CHARTS:',
    emptyText: 'Nobody has liked anything yet!',
    load: getChartTracks,
  },
  friendsLike: {
    slug: 'friends-like',
    title: 'Your friends like:',
    emptyText: 'Follow people to see what they like!',
    load: getFriendsLikeTracks,
  },
} satisfies Record<string, TrackCollection>;

export const findTrackCollection = (
  slug: string
): TrackCollection | undefined =>
  Object.values(TRACK_COLLECTIONS).find(
    (collection) => collection.slug === slug
  );
