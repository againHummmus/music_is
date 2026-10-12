'use client';

import { PlaylistItem } from '@/components/playlist/PlaylistItem';
import { searchUserPlaylists } from '@/actions/userPlaylistApi';
import { useInfiniteList } from '@/hooks/useInfiniteList';
import type { UserPlaylistRow, UserRow } from '@/actions/types';

export function UserPlaylistsScreen({
  initialUser,
  initialUserPlaylistConnections,
  initialLimit,
}: {
  initialUser: UserRow | null;
  initialUserPlaylistConnections: UserPlaylistRow[];
  initialLimit: number;
}) {
  const user = initialUser;
  const userId = user?.id;
  const {
    items: userPlaylistConnections,
    hasMore,
    isLoading: isFetching,
    sentinelRef,
  } = useInfiniteList({
    fetchPage: (offset, limit) =>
      userId
        ? searchUserPlaylists({ userId, limit, offset })
        : Promise.resolve([]),
    limit: initialLimit,
    initialItems: initialUserPlaylistConnections,
    enabled: Boolean(userId),
  });

  const visiblePlaylists = userPlaylistConnections.flatMap((conn) =>
    conn.Playlist ? [conn.Playlist] : []
  );

  return (
    <div>
      <p className="mb-20 text-3xl font-bold">
        Playlists by <span className="text-mainOrange">{user?.username}</span>
      </p>
      <div className="flex flex-col gap-10">
        {isFetching && visiblePlaylists.length === 0 ? (
          <div className="grid grid-cols-1 gap-4 main:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-[90px] animate-pulse rounded bg-gray-200"
              />
            ))}
          </div>
        ) : visiblePlaylists.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            No playlists yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 main:grid-cols-2">
            {visiblePlaylists.map((playlist) => (
              <PlaylistItem key={playlist.id} info={playlist} />
            ))}
          </div>
        )}

        <div ref={sentinelRef} />

        {isFetching && visiblePlaylists.length > 0 && (
          <div className="py-4 text-center text-sm text-gray-500">
            Loading more…
          </div>
        )}

        {!hasMore && visiblePlaylists.length > 0 && (
          <div className="py-4 text-center text-sm text-gray-400">
            You&apos;ve reached the end!
          </div>
        )}
      </div>
    </div>
  );
}
