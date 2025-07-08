'use client';
import Link from 'next/link';
import BiPlayCircle from '~icons/bi/play-circle?width=16px&height=16px';
import BiPauseCircle from '~icons/bi/pause-circle?width=16px&height=16px';
import { createImgUrl } from '../utils/createUrlFromHash';
import { useStore } from '@/app/store';

export function PlaylistItem({ info }: { info: any }) {
  const store = useStore();

  const firstTrack = info.Playlist_track?.[0]?.Track;

  const isThisPlaying = 
    store.currentPlaylist?.id === info.id && 
    store.isPlaying;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (isThisPlaying) {
      store.togglePlay();
    } else if (firstTrack) {
      store.setCurrentPlaylist(info);
      store.playTrack(firstTrack);
    }
  };

  return (
    <div
      className="relative w-full max-w-[680px] h-[70px] main:h-[90px] flex items-center justify-between bg-cover bg-center rounded-[7px] p-20
                 after:absolute after:content-'' after:w-full after:h-full after:top-0 after:left-0
                 after:bg-gradient-to-r from-mainBlack/95 to-mainBlack/20 after:transition-all after:opacity-90 after:hover:opacity-100 after:rounded-[7px]"
      style={{
        backgroundImage: `url(${
          info.Playlist_track?.[0]?.Track.Album.image_hash
            ? createImgUrl(info.Playlist_track[0].Track.Album.image_hash)
            : '/images/recordersBackground.png'
        })`,
      }}
    >
      <Link href={`/discover/playlists/${info.id}`} className="absolute cursor-pointer inset-0 z-[4000]" aria-label="Go to playlist">
      </Link>
      <div className="relative z-[1100] flex items-center gap-4 text-mainWhite">
        <button
          onClick={handlePlayClick}
          className="relative h-[50px] w-[50px] hover:text-mainOrange transition-all"
          aria-label="Play playlist"
        >
          {isThisPlaying ? <BiPauseCircle className="h-[50px] w-[50px] cursor-pointer transition-all" /> : <BiPlayCircle className="h-[50px] w-[50px] cursor-pointer transition-all" />}
        </button>

        <div className="flex flex-col justify-center h-[40px]">
          <div className="font-medium text-lg main:text-xl leading-none">
            {info.name}
          </div>
          {!info.is_default && (
            <div className="text-xs main:text-sm text-lightStormy">
              by {info.Creator?.username}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
