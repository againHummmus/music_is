'use client';

import { useLayoutEffect } from 'react';
import { useStore } from '@/app/store';
import { Sidebar } from '@/widgets/Sidebar';
import Header from '@/widgets/header/Header';
import { MobileNav } from '@/widgets/mobile-nav/MobileNav';
import Player from '@/components/player/Player';
import Modal from '@/components/modals/SuccessModal';

interface Props {
  children: React.ReactNode;
  initialUser: any;
}

export default function AppLayoutClient({ children, initialUser }: Props) {
  // Synchronously hydrate the store before the browser paints so every child
  // component sees the correct user on its very first render.
  useLayoutEffect(() => {
    useStore.setState({
      user: initialUser,
      isAuth: Boolean(initialUser),
      isLoading: false,
    });
  }, [initialUser]);

  // Use the server-provided value as fallback for the very first render
  // (before useLayoutEffect fires).
  const storeUser = useStore((s) => s.user);
  const modal = useStore((s) => s.modal);
  const user = storeUser ?? initialUser;

  if (!user) return null;

  return (
    <>
      {modal.isOpen && <Modal />}
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
