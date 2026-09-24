import { getUser } from '@/actions/userApi';
import { searchAlbums } from '@/actions/albumApi';
import UserAlbumsScreen from './Screen';
import StreamlineSleep from '~icons/streamline/sleep?width=48px&height=48px';

const LIMIT = 8;

export default async function Page({ params }: { params: { id: string } }) {
  const user = await getUser({ id: String(params.id) });
  const artistId = user?.Artist?.id;

  const initialAlbums = artistId
    ? (await searchAlbums({ artistId, limit: LIMIT, offset: 0 })).data ??
      []
    : [];

    if (!initialAlbums || initialAlbums.length === 0) {
      return (
        <div className="flex h-[230px] flex-col items-center justify-center gap-20 rounded-[7px] border border-dashed border-mainOrange text-mainOrange">
          <StreamlineSleep className="h-[40px] w-[40px]" />
          <p>You have no albums yet!</p>
        </div>
      );
    }
  

  return (
    <UserAlbumsScreen
      initialUser={user}
      initialAlbums={initialAlbums}
      initialLimit={LIMIT}
    />
  );
}
