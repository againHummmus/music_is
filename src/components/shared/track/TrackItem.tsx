'use client'

import { useState, useEffect } from 'react'
import MagePauseFill from '~icons/mage/pause-fill?width=48px&height=48px'
import MagePlayFill from '~icons/mage/play-fill?width=48px&height=48px'
import WeuiLikeFilled from '~icons/weui/like-filled?width=24px&height=24px'
import WeuiLikeOutlined from '~icons/weui/like-outlined?width=24px&height=24px'
import CharmMenuKebab from '~icons/charm/menu-kebab?width=16px&height=16px'
import { useStore } from '@/app/store'
import TrackLikeApi from '@/actions/trackLikeApi'
import TrackApi from '@/actions/trackApi'
import { createImgUrl } from '../utils/createUrlFromHash'
import { TrackActions } from './TrackActions'

export function Track({ info, className, playlist }: { info: any, className?: string, playlist?: any}) {

  const store = useStore()

  const isTrackLiked = () =>
    !!info?.Track_like?.some((like: any) => like.userId === store.user.id)
  const [trackInfo, setTrackInfo] = useState({ ...info, isLiked: isTrackLiked() })

  const [menuOpen, setMenuOpen] = useState(false)
  const [deletedTrack, setDeletedTrack] = useState<number>()

  const handlePlay = () => {
    store.setCurrentPlaylist(playlist)
    if (store.currentTrack?.id === info?.id) {
      store.togglePlay()
    } else {
      store.playTrack(info)
    }
  }

  const toggleLike = async () => {
    const prev = trackInfo.isLiked
    setTrackInfo((t: any) => ({ ...t, isLiked: !t.isLiked }))
    try {
      if (!prev) {
        await TrackLikeApi.createTrackLike({
          userId: store.user.id,
          trackId: trackInfo.id,
        })
      } else {
        await TrackLikeApi.deleteTrackLike({
          userId: store.user.id,
          trackId: trackInfo.id,
        })
      }
      const resp = await TrackApi.searchTracks({ id: trackInfo.id })
      const updated = resp.data[0]
      setTrackInfo({
        ...updated,
        isLiked: updated.Track_like.some((l: any) => l.userId === store.user.id),
      })
    } catch (e) {
      console.error(e)
      setTrackInfo((t: any) => ({ ...t, isLiked: prev }))
    }
  }

  const handleKebabClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setMenuOpen(!menuOpen);
    store.setChosenTrack(trackInfo)
  }

  const handleClickOutside = (e: any) => {
    if (!(e.target as Element).closest(`#${store.chosenTrack?.id}track`)) {
      setMenuOpen(false);
      store.setChosenTrack(undefined)
    }
  };

  useEffect(() => {
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className={`${deletedTrack === trackInfo.id ? 'opacity-20' : 'opacity-100'} relative h-[50px] main:h-[70px] max-main:min-w-[200px] flex justify-between items-center bg-white rounded-[7px] gap-10 p-10 transition-all ${className}`}>
      <div className="flex items-center gap-[10px]">
        <div
          onClick={handlePlay}
          className="relative group aspect-square rounded-full h-[40px] w-[40px] main:h-[55px] main:w-[55px] cursor-pointer bg-cover bg-center"
          style={{
            backgroundImage: trackInfo.Album?.image_hash
              ? `url(${createImgUrl(trackInfo.Album.image_hash)})`
              : 'none',
          }}
        >
          {store.currentTrack?.id === info?.id && store.isPlaying ? (
            <MagePauseFill className="absolute inset-0 m-auto text-mainOrange w-[20px] h-[20px] group-hover:scale-[120%] transition-all" />
          ) : (
            <MagePlayFill className="absolute inset-0 m-auto text-mainOrange w-[20px] h-[20px] group-hover:scale-[120%] transition-all" />
          )}
        </div>
        <div className="flex flex-col justify-between h-[40px]">
          <div className="font-medium text-sm main:text-base line-clamp-1 min-h-[24px]">{trackInfo.name}</div>
          <div className="text-xs main:text-sm">{trackInfo.Artist?.name}</div>
        </div>
      </div>

      <div className="flex items-center gap-[10px]">
        <div onClick={toggleLike} className="cursor-pointer">
          {trackInfo.isLiked ? (
            <WeuiLikeFilled className="text-mainOrange" />
          ) : (
            <WeuiLikeOutlined className="text-mainDark hover:text-mainOrange transition-all" />
          )}
        </div>

        <div className="relative">
          <div onClick={handleKebabClick} className="cursor-pointer">
            <CharmMenuKebab />
          </div>

          {menuOpen && (store.chosenTrack?.id === trackInfo?.id) && (
            <div id={`${trackInfo.id}-track`} className="absolute z-[5000] top-full right-0 mt-2 bg-white border border-darkStormy shadow-md rounded p-2 min-w-[200px]">
              <TrackActions setMenuOpen={setMenuOpen} setDeletedTrack={setDeletedTrack}/>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
