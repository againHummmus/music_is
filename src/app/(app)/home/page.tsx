import { getCurrentUser } from '@/actions/session';
import { getFeedPosts } from '@/actions/postApi';
import { HomeScreen } from '@/screens/home/HomeScreen';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const user = await getCurrentUser();
  const initialPosts = user ? await getFeedPosts() : [];

  return <HomeScreen initialPosts={initialPosts} />;
}
