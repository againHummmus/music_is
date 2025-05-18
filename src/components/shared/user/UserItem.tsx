'use client'

import { useState } from 'react';
import HugeiconsLocationUser01 from '~icons/hugeicons/location-user-01?width=24px&height=24px';
import { createImgUrl } from '../utils/createUrlFromHash';
import Link from 'next/link';

export function User({ user }: { user: User }) {
    const [isSubscribed, setIsSubscribed] = useState(false);

    const toggleSubscription = () => {
        setIsSubscribed(!isSubscribed);
    };

    return (
        <div className="w-[240px] p-15 flex flex-col justify-end h-[250px] bg-no-repeat bg-cover bg-center relative rounded-[7px] border border-mainOrange after:absolute after:w-full after:h-full after:rounded-[7px] after:content-'' after:bg-gradient-to-t after:from-mainBlack after:opacity-90 hover:after:opacity-100 after:to-mainBlack/0 after:top-0 after:left-0 after:transition-all"
            style={{
                backgroundImage: user?.avatar_url
                    ? `url(${createImgUrl(user?.avatar_url)})`
                    : 'url("/images/placeholderAvatar.jpg")',
            }}>
                <Link href={'/discover/user/' + user?.id} className='absolute inset-0 z-[1000] cursor-pointer'></Link>
            <div className="relative z-[200] w-full flex flex-col gap-5 ">
                <div className="text-base font-semibold text-white">
                    {user?.username}
                </div>
                <div className="flex flex-row gap-5 justify-between">
                    <div onClick={() => toggleSubscription()} className={`min-w-[120px] h-[30px] px-[10px] flex items-center font-semibold justify-center transition-all cursor-pointer ${isSubscribed ? 'bg-lightStormy' : 'bg-mainOrange'} rounded-[7px] text-mainBlack`}>
                        {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
                    </div>
                    <div className="flex flex-row items-center text-lightStormy">
                        <HugeiconsLocationUser01 />
                        <div className="font-semibold">
                            300
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}