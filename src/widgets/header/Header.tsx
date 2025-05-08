'use client'

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import HugeiconsSearch01 from '~icons/hugeicons/search-01';
import Image from "next/image";
import logo from '@public/images/logoDark.png';
import placeholderAvatar from '@public/images/placeholderAvatar.png';
import TrackSuggestionInput from "@/components/shared/utils/ui/TrackSuggestionsInput";

export default function Header() {
    const [showSearch, setShowSearch] = useState(false);
    const router = useRouter();

    const handleSelectTrack = (track: { id: string; name?: string }) => {
        router.push(`/track/${track.id}`);
    };


    return (
        <header
            id="header"
            className="w-full fixed px-[15px] z-[1000] left-0 top-0 min-h-[40px] main:h-[65px] flex flex-col bg-mainWhite/80 backdrop-blur-sm justify-center border-b border-lightStormy"
        >
            <div className="container main:p-[20px] flex flex-row justify-between items-center">
                <Image
                    src={logo}
                    width={200}
                    height={40}
                    alt="logo"
                    className="object-contain h-[25px] w-[90px]"
                />


                <TrackSuggestionInput
                    placeholder="Search tracks..."
                    onSelect={handleSelectTrack}
                    className="w-full max-w-[500px] search-input flex-row gap-10 items-center hidden main:flex "
                />

                <div className='flex flex-row items-center gap-10'>
                    <HugeiconsSearch01
                        onClick={() => setShowSearch((s) => !s)}
                        className="text-mainOrange cursor-pointer flex main:hidden"
                        width={20}
                        height={20}
                    />
                    <Image
                        src={placeholderAvatar}
                        width={40}
                        height={40}
                        alt="avatar"
                        className="rounded-full object-cover my-auto aspect-square h-[30px] w-[30px] main:h-[40px] main:w-[40px] cursor-pointer"
                    />
                </div>

            </div>
            <div className='w-full px-[10px]'>
                <TrackSuggestionInput
                    placeholder="Search tracks..."
                    onSelect={handleSelectTrack}
                    className={`${showSearch ? 'max-main:max-h-screen' : 'max-main:max-h-[0vh]'} w-full search-input h-screen min-h-0 transition-all duration-[500ms] overflow-hidden main:hidden`}
                />
            </div>
        </header>
    );
}
