'use client'

import { FriendsPlaylistsBlock } from "@/components/mainScreen/FriendsPlaylistsBlock";
import { FriendsBlock } from "@/components/mainScreen/FriendsTracksBlock";
import { RecommendationsBlock } from "@/components/mainScreen/RecommendationsBlock";
import { RecommendedUsersBlock } from "@/components/mainScreen/RecommendedUsersBlock";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { Context } from "./layout";

function CustomParallax({ children }: { children: any }) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className="relative w-screen self-center h-[200px] main:h-[300px] bg-[url('/images/recordersBackground.png')] overflow-hidden after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-full after:bg-[#00000067]"
      style={{
      backgroundPosition: `center ${offset * 0.5}px`,
      backgroundSize: 'cover',
      }}
    >
      <div className="flex h-full flex-col items-center justify-center relative z-[1] container p-[15px] main:p-[30px]">
        {children}
      </div>
    </div>
  );
}


export default function Home() {

  const { isAuth } = useContext<any>(Context);

  return (
    <>
      {isAuth ? (
        <div className="w-full flex flex-col justify-center gap-[15px] main:gap-[50px]">
          <RecommendationsBlock amount={6} />
          <FriendsBlock />
          <RecommendedUsersBlock />
          <FriendsPlaylistsBlock />
        </div>
      ) : (
        <div className="flex flex-col justify-center gap-[15px] main:gap-[50px]">
          <CustomParallax>
            <Image
              src={"/images/logoLight.png"}
              alt={"logo"}
              width={300}
              height={200}
              className="h-auto w-[300px] object-contain"
            />
            <p className="text-mainWhite text-sm"> Everything about music. Nothing but music.</p>
          </CustomParallax>
          <RecommendationsBlock amount={32} />
        </div>
      )}
    </>
  );
}
