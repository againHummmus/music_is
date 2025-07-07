'use client'
import { useCallback, useEffect, useState } from "react";
import { BaseButtonDark } from "../shared/buttons/BaseButtonDark";
import { useStore } from "@/app/store";
import SubscriptionApi from "@/actions/userSubscriptionApi";
import { PlaylistItem } from "../shared/playlist/PlaylistItem";

export function FriendsPlaylistsBlock() {
  const LIMIT = 20
  const currentUser = useStore(state => state.user)

  const [friends, setFriends] = useState<any[]>([])

  useEffect(() => {
    if (!currentUser) return
    let canceled = false

    SubscriptionApi.searchMutualFriends({
      userId: currentUser.id,
      limit: LIMIT,
      getPlaylists: true
    })
      .then((data: any[]) => {
        if (canceled) return
        setFriends(prev => [...prev, ...data])
      })
      .catch(console.error)
      .finally(() => {
      })

    return () => { canceled = true }
  }, [currentUser])

  return (
    <div className='group/pblock space-y-10 '>
      <div className="flex flex-col main:flex-row justify-between main:h-[150px] max-main:bg-[url('/images/friendsBannerBackground.png')] max-main:rounded-[7px] max-main:p-20 main:min-h-[170px] gap-[10px] mb-[10px] main:mb-[15px]">
        <div className="w-[55%] hidden main:block bg-[url('/images/friendsBannerBackground.png')] bg-center rounded-[7px] bg-cover bg-no-repeat h-full" />
        <div className="main:w-[45%] h-full flex flex-col max-main:flex-row justify-between items-end gap-[10px]">
          <div className="w-full h-full border-[2px] border-mainOrange rounded-xl p-10 flex justify-center items-center text-xl main:text-4xl text-mainBlack max-main:text-mainWhite font-semibold">
            Your friends' <br /> playlists
          </div>
        </div>
      </div>
      {friends.map((friend: any, index: number) => { // Добавляем index
        const borderColors = [
          'border-funnyGreen',
          'border-funnyRed',
          'border-funnyBlue',
          'border-funnyYellow',
        ];
        const borderColorClass = borderColors[index % borderColors.length]; // Вычисляем класс границы
        return (
          <div className='flex flex-col gap-10' key={friend.username}>
            <p className={`font-bold text-base border-[2px] ${borderColorClass} rounded-xl px-10 `}>
              {friend.username}
            </p>
            <div className="grid grid-cols-1 laptop:grid-cols-2 w-full gap-10">
              {friend?.User_playlist.filter((up: any) => up.Playlist?.is_public).map(
                (up: any) => <PlaylistItem key={up.Playlist.id} info={up.Playlist} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
