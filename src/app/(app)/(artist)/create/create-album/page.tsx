import { getCurrentUser } from '@/actions/session';
import CreateAlbumScreen from './Screen';

export default async function Page() {
  const user = await getCurrentUser();
  return <CreateAlbumScreen initialUser={user} />;
}
