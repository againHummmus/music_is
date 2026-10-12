import { searchAlbums } from '@/actions/albumApi';
import { AlbumScreen } from '@/screens/album/AlbumScreen';
import { EmptyState } from '@/components/ui/EmptyState';

export default async function Page({ params }: { params: { id: string } }) {
  const albums = await searchAlbums({ id: params.id, limit: 1 });
  const album = albums[0] ?? null;

  if (!album) {
    return (
      <EmptyState>Couldn&apos;t load the album. Try again later.</EmptyState>
    );
  }

  return <AlbumScreen album={album} />;
}
