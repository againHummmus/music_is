'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import HugeiconsSearch01 from '~icons/hugeicons/search-01';
import Image from 'next/image';
import logo from '@public/images/logoDark.png';
import placeholderAvatar from '@public/images/placeholderAvatar.png';
import TrackSuggestionInput from '@/components/shared/utils/ui/TrackSuggestionsInput';
import { useStore } from '@/app/store';
import { createImgUrl } from '@/components/shared/utils/createUrlFromHash';
import Link from 'next/link';
import HugeiconsUser from '~icons/hugeicons/user?width=48px&height=48px';
import HugeiconsSettings02 from '~icons/hugeicons/settings-02?width=24px&height=24px';

export default function Header() {
  const store = useStore();
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleSelectTrack = (track: {
    id: string | number;
    name?: string | null;
  }) => {
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
      className="sticky left-0 top-0 z-[7000] flex min-h-[40px] w-full flex-col justify-center border-b border-lightStormy bg-mainWhite/80 px-[15px] backdrop-blur-sm main:h-[65px]"
    >
      <div className="container flex flex-row items-center justify-between main:p-[20px]">
        <Image
          src={logo}
          width={200}
          height={40}
          alt="logo"
          className="h-[25px] w-[90px] object-contain"
        />

        {store.isAuth && (
          <TrackSuggestionInput
            placeholder="Search tracks..."
            onSelect={handleSelectTrack}
            isSearchUp={true}
            className="search-input hidden w-full max-w-[500px] flex-row items-center gap-10 main:flex"
          />
        )}

        {store.isAuth && (
          <div className="relative flex flex-row items-center gap-10">
            <Link href={'/search'}>
              <HugeiconsSearch01
                className="flex cursor-pointer text-mainOrange main:hidden"
                width={20}
                height={20}
              />
            </Link>
            <div ref={menuRef} className="relative">
              <Image
                src={
                  (store.user?.avatar_url &&
                    createImgUrl(store.user?.avatar_url)) ||
                  placeholderAvatar
                }
                width={200}
                height={200}
                alt="avatar"
                onClick={() => setShowMenu((prev) => !prev)}
                className="my-auto aspect-square h-[30px] w-[30px] cursor-pointer rounded-full object-cover outline outline-1 outline-offset-[3px] outline-mainOrange/0 transition-all hover:outline-mainOrange main:h-[40px] main:w-[40px]"
              />
              <div
                className={`absolute right-0 z-50 mt-2 rounded border border-mainOrange bg-white transition-all ${showMenu ? 'visible opacity-100' : 'invisible opacity-0'} transition-all duration-300`}
              >
                <Link
                  href={`/discover/user/${store.user?.id}`}
                  onClick={() => setShowMenu(false)}
                  className="flex flex-row items-center px-4 py-2 text-mainOrange hover:text-mainOrange/80"
                >
                  <HugeiconsUser className="mr-2 h-[20px] w-[20px]" />
                  <p className="text-sm">Profile</p>
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setShowMenu(false)}
                  className="flex flex-row items-center px-4 py-2 text-mainOrange hover:text-mainOrange/80"
                >
                  <HugeiconsSettings02 className="mr-2 h-[20px] w-[20px]" />
                  <p className="text-sm">Settings</p>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {store.isAuth && (
        <div className="w-full px-[10px]">
          <TrackSuggestionInput
            placeholder="Search tracks..."
            onSelect={handleSelectTrack}
            className={`${showSearch ? 'max-main:max-h-screen' : 'max-main:max-h-[0vh]'} search-input h-screen min-h-0 w-full overflow-hidden transition-all duration-[500ms] main:hidden`}
          />
        </div>
      )}
    </header>
  );
}
