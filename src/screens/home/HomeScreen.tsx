'use client';

import { PostItem } from '@/components/post/PostItem';
import type { SubscriptionRow } from '@/actions/types';
import { EmptyState } from '@/components/ui/EmptyState';

function extractAndSortPosts(subscriptions: SubscriptionRow[]) {
  const allPosts = subscriptions.flatMap(({ Followee: followee }) => {
    if (!followee) return [];
    const User = {
      id: followee.id,
      username: followee.username,
      avatar_url: followee.avatar_url,
    };
    return followee.Post.map((post) => ({ ...post, User }));
  });
  allPosts.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  return allPosts;
}

export function HomeScreen({
  initialSubscriptions,
}: {
  initialSubscriptions: SubscriptionRow[];
}) {
  const allPosts = extractAndSortPosts(initialSubscriptions);

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold">What your friends think...</h1>
      <div className="flex w-full flex-col justify-center gap-[15px] main:gap-[50px]">
        <div className="space-y-6">
          {allPosts.length > 0 ? (
            allPosts.map((p) => (
              <PostItem
                user={p.User}
                isCurrentUser={false}
                post={p}
                key={p.id}
              />
            ))
          ) : (
            <EmptyState>Looks like your friends are silent!</EmptyState>
          )}
        </div>
      </div>
    </>
  );
}
