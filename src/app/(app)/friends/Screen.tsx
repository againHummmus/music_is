'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { searchMutualFriends } from '@/actions/userSubscriptionApi';
import HugeiconsSpinner01 from '~icons/uil/spinner?width=32px&height=32px';
import { User } from '@/components/shared/user/UserItem';
import { RecommendedUsersBlock } from '@/components/mainScreen/RecommendedUsersBlock';

export default function FriendsScreen({
  initialUser,
  initialFriends = [],
}: {
  initialUser: any;
  initialFriends?: any[];
}) {
  const LIMIT = 20;
  const storeUser = useAuthStore((state) => state.user);
  const currentUser = storeUser ?? initialUser;

  const [friends, setFriends] = useState<any[]>(initialFriends);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const hasInitialData = useRef(initialFriends.length > 0);

  const observer = useRef<IntersectionObserver>();
  const lastFriendRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting && hasMore) setOffset((o) => o + LIMIT);
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    if (!currentUser) return;
    if (hasInitialData.current) {
      hasInitialData.current = false;
      return;
    }
    let canceled = false;
    setLoading(true);
    searchMutualFriends({
      limit: LIMIT,
      offset,
    })
      .then((data: any[]) => {
        if (canceled) return;
        setFriends((prev) => [...prev, ...data]);
        setHasMore(data.length === LIMIT);
      })
      .catch(console.error)
      .finally(() => {
        if (!canceled) setLoading(false);
      });
    return () => {
      canceled = true;
    };
  }, [currentUser?.id, offset]);

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold">Your Friends</h1>
      {friends.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,250px))] gap-10">
          {friends.map((sub, i) => {
            if (i === friends.length - 1)
              return (
                <div ref={lastFriendRef} key={sub.id}>
                  <User user={sub} />
                </div>
              );
            return <User key={sub.id} user={sub} />;
          })}
        </div>
      ) : (
        !loading && <RecommendedUsersBlock showPlaceholder />
      )}
      {loading && (
        <div className="col-span-full flex justify-center py-4 text-mainOrange">
          <HugeiconsSpinner01 className="animate-spin" />
        </div>
      )}
      {!hasMore && !loading && (
        <div className="w-full py-6 text-center text-gray-500">
          You&apos;ve reached the end!
        </div>
      )}
    </>
  );
}
