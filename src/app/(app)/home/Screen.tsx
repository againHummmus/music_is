'use client';

import { PostItem } from '@/components/shared/post/PostItem';
import StreamlineSleep from '~icons/streamline/sleep?width=48px&height=48px';

function extractAndSortPosts(usersArray: any[]) {
  let allPosts: any[] = [];
  usersArray.forEach((connection) => {
    if (
      connection.Followee.Post &&
      Array.isArray(connection.Followee.Post) &&
      connection.Followee.Post.length > 0
    ) {
      const { Post, ...User } = connection.Followee;
      const postsWithUser = connection.Followee.Post.map((post: any) => ({
        ...post,
        User,
      }));
      allPosts = allPosts.concat(postsWithUser);
    }
  });
  allPosts.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  return allPosts;
}

export default function HomeScreen({
  initialSubscriptions,
}: {
  initialSubscriptions: any[];
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
            <div className="flex h-[230px] flex-col items-center justify-center gap-20 rounded-[7px] border border-dashed border-mainOrange text-mainOrange">
              <StreamlineSleep className="h-[40px] w-[40px]" />
              <p>Looks like your friends are silent!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
