'use client';

import { searchAlbums } from '@/actions/albumApi';
import AlbumCard from '@/components/album/AlbumItem';
import { ContentBlock } from '../shared/ContentBlock';

export default function UserAlbumsBlock({
  user,
  limit = 4,
}: {
  user: any;
  limit?: number;
}) {
  if (!user?.id) return null;

  return (
    <ContentBlock
      title={
        <>
          Albums by <span className="text-mainOrange">{user.username}</span>
        </>
      }
      fetchItems={async () => {
        if (!user?.Artist?.id) return [];
        const res = await searchAlbums({
          artistId: user.Artist.id,
          limit,
          offset: 0,
        });
        return (res as any).data ?? [];
      }}
      renderItem={(album) => <AlbumCard key={album.id} album={album} />}
      gridClassName="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4"
      buttonLabel="Go"
      buttonHref={`/discover/user/${user.id}/albums`}
      skeletonItemClassName="aspect-square bg-neutral-800 rounded-lg animate-pulse"
      skeletonCount={limit}
      hideIfEmpty
    />
  );
}
