import { getCurrentUser } from '@/actions/session';
import UploadTrackScreen from './Screen';

export default async function Page() {
  const user = await getCurrentUser();
  return <UploadTrackScreen initialUser={user} />;
}
