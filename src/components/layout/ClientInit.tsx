'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

/**
 * Thin client component that keeps the Zustand store refreshed on public
 * routes, which have no server-provided user hydration.
 */
export function ClientInit() {
  const update = useAuthStore((s) => s.update);
  useEffect(() => {
    update();
  }, [update]);
  return null;
}
