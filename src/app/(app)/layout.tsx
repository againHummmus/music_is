import { getCurrentUser } from '@/actions/session';
import { getMyLikedTrackIds } from '@/actions/trackLikeApi';
import { AppShell } from '@/components/layout/AppShell';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const likedTrackIds = user
    ? await getMyLikedTrackIds().catch((): number[] => [])
    : [];

  return (
    <AppShell initialUser={user} initialLikedTrackIds={likedTrackIds}>
      {children}
    </AppShell>
  );
}
