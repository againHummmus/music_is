import { getCurrentUser } from '@/actions/session';
import { searchUserPlaylists } from '@/actions/userPlaylistApi';
import { PlaylistsScreen } from '@/screens/playlists/PlaylistsScreen';

export default async function Page({
  searchParams,
}: {
  searchParams: { new?: string };
}) {
  const user = await getCurrentUser();

  const initialPlaylists = user?.id
    ? await searchUserPlaylists({ userId: String(user.id), limit: 6 })
    : [];

  return (
    <PlaylistsScreen
      initialUser={user}
      initialPlaylists={initialPlaylists}
      openCreateForm={searchParams.new === '1'}
    />
  );
}
