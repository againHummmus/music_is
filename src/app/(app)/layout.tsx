import { getCurrentUser } from '@/actions/session';
import { AppShell } from '@/components/layout/AppShell';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return <AppShell initialUser={user}>{children}</AppShell>;
}
