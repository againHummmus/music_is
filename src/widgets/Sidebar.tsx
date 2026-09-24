'use client';

import MingcuteHome5Fill from '~icons/mingcute/home-5-fill?width=24px&height=24px';
import HugeiconsUserGroup from '~icons/hugeicons/user-group?width=24px&height=24px';
import HugeiconsMessage01 from '~icons/hugeicons/message-01?width=24px&height=24px';
import HugeiconsFolderLibrary from '~icons/hugeicons/folder-library?width=24px&height=24px';
import HugeiconsUploadCircle01 from '~icons/hugeicons/upload-circle-01?width=24px&height=24px';
import MingcuteMicrophoneLine from '~icons/mingcute/microphone-line?width=24px&height=24px';
import HugeiconsPencilEdit02 from '~icons/hugeicons/pencil-edit-02?width=24px&height=24px';
import HugeiconsSearch01 from '~icons/hugeicons/search-01?width=24px&height=24px';

import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { useEffect, useState } from 'react';
import { getMe } from '@/actions/userApi';

function RoleBasedLink({
  loading,
  app_role,
}: {
  loading: boolean;
  app_role: 'artist' | 'admin' | 'user';
}) {
  if (loading) {
    return (
      <div className="m-10 h-[20px] w-[100px] animate-pulse rounded-full bg-mainDark/10" />
    );
  }

  if (app_role === 'admin') {
    return (
      <Link
        className="flex flex-row items-center gap-10 p-10 transition-all hover:text-mainOrange"
        href={'/admin'}
      >
        <HugeiconsPencilEdit02 />
        <div className="text-sm font-medium">Admin Panel</div>
      </Link>
    );
  }

  if (app_role === 'artist') {
    return (
      <Link
        className="flex flex-row items-center gap-10 p-10 transition-all hover:text-mainOrange"
        href={'/create'}
      >
        <HugeiconsUploadCircle01 />
        <div className="text-sm font-medium">Upload</div>
      </Link>
    );
  }

  return (
    <Link
      className="flex flex-row items-center gap-10 p-10 transition-all hover:text-mainOrange"
      href={'/become-an-artist'}
    >
      <MingcuteMicrophoneLine />
      <div className="text-sm font-medium">Become an artist</div>
    </Link>
  );
}

export function Sidebar() {
  const [app_role, setRole] = useState<'artist' | 'admin' | 'user'>('user');
  const [loading, setLoading] = useState(true);
  const storeUser = useAuthStore((s) => s.user);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const user = await getMe();
      setRole(user?.app_role ?? 'user');
      setLoading(false);
    })();
  }, [storeUser]);

  return (
    <div className="sticky top-[40px] hidden h-fit w-[20%] min-w-[200px] flex-col border-r border-lightStormy pl-10 pt-[20px] main:top-[65px] main:flex">
      <Link
        className="flex flex-row items-center gap-10 p-10 transition-all hover:text-mainOrange"
        href={'/home'}
      >
        <MingcuteHome5Fill />
        <div className="text-sm font-medium">Home</div>
      </Link>
      <Link
        className="flex flex-row items-center gap-10 p-10 transition-all hover:text-mainOrange"
        href={'/library'}
      >
        <HugeiconsFolderLibrary />
        <div className="text-sm font-medium">Library</div>
      </Link>
      <Link
        className="flex flex-row items-center gap-10 p-10 transition-all hover:text-mainOrange"
        href={'/dialogues'}
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
       */}
      <Link
        className="flex flex-row items-center gap-10 p-10 transition-all hover:text-mainOrange"
        href={'/friends'}
      >
        <HugeiconsUserGroup />
        <div className="text-sm font-medium">Friends</div>
      </Link>
      <Link
        className="flex flex-row items-center gap-10 p-10 transition-all hover:text-mainOrange"
        href={'/search'}
      >
        <HugeiconsSearch01 />
        <div className="text-sm font-medium">Search</div>
      </Link>
      <RoleBasedLink loading={loading} app_role={app_role} />
    </div>
  );
}
