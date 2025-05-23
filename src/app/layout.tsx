"use client";

import "./globals.css";
import { golos } from "./fonts";
import NextTopLoader from "nextjs-toploader";
import { MobileNav } from "@/widgets/mobile-nav/MobileNav";
import { Sidebar } from "@/widgets/Sidebar";
import React, { useEffect } from "react";
import { useStore } from "./store";
import Modal from "@/components/modals/SuccessModal";
import Player from "@/components/player/Player";
import Header from "@/widgets/header/Header";
import { useRouter, usePathname } from "next/navigation";

export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const update = useStore((s) => s.update);
  const { isLoading, isAuth, user, modal } = useStore();

  useEffect(() => {
    update();
  }, [update]);

  useEffect(() => {
    if (isLoading) return;

    if (isAuth && user && !user.is_activated) {
      router.replace("/activation");
      return;
    }

    if (!isAuth) {
      router.replace("/");
    }
  }, [isLoading, isAuth, user, router]);

  return (
    <html lang="ru" className="overflow-x-visible">
      <body className={`${golos.variable} min-w-[300px] w-full overflow-y-scroll`}>
        <Header />
        <NextTopLoader
          color="#FF8C3A"
          initialPosition={0.5}
          showSpinner={false}
          zIndex={6000}
          speed={500}
        />
        {modal.isOpen && <Modal />}
        <main className="w-full flex flex-row">
          {
            !isLoading && isAuth && user?.is_activated && pathname != '/' && pathname != '/auth' && pathname != '/activate' ?
              <div className='container flex flex-row '>
                <Sidebar />
                <div className="min-w-0 w-full p-[15px] main:p-[30px]">
                  {children}
                </div>
              </div>
              :
              !isLoading && (pathname === '/' || pathname === '/auth' || pathname === '/activate') ? <div className="min-w-0 w-full">
                {children}
              </div>
                : <div className="w-full h-screen flex items-center justify-center">
                  <div
                    className="inline-block w-8 h-8 border-4 border-current border-t-transparent text-mainOrange rounded-full animate-spin"
                    role="status"
                    aria-label="loading"
                  >
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
          }
        </main>
        <Player />
        {isAuth && user?.is_activated && <MobileNav />}
      </body>
    </html>
  );
}
