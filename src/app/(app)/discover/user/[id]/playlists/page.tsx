import { getUser } from '@/actions/userApi';
import { searchUserPlaylists } from '@/actions/userPlaylistApi';
import UserPlaylistsScreen from './Screen';
import StreamlineSleep from '~icons/streamline/sleep?width=48px&height=48px';

const LIMIT = 12;

export default async function Page({ params }: { params: any }) {
  const [user, userPlaylistsResult] = await Promise.all([
    getUser({ id: String(params.id) }),
    searchUserPlaylists({
      userId: String(params.id),
      limit: LIMIT,
      offset: 0,
    }),
  ]);

  if (!userPlaylistsResult.data || userPlaylistsResult.data.length === 0) {
    return (
      <div className="flex h-[230px] flex-col items-center justify-center gap-20 rounded-[7px] border border-dashed border-mainOrange text-mainOrange">
        <StreamlineSleep className="h-[40px] w-[40px]" />
        <p>You have no playlists yet!</p>
      </div>
    );
  }

  return (
    <UserPlaylistsScreen
      initialUser={user}
      initialUserPlaylistConnections={userPlaylistsResult.data ?? []}
      initialLimit={LIMIT}
    />
  );
}
