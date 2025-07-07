'use client'

import { useStore } from "../store";
import SubscriptionApi from "@/actions/userSubscriptionApi";
import { useState, useEffect } from "react";
import { PostItem } from "@/components/shared/post/PostItem";

export const dynamic = 'force-dynamic'

function extractAndSortPosts(usersArray: any[]) {
  let allPosts: any[] = [];

  usersArray.forEach(connection => {
    if (connection.Followee.Post && Array.isArray(connection.Followee.Post) && connection.Followee.Post.length > 0) {
      const {Post, ...User} = connection.Followee;
      const postsWithUser = connection.Followee.Post.map((post: any) => ({
        ...post,
        User
      }));
      allPosts = allPosts.concat(postsWithUser);
    }
  });

  allPosts.sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return allPosts;
}

export default function Home() {
  const LIMIT = 20
  const currentUser = useStore(state => state.user)

  const [friends, setFriends] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentUser) return
    let canceled = false

    SubscriptionApi.searchSubscriptions({
      follower: currentUser.id,
      limit: LIMIT,
    })
      .then((data: any[]) => {
        if (canceled) return
        setFriends(prev => [...prev, ...data])
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false)
      })

    return () => { canceled = true }
  }, [currentUser])

  const allPosts = extractAndSortPosts(friends);

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">What your friends think...</h1>
      <div className="w-full flex flex-col justify-center gap-[15px] main:gap-[50px]">
        <div className="space-y-6">

          {loading ? <div className="grid grid-cols-1 main:grid-cols-2 w-full gap-10 mb-[10px] main:mb-[15px]">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-[70px] bg-gray-300 animate-pulse rounded"
              ></div>
            ))}
          </div> : allPosts.length > 0 && allPosts.map((p) =>
            <PostItem user={p.User} isCurrentUser={false} post={p} key={p.id} />
          )}
        </div>
      </div>
    </>
  );
}