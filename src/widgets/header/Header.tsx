'use client'

import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import HugeiconsSearch01 from '~icons/hugeicons/search-01';
import Image from "next/image";
import logo from '@public/images/logoDark.png';
import placeholderAvatar from '@public/images/placeholderAvatar.png';
import TrackSuggestionInput from "@/components/shared/utils/ui/TrackSuggestionsInput";
import { useStore } from "@/app/store";
import { createImgUrl } from "@/components/shared/utils/createUrlFromHash";
import Link from "next/link";
import HugeiconsUser from '~icons/hugeicons/user?width=48px&height=48px';
import HugeiconsSettings02 from "~icons/hugeicons/settings-02?width=24px&height=24px";

export default function Header() {
    const store = useStore();
    const [showSearch, setShowSearch] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const handleSelectTrack = (track: { id: string; name?: string }) => {
        router.push(`/track/${track.id}`);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header
            id="header"
            className="w-full fixed px-[15px] z-[7000] left-0 top-0 min-h-[40px] main:h-[65px] flex flex-col bg-mainWhite/80 backdrop-blur-sm justify-center border-b border-lightStormy"
        >
            <div className="container main:p-[20px] flex flex-row justify-between items-center">
                <Image
                    src={logo}
                    width={200}
                    height={40}
                    alt="logo"
                    className="object-contain h-[25px] w-[90px]"
                />

                {store.isAuth && (
                    <TrackSuggestionInput
                        placeholder="Search tracks..."
                        onSelect={handleSelectTrack}
                        className="w-full max-w-[500px] search-input flex-row gap-10 items-center hidden main:flex"
                    />
                )}

                {store.isAuth && (
                    <div className='flex flex-row items-center gap-10 relative'>
                        <Link
                            href={"/search"}
                        >
                            <HugeiconsSearch01 className="text-mainOrange cursor-pointer flex main:hidden"
                                width={20}
                                height={20} />
                        </Link>
                        <div ref={menuRef} className="relative">
                            <Image
                                src={store.user?.avatar_url && createImgUrl(store.user?.avatar_url) || placeholderAvatar}
                                width={200}
                                height={200}
                                alt="avatar"
                                onClick={() => setShowMenu((prev) => !prev)}
                                className="rounded-full object-cover outline outline-1 outline-offset-[3px] outline-mainOrange/0 hover:outline-mainOrange transition-all my-auto aspect-square h-[30px] w-[30px] main:h-[40px] main:w-[40px] cursor-pointer"
                            />
                                <div className={`absolute right-0 mt-2 bg-white rounded border border-mainOrange z-50 transition-all ${showMenu ? 'opacity-100 visible' : 'opacity-0 invisible'} transition-all duration-300`}>
                                    <Link
                                        href={`/discover/user/${store.user?.id}`}
                                        onClick={() => setShowMenu(false)}
                                        className="flex flex-row items-center px-4 py-2 text-mainOrange hover:text-mainOrange/80"
                                    >
                                        <HugeiconsUser className="w-[20px] h-[20px] mr-2" />
                                        <p className='text-sm'>Profile</p>
                                    </Link>
                                    <Link
                                        href="/settings"
                                        onClick={() => setShowMenu(false)}
                                        className="flex flex-row items-center px-4 py-2 text-mainOrange hover:text-mainOrange/80"
                                    >
                                        <HugeiconsSettings02 className="w-[20px] h-[20px] mr-2" />
                                        <p className='text-sm'>Settings</p>
                                    </Link>
                                </div>
                        </div>
                    </div>
                )}
            </div>

            {store.isAuth && (
                <div className='w-full px-[10px]'>
                    <TrackSuggestionInput
                        placeholder="Search tracks..."
                        onSelect={handleSelectTrack}
                        className={`${showSearch ? 'max-main:max-h-screen' : 'max-main:max-h-[0vh]'} w-full search-input h-screen min-h-0 transition-all duration-[500ms] overflow-hidden main:hidden`}
                    />
                </div>
            )}
        </header>
    );
}
