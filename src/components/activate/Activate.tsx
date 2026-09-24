'use client';
import { useStore } from '@/app/store';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ActivationScreen() {
  const router = useRouter();
  const store = useStore((state) => state);

  useEffect(() => {
    store.setIsLoading(true);
    if (!store.user) {
      store.setIsLoading(false);
      router.push('/auth?mode=signUp');
      return;
    }
    if (
      store.user.is_activated === true &&
      window.location.pathname === '/activate'
    ) {
      store.setIsLoading(false);
      router.push('/library');
      return;
    }
    store.setIsLoading(false);
  }, [store.user, router]);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center">
      <div>
        <h1 className="mb-4 w-full text-center text-2xl font-bold">
          Great! The link was sent to your email.
        </h1>
        <p className="mb-6 w-full text-center leading-relaxed">
          Please, check the spam folder if it doesn&apos;t appear right away
        </p>
      </div>
    </div>
  );
}
