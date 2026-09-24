import { getCurrentUser } from '@/actions/session';
import AppLayoutClient from './AppLayoutClient';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return <AppLayoutClient initialUser={user}>{children}</AppLayoutClient>;
}
