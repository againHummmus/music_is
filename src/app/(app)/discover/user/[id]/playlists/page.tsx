import { getUser } from '@/actions/userApi';
import { searchUserPlaylists } from '@/actions/userPlaylistApi';
import { UserPlaylistsScreen } from '@/screens/user-playlists/UserPlaylistsScreen';
import { EmptyState } from '@/components/ui/EmptyState';

const LIMIT = 12;

export default async function Page({ params }: { params: { id: string } }) {
  const [user, userPlaylists] = await Promise.all([
    getUser({ id: String(params.id) }),
    searchUserPlaylists({
      userId: String(params.id),
      limit: LIMIT,
      offset: 0,
    }),
  ]);

  if (userPlaylists.length === 0) {
    return (
      <EmptyState>You have no playlists yet!</EmptyState>
    );
  }

  return (
    <UserPlaylistsScreen
      initialUser={user}
      initialUserPlaylistConnections={userPlaylists}
      initialLimit={LIMIT}
    />
  );
}
