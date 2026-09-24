import { getCurrentUser } from '@/actions/session';
import SettingsScreen from './Screen';

export default async function Page() {
  const user = await getCurrentUser();
  return <SettingsScreen initialUser={user} />;
}
