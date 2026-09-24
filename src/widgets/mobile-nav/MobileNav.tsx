'use client';
import MingcuteHome5Fill from '~icons/mingcute/home-5-fill?width=24px&height=24px';
import HugeiconsSettings02 from '~icons/hugeicons/settings-02?width=24px&height=24px';
import HugeiconsMessage01 from '~icons/hugeicons/message-01?width=24px&height=24px';
import HugeiconsFolderLibrary from '~icons/hugeicons/folder-library?width=24px&height=24px';
import MingcuteMicrophoneLine from '~icons/mingcute/microphone-line?width=24px&height=24px';
import HugeiconsPencilEdit02 from '~icons/hugeicons/pencil-edit-02?width=24px&height=24px';
import HugeiconsUploadCircle01 from '~icons/hugeicons/upload-circle-01?width=24px&height=24px';
import HugeiconsUserGroup from '~icons/hugeicons/user-group?width=24px&height=24px';

import Link from 'next/link';
import { getMe } from '@/actions/userApi';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

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
        className="flex flex-row items-center gap-10 transition-all hover:text-mainOrange"
        href={'/admin'}
      >
        <HugeiconsPencilEdit02 className="h-[30px] w-[30px]" />
      </Link>
    );
  }

  if (app_role === 'artist') {
    return (
      <Link
        className="flex flex-row items-center gap-10 transition-all hover:text-mainOrange"
        href={'/create'}
      >
        <HugeiconsUploadCircle01 className="h-[30px] w-[30px]" />
      </Link>
    );
  }

  return (
    <Link
      className="flex flex-row items-center gap-10 transition-all hover:text-mainOrange"
      href={'/become-an-artist'}
    >
      <MingcuteMicrophoneLine className="h-[30px] w-[30px]" />
    </Link>
  );
}

export function MobileNav() {
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
    <div className="sticky bottom-[0px] left-[0px] right-[0px] z-[6000] hidden max-w-[100%] flex-row items-center justify-between bg-mainDark px-[15%] py-10 text-mainWhite max-main:flex">
      <Link
        href="/home"
        className="flex flex-col items-center gap-5 text-mainOrange"
      >
        <MingcuteHome5Fill className="h-[28px] w-[28px]" />
      </Link>

      <Link
        href="/library"
        className="flex flex-col items-center gap-5 transition-colors hover:text-mainOrange"
      >
        <HugeiconsFolderLibrary />
      </Link>

      <RoleBasedLink loading={loading} app_role={app_role} />

      <Link
        href="/dialogues"
        className="flex flex-col items-center gap-5 transition-colors hover:text-mainOrange"
      >
        <HugeiconsMessage01 />
      </Link>

      <Link
        href="/friends"
        className="flex flex-col items-center gap-5 transition-colors hover:text-mainOrange"
      >
        <HugeiconsUserGroup />
      </Link>
    </div>
  );
}
