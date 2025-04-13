'use client'

import { useState } from 'react';
import MagePauseFill from '~icons/mage/pause-fill?width=48px&height=48px';
import MagePlayFill from '~icons/mage/play-fill?width=48px&height=48px';
import WeuiLikeFilled from '~icons/weui/like-filled?width=24px&height=24px';
import WeuiLikeOutlined from '~icons/weui/like-outlined?width=24px&height=24px';
import CharmMenuKebab from '~icons/charm/menu-kebab?width=16px&height=16px';
import TrackLikeApi from '@/actions/trackLikeApi';
import TrackApi from '@/actions/trackApi';
import { useStore } from '@/app/store';
import { createImgUrl } from '../utils/createUrlFromHash';




export function Track({ info }: { info: any }) {
    const store = useStore();
    const isTrackLiked = (info: any) => {
        return info?.Track_like?.some((like: any) => like.userId === store.user.id);
    }
    const [trackInfo, setTrackInfo] = useState({ ...info, isLiked: isTrackLiked(info) });
    
    const handlePlay = () => {
        if (store.currentTrack?.id === info.id) {
            store.togglePlay();
        } else {
            store.playTrack(info);
        }
      };   
      
      const toggleLike = async () => {
        const previousLiked = trackInfo.isLiked;
        setTrackInfo((prev: any) => ({ ...prev, isLiked: !prev.isLiked }));

        try {
            if (!previousLiked) {
                await TrackLikeApi.createTrackLike({
                    userId: store.user.id,
                    trackId: trackInfo.id,
                });
            } else {
                await TrackLikeApi.deleteTrackLike({
                    userId: store.user.id,
                    trackId: trackInfo.id,
                });
            }
            const response = await TrackApi.searchTracks({ id: trackInfo.id });
            const updatedTrack = response.data[0];

            const updatedIsLiked = updatedTrack?.Track_like?.some(
                (like: any) => like.userId === store.user.id
            );

            setTrackInfo({ ...updatedTrack, isLiked: updatedIsLiked });
        } catch (error) {
            console.error("Ошибка при изменении лайка:", error);
            setTrackInfo((prev: any) => ({ ...prev, isLiked: previousLiked }));
        }
    };

    return (
        <div className="w-full max-w-[680px] h-[50px] main:h-[70px] flex flex-row justify-between items-center bg-white rounded-[7px] p-10">
            <div className="flex flex-row gap-[10px] items-center justify-start">
                <div
                    className={`aspect-square bg-cover bg-center bg-no-repeat flex items-center justify-center rounded-full object-cover h-[40px] w-[40px] main:h-[55px] main:w-[55px] cursor-pointer`}
                    style={{
                        backgroundImage: trackInfo?.Album?.image_hash
                            ? `url(${createImgUrl(trackInfo?.Album?.image_hash)})`
                            : 'none',
                    }}
                >
                    <div
                        onClick={handlePlay}
                        className="aspect-square bg-cover bg-center bg-no-repeat flex items-center justify-center rounded-full object-cover h-[40px] w-[40px] main:h-[55px] main:w-[55px] cursor-pointer"
                        style={{
                            backgroundImage: info?.Album?.image_hash
                                ? `url(${createImgUrl(info?.Album?.image_hash)})`
                                : 'none'
                        }}
                    >
                        {store.currentTrack?.id === info?.id && store.isPlaying ? <MagePauseFill className="text-mainOrange w-[15px] main:w-[20px]" /> : <MagePlayFill className="text-mainOrange w-[15px] main:w-[20px]" />}
                    </div>

                </div>
                <div className="h-[40px] flex flex-col justify-between">
                    <div className="font-medium text-sm main:text-base">
                        {trackInfo?.name}
                    </div>
                    <div className="text-xs main:text-sm">
                        {trackInfo?.Artist?.name}
                    </div>
                </div>
            </div>

            <div className="flex flex-row gap-[10px] items-center">
                <div onClick={toggleLike} className="cursor-pointer">
                    {trackInfo.isLiked ? (
                        <WeuiLikeFilled className="text-mainOrange" />
                    ) : (
                        <WeuiLikeOutlined className="text-mainDark hover:text-mainOrange transition-all" />
                    )}
                </div>
                <CharmMenuKebab />
            </div>
        </div>
    );
}