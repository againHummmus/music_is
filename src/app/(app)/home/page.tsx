import { getCurrentUser } from '@/actions/session';
import { getFeedPosts } from '@/actions/postApi';
import { HomeScreen } from '@/screens/home/HomeScreen';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 20;

export default async function Page() {
  const user = await getCurrentUser();
  const initialPosts = user ? await getFeedPosts({ limit: PAGE_SIZE }) : [];

  return <HomeScreen initialPosts={initialPosts} pageSize={PAGE_SIZE} />;
}
