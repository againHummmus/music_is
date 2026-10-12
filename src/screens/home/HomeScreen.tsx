'use client';

import HugeiconsSpinner01 from '~icons/uil/spinner?width=32px&height=32px';
import { PostItem } from '@/components/post/PostItem';
import { getFeedPosts } from '@/actions/postApi';
import type { PostRow } from '@/actions/types';
import { EmptyState } from '@/components/ui/EmptyState';
import { useInfiniteList } from '@/hooks/useInfiniteList';

export function HomeScreen({
  initialPosts,
  pageSize,
}: {
  initialPosts: PostRow[];
  pageSize: number;
}) {
  const {
    items: posts,
    isLoading,
    sentinelRef,
  } = useInfiniteList({
    fetchPage: (_offset, limit, loaded) =>
      getFeedPosts({ limit, before: loaded.at(-1)?.created_at }),
    limit: pageSize,
    initialItems: initialPosts,
  });

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold">What your friends think...</h1>
      <div className="flex w-full flex-col justify-center gap-[15px] main:gap-[50px]">
        <div className="space-y-6">
          {posts.length > 0 ? (
            posts.map(
              (p) =>
                p.User && (
                  <PostItem
                    user={p.User}
                    isCurrentUser={false}
                    post={p}
                    key={p.id}
                  />
                )
            )
          ) : (
            <EmptyState>Looks like your friends are silent!</EmptyState>
          )}
        </div>
        <div ref={sentinelRef} />
        {isLoading && (
          <div className="flex justify-center py-4 text-mainOrange">
            <HugeiconsSpinner01 className="animate-spin" />
          </div>
        )}
      </div>
    </>
  );
}
