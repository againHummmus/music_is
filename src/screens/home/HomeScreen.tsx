'use client';

import { PostItem } from '@/components/post/PostItem';
import type { PostRow } from '@/actions/types';
import { EmptyState } from '@/components/ui/EmptyState';

export function HomeScreen({ initialPosts }: { initialPosts: PostRow[] }) {
  return (
    <>
      <h1 className="mb-6 text-3xl font-bold">What your friends think...</h1>
      <div className="flex w-full flex-col justify-center gap-[15px] main:gap-[50px]">
        <div className="space-y-6">
          {initialPosts.length > 0 ? (
            initialPosts.map(
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
      </div>
    </>
  );
}
