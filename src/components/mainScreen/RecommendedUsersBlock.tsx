'use client';
import { useState, useEffect } from "react";
import { User } from "../shared/user/UserItem";
import StreamlineSleep from '~icons/streamline/sleep?width=48px&height=48px';
import { useStore } from "@/app/store";
import RecommendationApi from "@/actions/recsApi";

export function RecommendedUsersBlock({showPlaceholder}: {showPlaceholder?: boolean}) {
  const [loading, setLoading] = useState(true)
  const store = useStore();
  const currentUser = store.user;
  const [userRecs, setUserRecs] = useState<any>();

  useEffect(() => {
    async function fetchUsers() {
      await RecommendationApi.getUserRecommendations({ userId: currentUser.id })
        .then(setUserRecs);
    }
    fetchUsers().then(() => setLoading(false));
  }, []);

  if (!showPlaceholder && userRecs?.length <= 0) return null
  return (
    <>
      {userRecs?.length > 0 ? <div className="w-full flex flex-col min-w-0 p-15 rounded-[12px] border-2 border-mainOrange bg-gradient-to-b from-white to-white/0">
        <div className="font-bold text-[32px] text-mainDark mb-[10px] main:mb-[15px]">
          You have much <span className="text-mainOrange">in common:</span>
        </div>
        <div className="relative w-full ">
          <div className="absolute z-[1000] top-0 left-0 w-[10px] h-full bg-gradient-to-r from-white to-transparent pointer-events-none max-main:block hidden"></div>
          <div className="absolute z-[1000] top-0 right-0 w-[10px] h-full bg-gradient-to-l from-white to-transparent pointer-events-none max-main:block hidden"></div>
          <div className="flex flex-row gap-10 overflow-x-scroll custom-scrollbar-x scrollbar-container-x ">
            {loading ?
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="w-[25%] min-h-[250px] bg-gray-300 animate-pulse rounded"
                />
              ))
              : userRecs?.length > 0 ? userRecs?.map((rec: any) =>
                <User user={rec.RecommendedUser} key={rec.RecommendedUser.id} />
              )
                : <div className='flex flex-col h-[230px] w-full gap-20 rounded-[7px] border border-mainOrange border-dashed items-center justify-center text-mainOrange'>
                  <StreamlineSleep className='w-[40px] h-[40px]' />
                  <p>Looks like you're already friends with everyone!</p>
                </div>}
          </div>
        </div>
      </div> : <div className='flex flex-col h-[230px] gap-20 rounded-[7px] border border-mainOrange border-dashed items-center justify-center text-mainOrange'>
        <StreamlineSleep className='w-[40px] h-[40px]' />
        <p>You have no friends:( Like some tracks to see recommended users!</p>
      </div>}
    </>
  );
}

