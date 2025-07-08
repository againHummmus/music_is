'use client'
import { Track } from "../shared/track/TrackItem";
import { ArrowButton } from "../shared/buttons/ArrowButton";
import { useStore } from "@/app/store";
import { useState, useEffect } from "react";
import StreamlineSleep from '~icons/streamline/sleep?width=48px&height=48px';
import PlaylistApi from "@/actions/playlistApi";
import AlbumApi from "@/actions/albumApi";
import AlbumCard from "../album/AlbumItem";

export function AddedByMeBlock() {
  const [loadingTracks, setLoadingTracks] = useState(true)
  const [loadingAlbums, setLoadingAlbums] = useState(true)

  const [playlist, setPlaylist] = useState<any>();
  const [albums, setAlbums] = useState<any[]>([]);
  const { user } = useStore();

  useEffect(() => {
    async function fetchPlaylist() {
      const pl = await PlaylistApi.searchPlaylists({ name: 'Added by me', isDefault: true, creatorId: user?.id })
        .then(res => res[0]);
      setPlaylist(pl)
    }
    fetchPlaylist().then(() => setLoadingTracks(false));
  }, []);

  useEffect(() => {
    async function fetchAlbums() {
      const al = await AlbumApi.searchAlbums({ artistId: user.artistId }).then(res => res.data)
      setAlbums(al)
    }
    fetchAlbums().then(() => setLoadingAlbums(false));
  }, []);

  return (
    <div className='w-full '>
      <div className="max-main:w-full max-main:text-center font-bold text-[24px] text-mainBlack mb-[10px] main:mb-[15px]">
        Added by you:
      </div>
      {loadingTracks ? <div className="grid grid-cols-1 main:grid-cols-2 w-full gap-10 mb-[10px] main:mb-[15px]">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-[70px] bg-gray-300 animate-pulse rounded"
          ></div>
        ))}
      </div>
        : playlist?.Playlist_track.length > 0 ?
          <div className="grid grid-cols-1 main:grid-cols-[4fr,_1fr] w-full gap-10 mb-[10px] main:mb-[15px]">
            {playlist?.Playlist_track?.map((item: any, index: any) => (
              <>
                <Track key={index} info={item?.Track} playlist={playlist} />
                <div className='flex felx-row items-center justify-center gap-[10px]'>
                  <div className='flex items-center justify-center text-mainOrange whitespace-nowrap'>{item?.Track?.Track_like?.length} likes</div>
                  <div className='size-[3px] rounded-full bg-mainOrange' />
                  <div className='flex items-center justify-center text-mainOrange whitespace-nowrap'>in {item?.Track?.Playlist_track?.length} playlists</div>
                </div>
              </>
            ))}
          </div>
          : <div className='flex flex-col h-[230px] rounded-[7px] border gap-20 border-mainOrange border-dashed items-center justify-center text-mainOrange'>
            <StreamlineSleep className='w-[40px] h-[40px]' />
            <p>Nothing here yet!</p>
          </div>
      }
      {loadingAlbums ? <div className="grid grid-cols-1 main:grid-cols-2 w-full gap-10 mb-[10px] main:mb-[15px]">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-[70px] bg-gray-300 animate-pulse rounded"
          ></div>
        ))}
      </div>
        : albums?.length > 0 &&
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] w-full gap-10 mb-[10px] main:mb-[15px]">
            {albums?.map((item: any, index: any) => (
                <AlbumCard key={index} album={item} />
            ))}
          </div>
      }
      {playlist?.Playlist_track.length > 0 && <ArrowButton title={"Go"} href={"/discover/playlists/" + playlist?.id} color={"mainOrange"} maxWidth="100px" />}
    </div>
  );
}
