import { getAlbum } from '@/actions/albumApi';
import { AlbumScreen } from '@/screens/album/AlbumScreen';
import { EmptyState } from '@/components/ui/EmptyState';

export default async function Page({ params }: { params: { id: string } }) {
  const album = await getAlbum(params.id);

  if (!album) {
    return (
      <EmptyState>Couldn&apos;t load the album. Try again later.</EmptyState>
    );
  }

  return <AlbumScreen album={album} />;
}
