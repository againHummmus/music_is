'use client';

import { searchUsers } from '@/actions/userApi';
import HugeiconsSpinner01 from '~icons/uil/spinner?width=32px&height=32px';
import { UserItem } from '@/components/user/UserItem';
import { useInfiniteList } from '@/hooks/useInfiniteList';

const LIMIT = 20;

export function UsersScreen() {
  const {
    items: users,
    hasMore,
    isLoading,
    sentinelRef,
  } = useInfiniteList({
    fetchPage: (offset, limit) => searchUsers({ limit, offset }),
    limit: LIMIT,
  });

  return (
    <>
      <h1 className="mb-[20px] text-3xl font-bold">Users</h1>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,250px))] gap-10">
        {users.map((u) => (
          <UserItem key={u.id} user={u} />
        ))}

        {isLoading && (
          <div className="flex justify-center py-4 text-mainOrange">
            <HugeiconsSpinner01 className="animate-spin" />
          </div>
        )}
      </div>
      <div ref={sentinelRef} />
      {!hasMore && !isLoading && (
        <div className="w-full py-4 text-center text-gray-500">
          You&apos;ve reached the end!
        </div>
      )}
    </>
  );
}
