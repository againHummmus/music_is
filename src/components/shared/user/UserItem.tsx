'use client';

import { useState, useEffect } from 'react';
import HugeiconsLocationUser01 from '~icons/hugeicons/location-user-01?width=24px&height=24px';
import { createImgUrl } from '../utils/createUrlFromHash';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { createSubscription, deleteSubscription, searchSubscriptions } from '@/actions/userSubscriptionApi';
import type { UserRow } from '@/actions/types';
import type { UserBasicRow } from '@/actions/types';

export function User({ user }: { user: UserBasicRow }) {
  const currentUser = useAuthStore((s) => s.user);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subId, setSubId] = useState<string | number | null>(null);
  const [loading, setLoading] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);

  useEffect(() => {
    if (!currentUser) return;

    searchSubscriptions({
      follower: currentUser.id,
      followee: user.id,
      limit: 1,
    })
      .then((data) => {
        const first = data[0];
        if (first) {
          setIsSubscribed(true);
          setSubId(first.id);
        }
      })
      .catch(console.error);

    searchSubscriptions({
      followee: user.id,
      limit: 1000,
    })
      .then((allSubs) => {
        setSubscriberCount(allSubs.length);
      })
      .catch(console.error);
  }, [currentUser, user.id]);

  const toggleSubscription = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      if (isSubscribed && subId) {
        await deleteSubscription({ id: subId });
        setIsSubscribed(false);
        setSubId(null);
        setSubscriberCount((count) => count - 1);
      } else {
        const [newSub] = await createSubscription({
          followee: user.id,
        });
        setIsSubscribed(true);
        if (newSub) setSubId(newSub.id);
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
