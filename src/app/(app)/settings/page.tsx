import { getCurrentUser } from '@/actions/session';
import { SettingsScreen } from '@/screens/settings/SettingsScreen';

export default async function Page() {
  const user = await getCurrentUser();
  return <SettingsScreen initialUser={user} />;
}
