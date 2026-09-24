'use client';

import { useEffect } from 'react';
import { useStore } from './store';

/**
 * Thin client component that keeps the Zustand store refreshed after
 * the initial server-provided hydration. Lives in the root layout so it
 * runs on every route, including public ones.
 */
export default function ClientInit() {
  const update = useStore((s) => s.update);
  useEffect(() => {
    update();
  }, [update]);
  return null;
}
