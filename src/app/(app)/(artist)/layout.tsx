import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/actions/session';

export default async function ArtistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (user?.app_role !== 'artist') redirect('/home');

  return <>{children}</>;
}
