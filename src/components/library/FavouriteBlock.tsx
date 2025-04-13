'use client'
import { Track } from "../shared/track/TrackItem";
import { ArrowButton } from "../shared/buttons/ArrowButton";
import { useStore } from "@/app/store";
import { useState, useEffect } from "react";
import { getLikedByMe } from "./actions/getLikedByMe";


export function FavouriteBlock() {
   const [likedByMe, setLikedByMe] = useState([]);
    const {user} = useStore();
  
  
    useEffect(() => {
      (async () => {
        await getLikedByMe({limit: 6, likedByUserId: user?.id}).then(res => setLikedByMe(res))
      })()
    }, [user])
  
  return (
    <div>
      <div className="font-bold text-[24px] text-mainOrange mb-[10px] main:mb-[15px]">
        Your favourite:
      </div>
      {likedByMe.length > 0 ? (
        <div className="grid gid-cols-1 main:grid-cols-2 w-full gap-10 mb-[10px] main:mb-[15px]">
          {likedByMe?.map((item: any, index: any) => (
            <Track key={index} info={item} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 main:grid-cols-2 w-full gap-10 mb-[10px] main:mb-[15px]">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-[70px] bg-gray-300 animate-pulse rounded"
            ></div>
          ))}
        </div>
      )}
      <div className="w-full flex flex-row justify-end">
        <ArrowButton title={"More"} href={"/mytracks"} color={"mainOrange"} maxWidth="100px"/>
      </div>
    </div>
  );
}
