'use client';

import { useLayoutEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import type { UserWithArtist } from '@/actions/types';

export function ClientInit({
  initialUser,
}: {
  initialUser: UserWithArtist | null;
}) {
  useLayoutEffect(() => {
    useAuthStore.setState({
      user: initialUser ?? undefined,
      isAuth: Boolean(initialUser),
      isLoading: false,
    });
  }, [initialUser]);
  return null;
}
