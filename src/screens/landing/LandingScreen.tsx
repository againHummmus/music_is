'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/stores/authStore';
import { FrequencyGrid } from './FrequencyGrid';

export function LandingScreen({ initialAuth }: { initialAuth: boolean }) {
  // Keep reacting to client-side auth changes (e.g. sign-out on this page).
  const storeIsAuth = useAuthStore((s) => s.isAuth);
  const isAuth = initialAuth || storeIsAuth;

  return (
    <div className="relative h-screen w-full overflow-hidden bg-mainBlack">
      <FrequencyGrid className="absolute inset-0" />

      <div className="absolute inset-0 bg-black bg-opacity-70 max-desktop:h-[45%] desktop:w-[45%]">
        <div className="relative z-10 flex h-full flex-col justify-center gap-10 p-[30px] desktop:px-[60px]">
          <Image
            src={'/images/logoLight.png'}
            width={400}
            height={200}
            alt="logo"
            className="mx-auto"
          />
          <p className="mx-auto text-center text-xl font-medium leading-tight text-white">
            Find your musical soulmate
          </p>
          <div className="mx-auto mt-4 flex flex-col gap-2 text-white">
            {!isAuth ? (
              <div className="flex flex-col items-center gap-2">
                <Link
                  href="/auth?mode=signUp"
                  className="w-[200px] rounded-[7px] bg-mainOrange px-5 py-3 text-center font-bold text-mainBlack transition-all hover:text-white">
                  sign up
                </Link>
                <Link
                  className="text-lg text-mainOrange"
                  href="/auth?mode=signIn">
                  or{' '}
                  <span className="underline transition-all hover:text-white">
                    sign in
                  </span>
                </Link>
              </div>
            ) : (
              <Link
                href="/home"
                className="w-[200px] rounded-[7px] bg-mainOrange px-5 py-3 text-center font-bold text-mainBlack transition-all hover:text-white">
                Explore
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
