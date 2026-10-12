import { Suspense } from 'react';
import { getCurrentUser } from '@/actions/session';
import { getUserProfile } from '@/actions/userApi';
import {
  countFollowers,
  findSubscriptionId,
} from '@/actions/userSubscriptionApi';
import { searchPosts } from '@/actions/postApi';
import { UserProfileScreen } from '@/screens/user-profile/UserProfileScreen';
import { EmptyState } from '@/components/ui/EmptyState';
import { UserAlbumsBlock } from '@/screens/user-profile/UserAlbumsBlock';

export default async function Page({ params }: { params: { id: string } }) {
  const currentUser = await getCurrentUser();

  const [viewedUser, subscriptionId, initialSubscriberCount, initialPosts] =
    await Promise.all([
      getUserProfile(params.id),
      currentUser
        ? findSubscriptionId({
            follower: currentUser.id,
            followee: params.id,
          })
        : Promise.resolve(null),
      countFollowers({ followee: params.id }),
      searchPosts({ userId: params.id, limit: 100 }),
    ]);

    if (!viewedUser) {
      return (
        <EmptyState>User not found!</EmptyState>
      );
    }

  return (
    <UserProfileScreen
      initialCurrentUser={currentUser}
      initialViewedUser={viewedUser}
      initialIsSubscribed={subscriptionId !== null}
      initialSubId={subscriptionId}
      initialSubscriberCount={initialSubscriberCount}
      initialPosts={initialPosts}
      albums={
        viewedUser.Artist && (
          <Suspense fallback={null}>
            <UserAlbumsBlock
              userId={viewedUser.id}
              username={viewedUser.username}
              artistId={viewedUser.Artist.id}
            />
          </Suspense>
        )
      }
    />
  );
}
