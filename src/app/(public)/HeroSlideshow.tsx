'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/stores/authStore';

const IMAGES = [
  '/images/for-hero/1.png',
  '/images/for-hero/2.png',
  '/images/for-hero/3.png',
];

const MOBILE_IMAGES = [
  '/images/for-hero/mobile-1.png',
  '/images/for-hero/mobile-2.png',
  '/images/for-hero/mobile-3.png',
];

export default function HeroSlideshow({
  initialAuth,
}: {
  initialAuth: boolean;
}) {
  const [idx, setIdx] = useState(0);
  // Keep reacting to client-side auth changes (e.g. sign-out on this page).
  const storeIsAuth = useAuthStore((s) => s.isAuth);
  const isAuth = initialAuth || storeIsAuth;

  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % IMAGES.length);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden desktop:h-[calc(100vh-65px)]">
      <div className="absolute inset-0 max-w-[100vw] max-desktop:hidden">
        {IMAGES.map((src, i) => (
          <div
            key={i}
            className={`absolute inset-0 bg-cover bg-right transition-opacity duration-1000 ease-in-out ${i === idx ? 'opacity-100' : 'opacity-0'} `}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
      </div>

      <div className="absolute inset-0 hidden max-w-[100vw] max-desktop:block">
        {MOBILE_IMAGES.map((src, i) => (
          <div
            key={i}
            className={`absolute inset-0 bg-contain bg-bottom transition-opacity duration-1000 ease-in-out 500px:bg-cover ${i === idx ? 'opacity-100' : 'opacity-0'} `}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-black bg-opacity-70 max-desktop:h-[45%] desktop:w-[45%]">
        <div className="relative z-10 flex h-full flex-col justify-center gap-10 p-[30px] desktop:px-[60px]">
          <Image
            src={'/images/logoLight.png'}
            width={400}
            height={200}
            alt="logo"
            className="mx-auto"
          />
          <p className="mx-auto text-xl font-medium leading-tight text-white">
            Find your musical soulmate
          </p>
          <div className="mx-auto mt-4 flex flex-col gap-2 text-white">
            {!isAuth ? (
              <div className="flex flex-col items-center gap-2">
                <Link
                  href="/auth?mode=signUp"
                  className="w-[200px] rounded-[7px] bg-mainOrange px-5 py-3 text-center font-bold text-mainBlack transition-all hover:text-white"
                >
                  sign up
                </Link>
                <Link
                  className="text-lg text-mainOrange"
                  href="/auth?mode=signIn"
                >
                  or{' '}
                  <span className="underline transition-all hover:text-white">
                    sign in
                  </span>
                </Link>
              </div>
            ) : (
              <Link
                href="/home"
                className="w-[200px] rounded-[7px] bg-mainOrange px-5 py-3 text-center font-bold text-mainBlack transition-all hover:text-white"
              >
                Explore
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
