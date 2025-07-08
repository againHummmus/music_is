'use client'

import { PlaylistItem } from "../shared/playlist/PlaylistItem";
import { ArrowButton } from "../shared/buttons/ArrowButton";
import { useEffect, useState } from "react";
import { useStore } from "@/app/store";
import UserPlaylistApi from "@/actions/userPlaylistApi";
import StreamlineSleep from '~icons/streamline/sleep?width=48px&height=48px';


export function PlaylistsBlock() {
  const [userPlaylistConnections, setUserPlaylistConnections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useStore();


  useEffect(() => {
    (async () => {
      await UserPlaylistApi.searchUserPlaylists({ userId: user.id, limit: 6 }).then((res: any) => setUserPlaylistConnections(res.data));
    })().then(() => setLoading(false));
  }, [user])

  return (
    <div>
      <div className="font-bold text-[24px] text-mainDark mb-[10px] main:mb-[15px]">
        Your playlists:
      </div>
      {loading ? <div className="grid grid-cols-1 main:grid-cols-2 w-full gap-10 mb-[10px] main:mb-[15px]">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-[70px] bg-gray-300 animate-pulse rounded"
          ></div>
        ))}
      </div> : userPlaylistConnections.length > 0 ? (
        <div className="grid gid-cols-1 main:grid-cols-2 w-full gap-10 mb-[10px] main:mb-[15px]">
          {userPlaylistConnections?.slice(0, 6).map((item: any, index: any) => (
            <PlaylistItem key={index} info={item.Playlist} />
          ))}
        </div>
      ) : <div className='flex flex-col h-[230px] rounded-[7px] gap-20 border border-mainOrange border-dashed items-center justify-center text-mainOrange'>
        <StreamlineSleep className='w-[40px] h-[40px]' />
        <p>Nothing here yet!</p>
      </div>}
      <ArrowButton title={"Go"} href={"/discover/playlists"} color={"mainOrange"} maxWidth="100px" />
    </div>
  );
}
