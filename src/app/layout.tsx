"use client";
import "./globals.css";
import { golos } from "./fonts";
import NextTopLoader from "nextjs-toploader";
import { Header } from "@/widgets/header/Header";
import { MobileNav } from "@/widgets/mobile-nav/MobileNav";
import { Sidebar } from "@/widgets/Sidebar";
import React, { useEffect, useState } from "react";

export const Context: any = React.createContext(undefined);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isAuth, setIsAuth] = useState<any>(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuth') === 'true';
    setIsAuth(authStatus);
  }, []);
  
  return (
    <Context.Provider value={{ isAuth, setIsAuth }}>
      <html lang="ru">
        <body className={`${golos.variable} min-w-[320px]`}>
          <Header />
          <NextTopLoader
            color="#FF8C3A"
            initialPosition={0.5}
            showSpinner={false}
            speed={500}
          />
          <main className="container flex flex-row max-main:pb-[50px]">
            {isAuth ? <Sidebar /> : null}
            <div className="min-w-0 w-full px-[15px] main:px-[30px] pb-[15px] main:pb-[30px]">
              {children}
            </div>
          </main>
          <MobileNav />
        </body>
      </html>
    </Context.Provider>
  );
}
