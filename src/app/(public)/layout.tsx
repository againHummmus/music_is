import { getCurrentUser } from '@/actions/session';
import { ClientInit } from '@/components/layout/ClientInit';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="w-full min-w-0">
      <ClientInit initialUser={user} />
      {children}
    </div>
  );
}
