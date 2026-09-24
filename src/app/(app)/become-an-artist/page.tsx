import { getCurrentUser } from '@/actions/session';
import BecomeAnArtistScreen from './Screen';

export default async function Page() {
  const user = await getCurrentUser();

  return <BecomeAnArtistScreen initialUser={user} />;
}
