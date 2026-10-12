'use client';

import { useAuthStore } from '@/stores/authStore';
import { searchMutualFriends } from '@/actions/userSubscriptionApi';
import HugeiconsSpinner01 from '~icons/uil/spinner?width=32px&height=32px';
import { UserItem } from '@/components/user/UserItem';
import { RecommendedUsersBlock } from '@/components/user/RecommendedUsersBlock';
import { useInfiniteList } from '@/hooks/useInfiniteList';
import type { MutualFriendRow, UserWithArtist } from '@/actions/types';

const LIMIT = 20;

export function FriendsScreen({
  initialUser,
  initialFriends,
}: {
  initialUser: UserWithArtist | null;
  initialFriends?: MutualFriendRow[];
}) {
  const storeUser = useAuthStore((state) => state.user);
  const currentUser = storeUser ?? initialUser;

  const {
    items: friends,
    hasMore,
    isLoading: loading,
    sentinelRef,
  } = useInfiniteList({
    fetchPage: (offset, limit) => searchMutualFriends({ limit, offset }),
    limit: LIMIT,
    initialItems: initialFriends?.length ? initialFriends : undefined,
    enabled: Boolean(currentUser),
  });

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold">Your Friends</h1>
      {friends.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,250px))] gap-10">
          {friends.map((friend) => (
            <UserItem key={friend.id} user={friend} />
          ))}
        </div>
      ) : (
        !loading && <RecommendedUsersBlock showPlaceholder />
      )}
      <div ref={sentinelRef} />
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
