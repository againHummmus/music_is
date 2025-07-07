'use client'
import MingcuteHome5Fill from "~icons/mingcute/home-5-fill?width=24px&height=24px";
import HugeiconsSettings02 from "~icons/hugeicons/settings-02?width=24px&height=24px";
import HugeiconsMessage01 from "~icons/hugeicons/message-01?width=24px&height=24px";
import HugeiconsFolderLibrary from "~icons/hugeicons/folder-library?width=24px&height=24px";
import MingcuteMicrophoneLine from '~icons/mingcute/microphone-line?width=24px&height=24px';
import HugeiconsPencilEdit02 from '~icons/hugeicons/pencil-edit-02?width=24px&height=24px';
import HugeiconsUploadCircle01 from "~icons/hugeicons/upload-circle-01?width=24px&height=24px";
import HugeiconsUserGroup from "~icons/hugeicons/user-group?width=24px&height=24px";

import Link from "next/link";
import userApi from "@/actions/userApi";
import { useState, useEffect } from "react";
import { useStore } from "@/app/store";

function RoleBasedLink({ loading, app_role }: { loading: boolean, app_role: 'artist' | 'admin' | 'user' }) {
  if (loading) {
    return (
      <div className='animate-pulse m-10 w-[100px] h-[20px] bg-mainDark/10 rounded-full' />
    );
  }

  if (app_role === 'admin') {
    return (
      <Link
        className="flex flex-row items-center gap-10 hover:text-mainOrange transition-all"
        href={"/admin"}
      >
        <HugeiconsPencilEdit02 className='w-[30px] h-[30px]'/>
      </Link>
    );
  }

  if (app_role === 'artist') {
    return (
      <Link
        className="flex flex-row items-center gap-10 hover:text-mainOrange transition-all"
        href={"/create"}
      >
        <HugeiconsUploadCircle01 className='w-[30px] h-[30px]'/>
      </Link>
    );
  }

  return (
    <Link
      className="flex flex-row items-center gap-10 hover:text-mainOrange transition-all"
      href={"/become-an-artist"}
    >
      <MingcuteMicrophoneLine className='w-[30px] h-[30px]'/>
    </Link>
  );
}

export function MobileNav() {
  const [app_role, setRole] = useState<'artist' | 'admin' | 'user'>('user')
  const [loading, setLoading] = useState(true)
  const store = useStore((state) => state);

  useEffect(() => {
    (async () => {
      setLoading(true)
      const user = await userApi.getMe();
      setRole(user?.app_role);
      setLoading(false)
    })()
  }, [store.user.app_role])
  return (
    <div className="max-w-[100%] sticky z-[6000] bottom-[0px] left-[0px] right-[0px] py-10 px-[15%] flex-row text-mainWhite bg-mainDark justify-between items-center max-main:flex hidden">
      <Link href="/home" className="flex flex-col items-center gap-5 text-mainOrange">
        <MingcuteHome5Fill className='w-[28px] h-[28px]'/>
      </Link>

      <Link href="/library" className="flex flex-col items-center gap-5 hover:text-mainOrange transition-colors">
        <HugeiconsFolderLibrary />
      </Link>

      <RoleBasedLink loading={loading} app_role={app_role} />

      <Link href="/dialogues" className="flex flex-col items-center gap-5 hover:text-mainOrange transition-colors">
        <HugeiconsMessage01 />
      </Link>

      <Link href="/friends" className="flex flex-col items-center gap-5 hover:text-mainOrange transition-colors">
        <HugeiconsUserGroup />
      </Link>

    </div>
  );
}
