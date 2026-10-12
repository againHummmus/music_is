import { ClientInit } from '@/components/layout/ClientInit';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-w-0">
      <ClientInit />
      {children}
    </div>
  );
}
