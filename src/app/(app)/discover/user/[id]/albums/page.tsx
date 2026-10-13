import { getUser } from '@/actions/userApi';
import { searchAlbums } from '@/actions/albumApi';
import { UserAlbumsScreen } from '@/screens/user-albums/UserAlbumsScreen';
import { EmptyState } from '@/components/ui/EmptyState';

const LIMIT = 8;

export default async function Page({ params }: { params: { id: string } }) {
  const user = await getUser({ id: String(params.id) });
  const artistId = user?.Artist?.id;

  const initialAlbums = artistId
    ? await searchAlbums({ artistId, limit: LIMIT, offset: 0 })
    : [];

    if (!initialAlbums || initialAlbums.length === 0) {
      return (
        <EmptyState>You have no albums yet!</EmptyState>
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
