"use client";

import "./globals.css";
import { golos } from "./fonts";
import NextTopLoader from "nextjs-toploader";
import { MobileNav } from "@/widgets/mobile-nav/MobileNav";
import { Sidebar } from "@/widgets/Sidebar";
import React, { useEffect } from "react";
import { useStore } from "./store";
import ActivationScreen from "@/components/activate/Activate";
import AuthScreen from "@/components/auth/Auth";
import Modal from "@/components/modals/SuccessModal";
import Player from "@/components/player/Player";
import Header from "@/widgets/header/Header";

export const dynamic = 'force-dynamic'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const update = useStore((state) => state.update);
  const store = useStore((state) => state);
  useEffect(() => {
      update()
  }, [])

  return (
    <html lang="ru" className='overflow-x-visible'>
      <body className={`${golos.variable} min-w-[300px] w-full overflow-y-scroll`}>
        <Header />
        <NextTopLoader
          color="#FF8C3A"
          initialPosition={0.5}
          showSpinner={false}
          speed={500}
        />
        {store.modal.isOpen ? <Modal/> : null}
        <main className={`w-full container flex flex-row`}>

          {store.isLoading
            ? <div className="w-full h-screen flex items-center justify-center">
              <div
                className="inline-block w-8 h-8 border-4 border-current border-t-transparent text-mainOrange rounded-full animate-spin"
                role="status"
                aria-label="loading"
              >
                <span className="sr-only">Loading...</span>
              </div>
            </div>
            : <>
              {store.isAuth && store.user?.is_activated ? <Sidebar /> : null}
              <div className="min-w-0 w-full p-[15px] main:p-[30px]">
                {store.isAuth && store.user?.is_activated ? children : store.isAuth && !store.user?.is_activated ?
                  <ActivationScreen />
                  :
                  <AuthScreen />
                }
              </div>
            </>
          }
        </main>
        <Player/>
        {store.isAuth && store.user?.is_activated ?  <MobileNav /> : null}
      </body>
    </html>
  );
}
