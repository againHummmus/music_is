import { getCurrentUser } from '@/actions/session';
import { searchMutualFriends } from '@/actions/userSubscriptionApi';
import FriendsScreen from './Screen';

const LIMIT = 20;

export default async function Page() {
  const user = await getCurrentUser();

  let initialFriends: any[] = [];
  if (user?.id) {
    initialFriends = await searchMutualFriends({
      limit: LIMIT,
    });
  }

  return <FriendsScreen initialUser={user} initialFriends={initialFriends} />;
}
