import { searchAlbums } from '@/actions/albumApi';
import AlbumScreen from './Screen';
import StreamlineSleep from '~icons/streamline/sleep?width=48px&height=48px';

export default async function Page({ params }: { params: { id: string } }) {
  const { data } = await searchAlbums({ id: params.id, limit: 1 });
  const album = data?.[0] ?? null;

  if (!album) {
    return (
      <div className="flex h-[230px] flex-col items-center justify-center gap-20 rounded-[7px] border border-dashed border-mainOrange text-mainOrange">
        <StreamlineSleep className="h-[40px] w-[40px]" />
        <p>Couldn&apos;t load the album. Try again later.</p>
      </div>
    );
  }

  return <AlbumScreen album={album} />;
}
