'use client'

import Link from 'next/link';
import { useState } from 'react';
import HugeiconsLocationUser01 from '~icons/hugeicons/location-user-01?width=24px&height=24px';

export function User() {
    const [isSubscribed, setIsSubscribed] = useState(false);

    const toggleSubscription = () => {
        setIsSubscribed(!isSubscribed);
    };

    return (
        <div className="w-[310px] tablet:w-[250px] p-15 flex flex-col justify-end h-[250px] bg-no-repeat bg-cover bg-center relative bg-[url('/images/Dave.png')] rounded-[7px] border border-mainOrange after:absolute after:w-full after:h-full after:rounded-[7px] after:content-'' after:bg-gradient-to-t after:from-mainBlack after:to-mainBlack/0 after:top-0 after:left-0">
            <div className="relative z-[200] w-full flex flex-col gap-5 ">
                <div className="text-base font-semibold text-white">
                    Dave Grohl
                </div>
                <div className="flex flex-row gap-5 justify-between">
                    <div onClick={() => toggleSubscription()} className={`h-[30px] px-[10px] flex items-center font-semibold justify-center transition-all cursor-pointer ${isSubscribed ? 'bg-lightStormy' : 'bg-mainOrange'} rounded-[7px] text-mainBlack`}>
                        {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
                    </div>
                    <div className="flex flex-row items-center text-lightStormy">
                        <HugeiconsLocationUser01/>
                        <div className="font-semibold">
                            300
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    );
}