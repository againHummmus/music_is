import { getCurrentUser } from '@/actions/session';
import { searchSubscriptions } from '@/actions/userSubscriptionApi';
import HomeScreen from './Screen';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const user = await getCurrentUser();

  let initialSubscriptions: any[] = [];
  if (user?.id) {
    initialSubscriptions = await searchSubscriptions({
      follower: user.id,
      limit: 20,
    });
  }

  return <HomeScreen initialSubscriptions={initialSubscriptions} />;
}
