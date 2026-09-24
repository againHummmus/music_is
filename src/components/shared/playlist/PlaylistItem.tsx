'use client';
import Link from 'next/link';
import BiPlayCircle from '~icons/bi/play-circle?width=16px&height=16px';
import BiPauseCircle from '~icons/bi/pause-circle?width=16px&height=16px';
import { createImgUrl } from '../utils/createUrlFromHash';
import { usePlayerStore } from '@/stores/playerStore';
import type { PlaylistRow } from '@/actions/types';

export function PlaylistItem({ info }: { info: PlaylistRow }) {
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const currentPlaylistId = usePlayerStore((s) => s.currentPlaylist?.id);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const setCurrentPlaylist = usePlayerStore((s) => s.setCurrentPlaylist);
  const playTrack = usePlayerStore((s) => s.playTrack);

  const firstTrack = info.Playlist_track?.[0]?.Track;

  const isThisPlaying = currentPlaylistId === info.id && isPlaying;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (isThisPlaying) {
      togglePlay();
    } else if (firstTrack) {
      setCurrentPlaylist(info);
      playTrack(firstTrack);
    }
  };

  return (
    <div
      className="after:content-'' relative flex h-[70px] w-full max-w-[680px] items-center justify-between rounded-[7px] from-mainBlack/95 to-mainBlack/20 bg-cover bg-center p-20 after:absolute after:left-0 after:top-0 after:h-full after:w-full after:rounded-[7px] after:bg-gradient-to-r after:opacity-90 after:transition-all after:hover:opacity-100 main:h-[90px]"
      style={{
        backgroundImage: `url(${
          info.Playlist_track?.[0]?.Track?.Album?.image_hash
            ? createImgUrl(info.Playlist_track[0]!.Track!.Album!.image_hash)
            : '/images/recordersBackground.png'
        })`,
      }}
    >
      <Link
        href={`/discover/playlists/${info.id}`}
        className="absolute inset-0 z-[4000] cursor-pointer"
        aria-label="Go to playlist"
      ></Link>
      <div className="relative z-[1100] flex items-center gap-4 text-mainWhite">
        <button
          onClick={handlePlayClick}
          className="relative h-[50px] w-[50px] transition-all hover:text-mainOrange"
          aria-label="Play playlist"
        >
          {isThisPlaying ? (
            <BiPauseCircle className="h-[50px] w-[50px] cursor-pointer transition-all" />
          ) : (
            <BiPlayCircle className="h-[50px] w-[50px] cursor-pointer transition-all" />
          )}
        </button>

        <div className="flex h-[40px] flex-col justify-center">
          <div className="text-lg font-medium leading-none main:text-xl">
            {info.name}
          </div>
          {!info.is_default && (
            <div className="text-xs text-lightStormy main:text-sm">
              by {info.Creator?.username}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
