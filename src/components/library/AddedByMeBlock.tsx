'use client'

import { Track } from "../shared/track/TrackItem";
import { ArrowButton } from "../shared/buttons/ArrowButton";
import { useState, useEffect } from "react";
import { useStore } from "@/app/store";
import { searchTracksAction } from "./actions/getAddedByMe";

export function AddedByMeBlock() {
  const [addedByMe, setAddedByMe] = useState([]);
  const {user} = useStore();


  useEffect(() => {
    (async () => {
      await searchTracksAction({limit: 6, artist: user?.Artist?.id}).then(res => setAddedByMe(res))
    })()
  }, [user])

  return (
    <div>
      <div className="font-bold text-[24px] text-mainDark mb-[10px] main:mb-[15px]">
        Added by you:
      </div>
      {addedByMe.length > 0 ? (
        <div className="grid gid-cols-1 main:grid-cols-2 w-full gap-10 mb-[10px] main:mb-[15px]">
          {addedByMe.map((item: any, index: any) => (
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
        <ArrowButton title={"More"} href={"/mytracks"} color={"mainOrange"} maxWidth="100px" />
      </div>
    </div>
  );
}
