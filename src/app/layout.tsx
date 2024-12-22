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


export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
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
                color='#D7F943'
                shadow='0 2px 10px #FFD600, 0 0 5px #D7F943'
                initialPosition={0.5}
                showSpinner={false}
                speed={500}
            />
            <main className="container flex flex-row max-main:pb-[50px]">
              <div className="sticky h-fit top-[40px] main:top-[65px] w-[20%] min-w-[200px] border-r border-lightStormy pt-[20px] hidden main:flex flex-col pl-10">
                <div className="flex flex-row items-center gap-10 hover:text-mainOrange transition-all p-10">
                  <MingcuteHome5Fill/>
                  <div className="text-sm font-medium">
                    Home
                  </div>
                </div>
                <div className="flex flex-row items-center gap-10 hover:text-mainOrange transition-all p-10">
                  <HugeiconsFolderLibrary/>
                  <div className="text-sm font-medium">
                    Library
                  </div>
                </div>
                <div className="flex flex-row items-center gap-10 hover:text-mainOrange transition-all p-10">
                  <HugeiconsMessage01/>
                  <div className="text-sm font-medium">
                    Messages
                  </div>
                </div>
                <div className="flex flex-row items-center gap-10 hover:text-mainOrange transition-all p-10">
                  <HugeiconsNotification01/>
                  <div className="text-sm font-medium">
                    Notifications
                  </div>
                </div>
                <div className="flex flex-row items-center gap-10 hover:text-mainOrange transition-all p-10">
                  <HugeiconsUserGroup/>
                  <div className="text-sm font-medium">
                    Groups
                  </div>
                </div>
                <div className="flex flex-row items-center gap-10 hover:text-mainOrange transition-all p-10">
                  <HugeiconsSettings02/>
                  <div className="text-sm font-medium">
                    Settings
                  </div>
                </div>
                <div className="flex flex-row items-center gap-10 hover:text-mainOrange transition-all p-10">
                  <HugeiconsUploadCircle01/>
                  <div className="text-sm font-medium">
                    Upload
                  </div>
                </div>
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
