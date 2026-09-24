import { getCurrentUser } from '@/actions/session';
import { searchUserPlaylists } from '@/actions/userPlaylistApi';
import PlaylistsScreen from './Screen';
export default async function Page() {
  const user = await getCurrentUser();

  let initialPlaylists: any[] = [];
  if (user?.id) {
    const { data } = await searchUserPlaylists({
      userId: String(user.id),
      limit: 6,
    });
    initialPlaylists = data ?? [];
  }

  return <PlaylistsScreen initialUser={user} initialPlaylists={initialPlaylists} />;
}
