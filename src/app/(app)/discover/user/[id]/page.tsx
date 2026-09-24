import { getCurrentUser } from '@/actions/session';
import { getUser } from '@/actions/userApi';
import { searchSubscriptions, countFollowers } from '@/actions/userSubscriptionApi';
import { searchPosts } from '@/actions/postApi';
import UserScreen from './Screen';
import StreamlineSleep from '~icons/streamline/sleep?width=48px&height=48px';

export default async function Page({ params }: { params: any }) {
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
        : Promise.resolve([] as any[]),
      countFollowers({ followee: params.id }),
      searchPosts({ userId: params.id, limit: 100 }),
    ]);

  const initialSub = subResult[0] ?? null;

    if (!viewedUser) {
      return (
        <div className="flex h-[230px] flex-col items-center justify-center gap-20 rounded-[7px] border border-dashed border-mainOrange text-mainOrange">
          <StreamlineSleep className="h-[40px] w-[40px]" />
          <p>User not found!</p>
        </div>
      );
    }

  return (
    <UserScreen
      params={params}
      initialCurrentUser={currentUser}
      initialViewedUser={viewedUser}
      initialIsSubscribed={!!initialSub}
      initialSubId={initialSub?.id ?? null}
      initialSubscriberCount={initialSubscriberCount}
      initialPosts={initialPosts}
    />
  );
}
