import { getCurrentUser } from '@/actions/session';
import { searchSubscriptions } from '@/actions/userSubscriptionApi';
import { HomeScreen } from '@/screens/home/HomeScreen';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const user = await getCurrentUser();

  const initialSubscriptions = user?.id
    ? await searchSubscriptions({ follower: user.id, limit: 20 })
    : [];

  return <HomeScreen initialSubscriptions={initialSubscriptions} />;
}
