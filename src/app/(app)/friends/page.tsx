import { getCurrentUser } from '@/actions/session';
import { searchMutualFriends } from '@/actions/userSubscriptionApi';
import { FriendsScreen } from '@/screens/friends/FriendsScreen';

const LIMIT = 20;

export default async function Page() {
  const user = await getCurrentUser();

  const initialFriends = user?.id
    ? await searchMutualFriends({ limit: LIMIT })
    : [];

  return <FriendsScreen initialUser={user} initialFriends={initialFriends} />;
}
