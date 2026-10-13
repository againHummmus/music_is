import type { ReactNode } from 'react';
import StreamlineSleep from '~icons/streamline/sleep?width=48px&height=48px';

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-[230px] flex-col items-center justify-center gap-20 rounded-[7px] border border-dashed border-mainOrange text-mainOrange">
      <StreamlineSleep className="h-[40px] w-[40px]" />
      <p className="text-center">{children}</p>
    </div>
  );
}
