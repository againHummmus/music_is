"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "./store";

const IMAGES = [
  "/images/for-hero/1.png",
  "/images/for-hero/2.png",
  "/images/for-hero/3.png",
];

const MOBILE_IMAGES = [
  "/images/for-hero/mobile-1.png",
  "/images/for-hero/mobile-2.png",
  "/images/for-hero/mobile-3.png",
];

export default function HeroSlideshow() {
  const [idx, setIdx] = useState(0);
  const store = useStore();

  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % IMAGES.length);
    }, 4000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="relative w-full h-screen desktop:h-[calc(100vh-65px)] overflow-hidden">
      <div className="absolute inset-0 max-w-[100vw] max-desktop:hidden">
        {IMAGES.map((src, i) => (
          <div
            key={i}
            className={`
              absolute inset-0 bg-cover bg-right
              transition-opacity duration-1000 ease-in-out
              ${i === idx ? "opacity-100" : "opacity-0"}
            `}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
      </div>

      <div className="absolute inset-0 max-w-[100vw] hidden max-desktop:block">
        {MOBILE_IMAGES.map((src, i) => (
          <div
            key={i}
            className={`
              absolute inset-0 bg-contain 500px:bg-cover bg-bottom
              transition-opacity duration-1000 ease-in-out
              ${i === idx ? "opacity-100" : "opacity-0"}
            `}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
      </div>

      <div className="absolute max-desktop:h-[45%] desktop:w-[45%] inset-0 bg-black bg-opacity-70">
        <div className="relative z-10 flex flex-col gap-10 h-full justify-center p-[30px] desktop:px-[60px]">
          <Image
            src={"/images/logoLight.png"}
            width={400}
            height={200}
            alt="logo"
            className='mx-auto'
          />
          <p className="text-xl leading-tight font-medium text-white mx-auto">
            Find your musical soulmate
          </p>
          <div className="mt-4 flex flex-col gap-2 text-white mx-auto">
            {!store.isAuth ? (
              <div className='flex flex-col items-center gap-2'>
                <Link
                  href="/auth?mode=signUp"
                  className="rounded-[7px] bg-mainOrange w-[200px] hover:text-white transition-all px-5 py-3 text-mainBlack font-bold text-center"
                >
                  sign up
                </Link>
                <Link className='text-mainOrange text-lg' href="/auth?mode=signIn">
                  or <span className='underline hover:text-white transition-all'>sign in</span> 
                </Link>
              </div>
            ) : (
              <Link
                href="/home"
                className="rounded-[7px] bg-mainOrange w-[200px] hover:text-white transition-all px-5 py-3 text-mainBlack font-bold text-center"
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
