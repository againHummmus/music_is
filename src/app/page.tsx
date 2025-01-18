'use client'

import { FriendsPlaylistsBlock } from "@/components/mainScreen/FriendsPlaylistsBlock";
import { FriendsBlock } from "@/components/mainScreen/FriendsTracksBlock";
import { RecommendationsBlock } from "@/components/mainScreen/RecommendationsBlock";
import { RecommendedUsersBlock } from "@/components/mainScreen/RecommendedUsersBlock";
import Image from "next/image";
import { useContext } from "react";
import { Context } from "./layout";
import { BaseButtonOutline } from "@/components/shared/buttons/BaseButtonOutline";
import { BaseButtonDark } from "@/components/shared/buttons/BaseButtonDark";
import { Parallax } from 'react-parallax';

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
          <Parallax
            blur={0}
            bgImage="/images/recordersBackground.png"
            bgImageAlt="recorders background"
            strength={600}
            className="relative w-screen self-center h-[300px] main:h-[500px]"
            renderLayer={(percentage) => (
              <div
                className="absolute inset-0 bg-[#00000067]"
                style={{
                  opacity: percentage
                }}
              />
            )}
          >
            <div className="flex h-full max-w-fit flex-col items-center justify-center relative z-[1] container p-[15px] main:p-[30px] gap-10">
              <Image
                src={"/images/logoLight.png"}
                alt={"logo"}
                width={300}
                height={200}
                className="h-auto w-[300px]"
              />
              <p className="text-mainWhite text-sm">
                Everything about music. Nothing but music.
              </p>
              <div className="w-full flex flex-row gap-20 mt-[30px]">
                <BaseButtonDark title={"Sign in!"} href={"/signin"} />
                <BaseButtonOutline title={"Sign up!"} href={"/signup"} />
              </div>
            </div>
          </Parallax>
          <RecommendationsBlock amount={32} />
        </div>
      )}
    </>
  );
}