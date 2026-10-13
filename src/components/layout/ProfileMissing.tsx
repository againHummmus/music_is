'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { CONTACT_EMAIL } from '@/lib/siteConfig';

export function ProfileMissing() {
  const router = useRouter();
  const signOut = useAuthStore((s) => s.signOut);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-20 p-20 text-center">
      <h1 className="text-2xl font-bold text-mainBlack">
        We could not load your profile
      </h1>
      <p className="max-w-[480px] text-gray-600">
        Try signing in again. If this keeps happening, write to{' '}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-mainOrange">
          {CONTACT_EMAIL}
        </a>
        .
      </p>
      <button
        onClick={handleSignOut}
        className="rounded-[7px] bg-mainOrange px-20 py-10 text-white">
        Sign out
      </button>
    </div>
  );
}
