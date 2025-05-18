'use client';

import MingcuteHome5Fill from "~icons/mingcute/home-5-fill?width=24px&height=24px";
import HugeiconsUserGroup from "~icons/hugeicons/user-group?width=24px&height=24px";
import HugeiconsMessage01 from "~icons/hugeicons/message-01?width=24px&height=24px";
import HugeiconsSettings02 from "~icons/hugeicons/settings-02?width=24px&height=24px";
import HugeiconsNotification01 from "~icons/hugeicons/notification-01?width=24px&height=24px";
import HugeiconsFolderLibrary from "~icons/hugeicons/folder-library?width=24px&height=24px";
import HugeiconsUploadCircle01 from "~icons/hugeicons/upload-circle-01?width=24px&height=24px";
import MingcuteMicrophoneLine from '~icons/mingcute/microphone-line?width=24px&height=24px';
import HugeiconsPencilEdit02 from '~icons/hugeicons/pencil-edit-02?width=24px&height=24px';
import Link from "next/link";
import { useStore } from "@/app/store";
import { useEffect, useState } from "react";
import userApi from "@/actions/userApi";

export function Sidebar() {
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

  
  function RoleBasedLink({ loading, app_role }: {loading: boolean, app_role: 'artist' | 'admin' | 'user'}) {
    if (loading) {
      return (
        <div className='animate-pulse m-10 w-[100px] h-[20px] bg-mainDark/10 rounded-full' />
      );
    }
  
    if (app_role === 'admin') {
      return (
        <Link
          className="flex flex-row items-center gap-10 hover:text-mainOrange transition-all p-10"
          href={"/admin"}
        >
          <HugeiconsPencilEdit02 />
          <div className="text-sm font-medium">Admin Panel</div>
        </Link>
      );
    }
  
    if (app_role === 'artist') {
      return (
        <Link
          className="flex flex-row items-center gap-10 hover:text-mainOrange transition-all p-10"
          href={"/create"}
        >
          <HugeiconsUploadCircle01 />
          <div className="text-sm font-medium">Upload</div>
        </Link>
      );
    }
  
    return (
      <Link
        className="flex flex-row items-center gap-10 hover:text-mainOrange transition-all p-10"
        href={"/become-an-artist"}
      >
        <MingcuteMicrophoneLine />
        <div className="text-sm font-medium">Become an artist</div>
      </Link>
    );
  }

  return (
    <div className="sticky h-fit top-[40px] main:top-[65px] w-[20%] min-w-[200px] border-r border-lightStormy pt-[20px] hidden main:flex flex-col pl-10">
      <Link
        className="flex flex-row items-center gap-10 hover:text-mainOrange transition-all p-10"
        href={"/home"}
      >
        <MingcuteHome5Fill />
        <div className="text-sm font-medium">Home</div>
      </Link>
      <Link
        className="flex flex-row items-center gap-10 hover:text-mainOrange transition-all p-10"
        href={"/library"}
      >
        <HugeiconsFolderLibrary />
        <div className="text-sm font-medium">Library</div>
      </Link>
      <Link
        className="flex flex-row items-center gap-10 hover:text-mainOrange transition-all p-10"
        href={""}
      >
        <HugeiconsMessage01 />
        <div className="text-sm font-medium">Messages</div>
      </Link>
      {/* <Link
        className="flex flex-row items-center gap-10 hover:text-mainOrange transition-all p-10"
        href={""}
      >
        <HugeiconsNotification01 />
        <div className="text-sm font-medium">Notifications</div>
      </Link>
      <Link
        className="flex flex-row items-center gap-10 hover:text-mainOrange transition-all p-10"
        href={""}
      >
        <HugeiconsUserGroup />
        <div className="text-sm font-medium">Groups</div>
      </Link> */}
      <Link
        className="flex flex-row items-center gap-10 hover:text-mainOrange transition-all p-10"
        href={"/settings"}
      >
        <HugeiconsSettings02 />
        <div className="text-sm font-medium">Settings</div>
      </Link>
      <RoleBasedLink loading={loading} app_role={app_role}/>
    </div>
  );
}
