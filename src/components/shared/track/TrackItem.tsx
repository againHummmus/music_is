'use client'

import { useState } from 'react';
import SvgSpinnersGooeyBalls1 from '~icons/svg-spinners/gooey-balls-1?width=24px&height=24px';
import WeuiLikeFilled from '~icons/weui/like-filled?width=24px&height=24px';
import WeuiLikeOutlined from '~icons/weui/like-outlined?width=24px&height=24px';
import CharmMenuKebab from '~icons/charm/menu-kebab?width=16px&height=16px';

export function Track() {
    const [isLiked, setIsLiked] = useState(false);

    const toggleLike = () => {
        setIsLiked(!isLiked);
    };

    return (
        <div className="w-full max-w-[680px] h-[50px] main:h-[70px] flex flex-row justify-between items-center bg-white rounded-[7px] p-10">
            <div className="flex flex-row gap-[10px] items-center justify-start">
                <div className="bg-[url('/images/track.png')] aspect-square bg-cover bg-center bg-no-repeat flex items-center justify-center rounded-full object-cover h-[40px] w-[40px] main:h-[55px] main:w-[55px] cursor-pointer">
                    <SvgSpinnersGooeyBalls1 className="text-mainOrange w-[15px] main:w-[20px]"/>
                </div>
                <div className="h-[40px] flex flex-col justify-between">
                    <div className="font-medium text-sm main:text-base">
                        Angel
                    </div>
                    <div className="text-xs main:text-sm">
                        Massive attack
                    </div>
                </div>
            </div>

            <div className="flex flex-row gap-[10px] items-center">
                <div onClick={toggleLike} className="cursor-pointer">
                    {isLiked ? 
                        <WeuiLikeFilled className="text-mainOrange "/> : 
                        <WeuiLikeOutlined className="text-mainDark hover:text-mainOrange transition-all"/>
                    }
                </div>
                <CharmMenuKebab/>
            </div>
        </div>
    );
}