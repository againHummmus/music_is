'use client';

import { useState } from 'react';
import HugeiconsLocationUser01 from '~icons/hugeicons/location-user-01?width=24px&height=24px';
import { createImgUrl } from '@/lib/utils/createUrlFromHash';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import {
  createSubscription,
  deleteSubscription,
} from '@/actions/userSubscriptionApi';
import type { UserCardRow } from '@/actions/types';

export function UserItem({ user }: { user: UserCardRow }) {
  const currentUser = useAuthStore((s) => s.user);
  const [subId, setSubId] = useState<number | null>(
    user.viewerSubscription[0]?.id ?? null
  );
  const [loading, setLoading] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(
    user.followers[0]?.count ?? 0
  );
  const isSubscribed = subId !== null;

  const toggleSubscription = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      if (subId !== null) {
        await deleteSubscription({ id: subId });
        setSubId(null);
        setSubscriberCount((count) => count - 1);
      } else {
        const newSub = await createSubscription({
          followee: user.id,
        });
        setSubId(newSub.id);
        setSubscriberCount((count) => count + 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="after:content-'' relative flex h-[250px] w-[240px] flex-col justify-end rounded-[7px] border border-mainOrange bg-cover bg-center bg-no-repeat p-15 after:absolute after:left-0 after:top-0 after:h-full after:w-full after:rounded-[7px] after:bg-gradient-to-t after:from-mainBlack after:to-mainBlack/0 after:opacity-90 after:transition-all hover:after:opacity-100"
      style={{
        backgroundImage: user.avatar_url
          ? `url(${createImgUrl(user.avatar_url)})`
          : 'url("/images/placeholderAvatar.png")',
      }}
    >
      <Link
        href={`/discover/user/${user.id}`}
        className="absolute inset-0 z-[1000] cursor-pointer"
      />
      <div className="relative z-[6000] flex w-full flex-col gap-5">
        <div className="text-base font-semibold text-white">
          {user.username}
        </div>
        <div className="flex flex-row items-center justify-between gap-5">
          <button
            onClick={toggleSubscription}
            disabled={loading}
            className={`flex h-[30px] min-w-[120px] items-center justify-center rounded-[7px] px-[10px] font-semibold transition-all ${isSubscribed && subId ? 'bg-lightStormy text-mainBlack' : 'bg-mainOrange text-mainBlack'} ${loading ? 'cursor-wait opacity-50' : 'hover:brightness-110'}`}
          >
            {isSubscribed && subId ? 'Unsubscribe' : 'Subscribe'}
          </button>
          <div className="flex flex-row items-center text-lightStormy">
            <HugeiconsLocationUser01 />
            <div className="font-semibold">{subscriberCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
