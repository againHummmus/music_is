'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { PlaylistItem } from '@/components/shared/playlist/PlaylistItem';
import { searchUserPlaylists } from '@/actions/userPlaylistApi';

export default function UserPlaylistsScreen({
  initialUser,
  initialUserPlaylistConnections,
  initialLimit,
}: {
  initialUser: any;
  initialUserPlaylistConnections: any[];
  initialLimit: number;
}) {
  const LIMIT = initialLimit;
  const [userPlaylistConnections, setUserPlaylistConnections] = useState<any[]>(
    initialUserPlaylistConnections
  );
  const [user] = useState<any>(initialUser);
  const [offset, setOffset] = useState(initialUserPlaylistConnections.length);
  const [hasMore, setHasMore] = useState(
    initialUserPlaylistConnections.length === initialLimit
  );
  const [isFetching, setIsFetching] = useState(false);
  const isFetchingRef = useRef(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const userId = user?.id;

  const loadMore = useCallback(async () => {
    if (isFetchingRef.current || !hasMore || !userId) return;
    isFetchingRef.current = true;
    setIsFetching(true);
    try {
      const data: any[] =
        (
          await searchUserPlaylists({
            userId,
            limit: LIMIT,
            offset,
          })
        )?.data ?? [];
      if (data.length > 0) {
        setUserPlaylistConnections((prev) => [...prev, ...data]);
      }
      setHasMore(data.length === LIMIT);
      setOffset((prev) => prev + data.length);
    } catch (err) {
      console.error('Error loading playlists:', err);
    } finally {
      isFetchingRef.current = false;
      setIsFetching(false);
    }
  }, [userId, offset, hasMore, LIMIT]);

  useEffect(() => {
    const node = loaderRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: '200px' }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [loadMore]);

  return (
    <div>
      <p className="mb-20 text-3xl font-bold">
        Playlists by <span className="text-mainOrange">{user?.username}</span>
      </p>
      <div className="flex flex-col gap-10">
        {isFetching ? (
          <div className="grid grid-cols-1 gap-4 main:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-[90px] animate-pulse rounded bg-gray-200"
              />
            ))}
          </div>
        ) : userPlaylistConnections.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            No playlists yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 main:grid-cols-2">
            {userPlaylistConnections.map((conn) => (
              <PlaylistItem key={conn.Playlist.id} info={conn.Playlist} />
            ))}
          </div>
        )}

        <div ref={loaderRef} />

        {isFetching && userPlaylistConnections.length > 0 && (
          <div className="py-4 text-center text-sm text-gray-500">
            Loading more…
          </div>
        )}

        {!hasMore && userPlaylistConnections.length > 0 && (
          <div className="py-4 text-center text-sm text-gray-400">
            You&apos;ve reached the end!
          </div>
        )}
      </div>
    </div>
  );
}
