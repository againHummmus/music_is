'use client';

import { searchAlbums } from '@/actions/albumApi';
import { AlbumItem } from '@/components/album/AlbumItem';
import { useInfiniteList } from '@/hooks/useInfiniteList';
import type { AlbumRow, UserRow } from '@/actions/types';

export function UserAlbumsScreen({
  initialUser,
  initialAlbums,
  initialLimit,
}: {
  initialUser: UserRow | null;
  initialAlbums: AlbumRow[];
  initialLimit: number;
}) {
  const user = initialUser;
  const artistId = user?.Artist?.id;
  const {
    items: albums,
    hasMore,
    isLoading,
    sentinelRef,
  } = useInfiniteList({
    fetchPage: (offset, limit) =>
      artistId
        ? searchAlbums({ artistId, limit, offset })
        : Promise.resolve([]),
    limit: initialLimit,
    initialItems: initialAlbums,
    enabled: Boolean(artistId),
  });

  const showSkeleton = isLoading && albums.length === 0;

  return (
    <div>
      <h1 className="mb-20 text-3xl font-bold">
        Albums by{' '}
        <span className="text-mainOrange">{user?.username || '...'}</span>
      </h1>
      <div>
        {showSkeleton ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square animate-pulse rounded-lg bg-neutral-800"
              />
            ))}
          </div>
        ) : albums.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {albums.map((album) => (
              <AlbumItem key={album.id} album={album} />
            ))}
          </div>
        ) : (
          !isLoading && (
            <div className="py-8 text-center text-gray-500">
              This user has no albums yet.
            </div>
          )
        )}

        <div ref={sentinelRef} />

        {isLoading && albums.length > 0 && (
          <div className="py-4 text-center text-sm text-gray-500">
            Loading more…
          </div>
        )}

        {!hasMore && albums.length > 0 && (
          <div className="py-4 text-center text-sm text-gray-400">
            You&apos;ve reached the end!
          </div>
        )}
      </div>
    </div>
  );
}
