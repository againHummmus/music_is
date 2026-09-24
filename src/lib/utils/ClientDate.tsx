import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

export default function ClientDate({
  iso,
  className,
}: {
  iso: string;
  className?: string;
}) {
  const label = useSyncExternalStore(
    subscribe,
    () => new Date(iso).toLocaleString(),
    () => ''
  );
  return <span className={className}>{label ? ` ∘ ${label}` : ''}</span>;
}
