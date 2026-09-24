'use client';
import { useCallback, useEffect, useState } from 'react';
import { BaseButtonDark } from '../shared/buttons/BaseButtonDark';
import { useStore } from '@/app/store';
import { searchMutualFriends } from '@/actions/userSubscriptionApi';
import type { MutualFriendRow } from '@/actions/types';
import { PlaylistItem } from '../shared/playlist/PlaylistItem';

export function FriendsPlaylistsBlock() {
  const LIMIT = 20;
  const currentUser = useStore((state) => state.user);

  const [friends, setFriends] = useState<MutualFriendRow[]>([]);

  useEffect(() => {
    if (!currentUser) return;
    let canceled = false;

    searchMutualFriends({
      limit: LIMIT,
      getPlaylists: true,
    })
      .then((data) => {
        if (canceled) return;
        setFriends((prev) => [...prev, ...data]);
      })
      .catch(console.error)
      .finally(() => {});

    return () => {
      canceled = true;
    };
  }, [currentUser]);

  if (friends.length <= 0) return null;

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
      {friends.map((friend, index) => {
        const borderColors = [
          'border-funnyGreen',
          'border-funnyRed',
          'border-funnyBlue',
          'border-funnyYellow',
        ];
        const borderColorClass = borderColors[index % borderColors.length];
        return (
          <div className="flex flex-col gap-10" key={friend.username}>
            <p
              className={`border-[2px] text-base font-bold ${borderColorClass} rounded-xl px-10`}
            >
              {friend.username}
            </p>
            <div className="grid w-full grid-cols-1 gap-10 laptop:grid-cols-2">
              {friend?.User_playlist?.filter(
                (up) => up.Playlist?.is_public
              ).map(
                (up) =>
                  up.Playlist && (
                    <PlaylistItem key={up.Playlist.id} info={up.Playlist} />
                  )
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
