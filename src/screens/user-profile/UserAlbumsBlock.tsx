'use client';

import { searchAlbums } from '@/actions/albumApi';
import { AlbumItem } from '@/components/album/AlbumItem';
import { ContentBlock } from '@/components/ui/ContentBlock';
import type { UserRow } from '@/actions/types';

export function UserAlbumsBlock({
  user,
  limit = 4,
}: {
  user: UserRow;
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
        return searchAlbums({
          artistId: user.Artist.id,
          limit,
          offset: 0,
        });
      }}
      renderItem={(album) => <AlbumItem key={album.id} album={album} />}
      gridClassName="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4"
      buttonLabel="Go"
      buttonHref={`/discover/user/${user.id}/albums`}
      skeletonItemClassName="aspect-square bg-neutral-800 rounded-lg animate-pulse"
      skeletonCount={limit}
      hideIfEmpty
    />
  );
}
