'use client';
import { useAuthStore } from '@/stores/authStore';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ActivationScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const setIsLoading = useAuthStore((s) => s.setIsLoading);

  useEffect(() => {
    setIsLoading(true);
    if (!user) {
      setIsLoading(false);
      router.push('/auth?mode=signUp');
      return;
    }
    if (
      user.is_activated === true &&
      window.location.pathname === '/activate'
    ) {
      setIsLoading(false);
      router.push('/library');
      return;
    }
    setIsLoading(false);
  }, [user, router]);

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
