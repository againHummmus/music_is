'use client'
import { Track } from "../shared/track/TrackItem";
import { ArrowButton } from "../shared/buttons/ArrowButton";
import { useStore } from "@/app/store";
import { useState, useEffect } from "react";
import StreamlineSleep from '~icons/streamline/sleep?width=48px&height=48px';
import PlaylistApi from "@/actions/playlistApi";

export function AddedByMeBlock() {
  const [loading, setLoading] = useState(true)
  const [playlist, setPlaylist] = useState<any>();
  const { user } = useStore();

      useEffect(() => {
          async function fetchPlaylist() {
              const pl = await PlaylistApi.searchPlaylists({ name: 'Added by me', isDefault: true, creatorId: user?.id})
                  .then(res => res[0]);
              setPlaylist(pl)
          }
          fetchPlaylist().then(() => setLoading(false));
      }, []);
      
  return (
    <div>
      <div className="font-bold text-[24px] text-mainBlack mb-[10px] main:mb-[15px]">
        Added by you:
      </div>
      {loading ? <div className="grid grid-cols-1 main:grid-cols-2 w-full gap-10 mb-[10px] main:mb-[15px]">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-[70px] bg-gray-300 animate-pulse rounded"
          ></div>
        ))}
      </div>

        : playlist?.Playlist_track.length > 0 ?
          <div className="grid gid-cols-1 main:grid-cols-2 w-full gap-10 mb-[10px] main:mb-[15px]">
            {playlist?.Playlist_track?.map((item: any, index: any) => (
              <Track key={index} info={item?.Track} playlist={playlist}/>
            ))}
          </div>
          : <div className='flex flex-col h-[230px] rounded-[7px] border border-mainOrange border-dashed items-center justify-center text-mainOrange'>
            <StreamlineSleep className='w-[40px] h-[40px]'/>
            <p>Nothing here yet!</p>
          </div>
      }
      <div className="w-full flex flex-row justify-end">
        {playlist?.Playlist_track.length > 0 && <ArrowButton title={"Go"} href={"/library/playlists/" + playlist?.id} color={"mainOrange"} maxWidth="100px" />}
      </div>
    </div>
  );
}
