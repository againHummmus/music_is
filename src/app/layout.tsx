import type { Metadata } from "next";
import "./globals.css";
import { Header } from "../../components/header/Header";
import { golos } from "./fonts";
import NextTopLoader from "nextjs-toploader";
import MingcuteHome5Fill from '~icons/mingcute/home-5-fill?width=24px&height=24px';
import HugeiconsUserGroup from '~icons/hugeicons/user-group?width=24px&height=24px';
import HugeiconsMessage01 from '~icons/hugeicons/message-01?width=24px&height=24px';
import HugeiconsSettings02 from '~icons/hugeicons/settings-02?width=24px&height=24px';
import HugeiconsNotification01 from '~icons/hugeicons/notification-01?width=24px&height=24px';
import HugeiconsFolderLibrary from '~icons/hugeicons/folder-library?width=24px&height=24px';
import HugeiconsUploadCircle01 from '~icons/hugeicons/upload-circle-01?width=24px&height=24px';
import { MobileNav } from "@components/mobile-nav/MobileNav";
import Link from "next/link";


export const metadata: Metadata = {
  title: "Music Is",
  description: "Everything about music, nothing but music.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ru'>
    <body className={`${golos.variable} min-w-[320px]`}>
            <Header />
            <NextTopLoader
                color='#FF8C3A'
                initialPosition={0.5}
                showSpinner={false}
                speed={500}
            />
            <main className="container flex flex-row max-main:pb-[50px]">
              <div className="sticky h-fit top-[40px] main:top-[65px] w-[20%] min-w-[200px] border-r border-lightStormy pt-[20px] hidden main:flex flex-col pl-10">
                <Link className="flex flex-row items-center gap-10 hover:text-mainOrange transition-all p-10" href={"/"}>
                  <MingcuteHome5Fill/>
                  <div className="text-sm font-medium">
                    Home
                  </div>
                </Link>
                <Link className="flex flex-row items-center gap-10 hover:text-mainOrange transition-all p-10" href={"/library"}>
                  <HugeiconsFolderLibrary/>
                  <div className="text-sm font-medium">
                    Library
                  </div>
                </Link>
                <Link className="flex flex-row items-center gap-10 hover:text-mainOrange transition-all p-10" href={""}>
                  <HugeiconsMessage01/>
                  <div className="text-sm font-medium">
                    Messages
                  </div>
                </Link>
                <Link className="flex flex-row items-center gap-10 hover:text-mainOrange transition-all p-10" href={""}>
                  <HugeiconsNotification01/>
                  <div className="text-sm font-medium">
                    Notifications
                  </div>
                </Link>
                <Link className="flex flex-row items-center gap-10 hover:text-mainOrange transition-all p-10" href={""}>
                  <HugeiconsUserGroup/>
                  <div className="text-sm font-medium">
                    Groups
                  </div>
                </Link>
                <Link className="flex flex-row items-center gap-10 hover:text-mainOrange transition-all p-10" href={""}>
                  <HugeiconsSettings02/>
                  <div className="text-sm font-medium">
                    Settings
                  </div>
                </Link>
                <Link className="flex flex-row items-center gap-10 hover:text-mainOrange transition-all p-10" href={""}>
                  <HugeiconsUploadCircle01/>
                  <div className="text-sm font-medium">
                    Upload
                  </div>
                </Link>
              </div>
              <div className="min-w-0 w-full p-[15px] main:p-[30px]">
                {children}
              </div>
            </main>
            <MobileNav/>
    </body>
</html>
  );
}
