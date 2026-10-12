import { getCurrentUser } from '@/actions/session';
import { searchMutualFriends } from '@/actions/userSubscriptionApi';
import type { MutualFriendRow } from '@/actions/types';
import { PlaylistItem } from '@/components/playlist/PlaylistItem';

const LIMIT = 20;

export async function FriendsPlaylistsBlock() {
  const user = await getCurrentUser();
  if (!user) return null;

  const friends = await searchMutualFriends({
    limit: LIMIT,
    getPlaylists: true,
  }).catch((): MutualFriendRow[] => []);

  const friendsWithPlaylists = friends.flatMap((friend) => {
    const playlists = friend.User_playlist.flatMap((up) =>
      up.Playlist?.is_public ? [up.Playlist] : []
    );
    return playlists.length > 0 ? [{ friend, playlists }] : [];
  });

  if (friendsWithPlaylists.length === 0) return null;

  return (
    <div className="group/pblock space-y-10">
      <div className="mb-[10px] flex flex-col justify-between gap-[10px] max-main:rounded-[7px] max-main:bg-[url('/images/friendsBannerBackground.png')] max-main:p-20 main:mb-[15px] main:h-[150px] main:min-h-[170px] main:flex-row">
        <div className="hidden h-full w-[55%] rounded-[7px] bg-[url('/images/friendsBannerBackground.png')] bg-cover bg-center bg-no-repeat main:block" />
        <div className="flex h-full flex-col items-end justify-between gap-[10px] max-main:flex-row main:w-[45%]">
          <div className="flex h-full w-full items-center justify-center rounded-xl border-[2px] border-mainOrange p-10 text-xl font-semibold text-mainBlack max-main:text-mainWhite main:text-4xl">
            Your friends&apos; <br /> playlists
          </div>
        </div>
      </div>
      {friendsWithPlaylists.map(({ friend, playlists }, index) => {
        const borderColors = [
          'border-funnyGreen',
          'border-funnyRed',
          'border-funnyBlue',
          'border-funnyYellow',
        ];
        const borderColorClass = borderColors[index % borderColors.length];
        return (
          <div className="flex flex-col gap-10" key={friend.id}>
            <p
              className={`border-[2px] text-base font-bold ${borderColorClass} rounded-xl px-10`}
            >
              {friend.username}
            </p>
            <div className="grid w-full grid-cols-1 gap-10 laptop:grid-cols-2">
              {playlists.map((playlist) => (
                <PlaylistItem key={playlist.id} info={playlist} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
