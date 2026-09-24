'use client';

import { useState, useEffect } from 'react';
import MagePauseFill from '~icons/mage/pause-fill?width=48px&height=48px';
import MagePlayFill from '~icons/mage/play-fill?width=48px&height=48px';
import WeuiLikeFilled from '~icons/weui/like-filled?width=24px&height=24px';
import WeuiLikeOutlined from '~icons/weui/like-outlined?width=24px&height=24px';
import CharmMenuKebab from '~icons/charm/menu-kebab?width=16px&height=16px';
import { useAuthStore } from '@/stores/authStore';
import { usePlayerStore } from '@/stores/playerStore';
import { useUiStore } from '@/stores/uiStore';
import { createTrackLike, deleteTrackLike } from '@/actions/trackLikeApi';
import { searchTracks } from '@/actions/trackApi';
import type { TrackRow } from '@/actions/types';
import type { PlaylistRow } from '@/actions/types';
import { createImgUrl } from '../utils/createUrlFromHash';
import { TrackActions } from './TrackActions';

type TrackInfo = TrackRow & { isLiked: boolean };

export function Track({
  info,
  className,
  playlist,
}: {
  info: TrackRow;
  className?: string;
  playlist?: PlaylistRow;
}) {
  const userId = useAuthStore((s) => s.user?.id);
  const currentTrackId = usePlayerStore((s) => s.currentTrack?.id);
  const chosenTrackId = useUiStore((s) => s.chosenTrack?.id);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const playTrack = usePlayerStore((s) => s.playTrack);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const setCurrentPlaylist = usePlayerStore((s) => s.setCurrentPlaylist);
  const setChosenTrack = useUiStore((s) => s.setChosenTrack);

  const isTrackLiked = () =>
    !!info?.Track_like?.some((like) => like.userId === userId);
  const [trackInfo, setTrackInfo] = useState<TrackInfo>({
    ...info,
    isLiked: isTrackLiked(),
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const [deletedTrack, setDeletedTrack] = useState<number>();

  const handlePlay = () => {
    if (playlist) setCurrentPlaylist(playlist);
    if (currentTrackId === info?.id) {
      togglePlay();
    } else {
      playTrack(info);
    }
  };

  const toggleLike = async () => {
    const prev = trackInfo.isLiked;
    setTrackInfo((t) => ({ ...t, isLiked: !t.isLiked }));
    try {
      if (!prev) {
        await createTrackLike({
          trackId: trackInfo.id,
        });
      } else {
        await deleteTrackLike({
          trackId: trackInfo.id,
        });
      }
      const resp = await searchTracks({ id: String(trackInfo.id) });
      const updated = resp.data[0];
      if (updated) {
        setTrackInfo({
          ...updated,
          isLiked: updated.Track_like.some((l) => l.userId === userId),
        } as TrackInfo);
      }
    } catch (e) {
      console.error(e);
      setTrackInfo((t) => ({ ...t, isLiked: prev }));
    }
  };

  const handleKebabClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
    setChosenTrack(trackInfo);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (!(e.target as Element).closest(`#${chosenTrackId}track`)) {
      setMenuOpen(false);
      setChosenTrack(undefined);
    }
  };

  useEffect(() => {
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`${deletedTrack === trackInfo.id ? 'opacity-20' : 'opacity-100'} relative flex h-[50px] min-w-[200px] items-center justify-between gap-10 rounded-[7px] bg-white p-10 transition-all main:h-[70px] main:min-w-[300px] ${className}`}
    >
      <div className="flex items-center gap-[10px]">
        <div
          onClick={handlePlay}
          className="group relative aspect-square h-[40px] w-[40px] cursor-pointer rounded-full bg-cover bg-center main:h-[55px] main:w-[55px]"
          style={{
            backgroundImage: trackInfo.Album?.image_hash
              ? `url(${createImgUrl(trackInfo.Album.image_hash)})`
              : 'none',
          }}
        >
          {currentTrackId === info?.id && isPlaying ? (
            <MagePauseFill className="absolute inset-0 m-auto h-[20px] w-[20px] text-mainOrange transition-all group-hover:scale-[120%]" />
          ) : (
            <MagePlayFill className="absolute inset-0 m-auto h-[20px] w-[20px] text-mainOrange transition-all group-hover:scale-[120%]" />
          )}
        </div>
        <div className="flex h-[40px] flex-col justify-between">
          <div className="line-clamp-1 min-h-[24px] text-sm font-medium main:text-base">
            {trackInfo.name}
          </div>
          <div className="text-xs main:text-sm">{trackInfo.Artist?.name}</div>
        </div>
      </div>

      <div className="flex items-center gap-[10px]">
        <div onClick={toggleLike} className="cursor-pointer">
          {trackInfo.isLiked ? (
            <WeuiLikeFilled className="text-mainOrange" />
          ) : (
            <WeuiLikeOutlined className="text-mainDark transition-all hover:text-mainOrange" />
          )}
        </div>

        <div className="relative">
          <div onClick={handleKebabClick} className="cursor-pointer">
            <CharmMenuKebab />
          </div>

          {menuOpen && chosenTrackId === trackInfo?.id && (
            <div
              id={`${trackInfo.id}-track`}
              className="absolute right-0 top-full z-[5000] mt-2 min-w-[200px] rounded border border-darkStormy bg-white p-2 shadow-md"
            >
              <TrackActions
                setMenuOpen={setMenuOpen}
                setDeletedTrack={setDeletedTrack}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
