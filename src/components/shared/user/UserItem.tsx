'use client'

import { useState, useEffect } from 'react';
import HugeiconsLocationUser01 from '~icons/hugeicons/location-user-01?width=24px&height=24px';
import { createImgUrl } from '../utils/createUrlFromHash';
import Link from 'next/link';
import { useStore } from '@/app/store';
import SubscriptionApi from '@/actions/userSubscriptionApi';

export function User({ user }: { user: User }) {
  const { user: currentUser } = useStore();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subId, setSubId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);

  useEffect(() => {
    if (!currentUser) return;

    SubscriptionApi.searchSubscriptions({
      follower: currentUser.id,
      followee: user.id,
      limit: 1
    })
      .then((data: any[]) => {
        if (data.length > 0) {
          setIsSubscribed(true);
          setSubId(data[0].id);
        }
      })
      .catch(console.error);

    SubscriptionApi.searchSubscriptions({
      followee: user.id,
      limit: 1000, 
    })
      .then((allSubs: any[]) => {
        setSubscriberCount(allSubs.length);
      })
      .catch(console.error);
  }, [currentUser, user.id]);

  const toggleSubscription = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      if (isSubscribed && subId) {
        await SubscriptionApi.deleteSubscription({ id: subId });
        setIsSubscribed(false);
        setSubId(null);
        setSubscriberCount(count => count - 1);
      } else {
        const [newSub] = await SubscriptionApi.createSubscription({
          follower: currentUser.id,
          followee: user.id
        });
        setIsSubscribed(true);
        setSubId(newSub.id);
        setSubscriberCount(count => count + 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-[240px] p-15 flex flex-col justify-end h-[250px] bg-no-repeat bg-cover bg-center relative rounded-[7px] border border-mainOrange
                 after:absolute after:w-full after:h-full after:rounded-[7px] after:content-'' after:bg-gradient-to-t after:from-mainBlack after:opacity-90
                 hover:after:opacity-100 after:to-mainBlack/0 after:top-0 after:left-0 after:transition-all"
      style={{
        backgroundImage: user.avatar_url
          ? `url(${createImgUrl(user.avatar_url)})`
          : 'url("/images/placeholderAvatar.jpg")',
      }}
    >
      <Link
        href={`/discover/user/${user.id}`}
        className="absolute inset-0 z-[1000] cursor-pointer"
      />
      <div className="relative z-[6000] w-full flex flex-col gap-5 ">
        <div className="text-base font-semibold text-white">
          {user.username}
        </div>
        <div className="flex flex-row gap-5 justify-between items-center">
          <button
            onClick={toggleSubscription}
            disabled={loading}
            className={`min-w-[120px] h-[30px] px-[10px] flex items-center font-semibold justify-center transition-all rounded-[7px]
              ${isSubscribed && subId ? 'bg-lightStormy text-mainBlack' : 'bg-mainOrange text-mainBlack'}
              ${loading ? 'opacity-50 cursor-wait' : 'hover:brightness-110'}`}
          >
            {isSubscribed && subId ? 'Unsubscribe' : 'Subscribe'}
          </button>
          <div className="flex flex-row items-center text-lightStormy">
            <HugeiconsLocationUser01 />
            <div className="font-semibold">
              {subscriberCount}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
