import { getCurrentUser } from '@/actions/session';
import { getUser } from '@/actions/userApi';
import { searchSubscriptions, countFollowers } from '@/actions/userSubscriptionApi';
import { searchPosts } from '@/actions/postApi';
import { UserProfileScreen } from '@/screens/user-profile/UserProfileScreen';
import { EmptyState } from '@/components/ui/EmptyState';

export default async function Page({ params }: { params: { id: string } }) {
  const currentUser = await getCurrentUser();

  const [viewedUser, subResult, initialSubscriberCount, initialPosts] =
    await Promise.all([
      getUser({ id: String(params.id) }),
      currentUser
        ? searchSubscriptions({
            follower: currentUser.id,
            followee: params.id,
            limit: 1,
          })
        : Promise.resolve([]),
      countFollowers({ followee: params.id }),
      searchPosts({ userId: params.id, limit: 100 }),
    ]);

  const initialSub = subResult[0] ?? null;

    if (!viewedUser) {
      return (
        <EmptyState>User not found!</EmptyState>
      );
    }

  return (
    <UserProfileScreen
      initialCurrentUser={currentUser}
      initialViewedUser={viewedUser}
      initialIsSubscribed={!!initialSub}
      initialSubId={initialSub?.id ?? null}
      initialSubscriberCount={initialSubscriberCount}
      initialPosts={initialPosts}
    />
  );
}
