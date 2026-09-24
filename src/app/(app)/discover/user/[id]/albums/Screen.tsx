'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { searchAlbums } from '@/actions/albumApi';
import AlbumCard from '@/components/album/AlbumItem';

export default function UserAlbumsScreen({
  initialUser,
  initialAlbums,
  initialLimit,
}: {
  initialUser: any;
  initialAlbums: any[];
  initialLimit: number;
}) {
  const LIMIT = initialLimit;
  const [albums, setAlbums] = useState<any[]>(initialAlbums);
  const [user] = useState<any>(initialUser);
  const [offset, setOffset] = useState(initialAlbums.length);
  const [hasMore, setHasMore] = useState(initialAlbums.length === LIMIT);
  const [isLoading, setIsLoading] = useState(false);
  const isFetchingRef = useRef(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const loadMoreAlbums = useCallback(async () => {
    if (isFetchingRef.current || !hasMore || !user?.Artist?.id) return;

    isFetchingRef.current = true;
    setIsLoading(true);

    try {
      const newAlbums =
        (await searchAlbums({
        artistId: user.Artist.id,
        limit: LIMIT,
        offset: offset,
      }))?.data ?? [];

      if (newAlbums && newAlbums.length > 0) {
        setAlbums((prevAlbums) => [...prevAlbums, ...newAlbums]);
        setOffset((prev) => prev + newAlbums.length);
        setHasMore(newAlbums.length === LIMIT);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error loading albums:', err);
    } finally {
      isFetchingRef.current = false;
      setIsLoading(false);
    }
  }, [user, offset, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !isLoading)
          loadMoreAlbums();
      },
      { rootMargin: '400px' }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [loadMoreAlbums, hasMore, isLoading]);

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
            {albums.map((album: any) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        ) : (
          !isLoading && (
            <div className="py-8 text-center text-gray-500">
              This user has no albums yet.
            </div>
          )
        )}

        <div ref={loaderRef} />

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
