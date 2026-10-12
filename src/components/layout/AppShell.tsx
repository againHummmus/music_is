'use client';

import { useLayoutEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useUiStore } from '@/stores/uiStore';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { Player } from '@/components/player/Player';
import { StatusModal } from '@/components/ui/StatusModal';
import type { UserWithArtist } from '@/actions/types';

interface Props {
  children: React.ReactNode;
  initialUser: UserWithArtist | null;
}

export function AppShell({ children, initialUser }: Props) {
  // Synchronously hydrate the store before the browser paints so every child
  // component sees the correct user on its very first render.
  useLayoutEffect(() => {
    useAuthStore.setState({
      user: initialUser ?? undefined,
      isAuth: Boolean(initialUser),
      isLoading: false,
    });
  }, [initialUser]);

  // Use the server-provided value as fallback for the very first render
  // (before useLayoutEffect fires).
  const storeUser = useAuthStore((s) => s.user);
  const modal = useUiStore((s) => s.modal);
  const user = storeUser ?? initialUser;

  if (!user) return null;

  return (
    <>
      {modal.isOpen && <StatusModal />}
      <Header />
      <div className="container flex min-h-screen flex-row">
        <Sidebar />
        <main className="w-full min-w-0 px-[15px] pb-20 pt-[15px] main:px-[30px] main:pb-30 main:pt-[30px]">
          {children}
        </main>
      </div>
      <Player />
      <MobileNav />
    </>
  );
}
