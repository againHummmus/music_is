import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/actions/session';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (user?.app_role !== 'admin') redirect('/home');

  return <>{children}</>;
}
