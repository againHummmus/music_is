import { searchAlbums } from '@/actions/albumApi';
import type { AlbumRow } from '@/actions/types';
import { AlbumItem } from '@/components/album/AlbumItem';
import { Section } from '@/components/ui/Section';

export async function UserAlbumsBlock({
  userId,
  username,
  artistId,
  limit = 4,
}: {
  userId: number;
  username: string | null;
  artistId: number;
  limit?: number;
}) {
  const albums = await searchAlbums({ artistId, limit, offset: 0 }).catch(
    (): AlbumRow[] => []
  );
  if (albums.length === 0) return null;

  return (
    <Section
      title={
        <>
          Albums by <span className="text-mainOrange">{username}</span>
        </>
      }
      buttonLabel="Go"
      buttonHref={`/discover/user/${userId}/albums`}
    >
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
        {albums.map((album) => (
          <AlbumItem key={album.id} album={album} />
        ))}
      </div>
    </Section>
  );
}
