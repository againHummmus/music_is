'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';
import { ArrowButton } from './buttons/ArrowButton';
import StreamlineSleep from '~icons/streamline/sleep?width=48px&height=48px';

/**
 * FetchResult can be either:
 * - an array of items directly
 * - an object { items, buttonHref? } when the href is determined by the fetch result
 */
type FetchResult = any[] | { items: any[]; buttonHref?: string };

interface ContentBlockProps {
  /** Title of the block. Accepts ReactNode so you can highlight parts with colored <span>s */
  title: ReactNode;
  /** Extra Tailwind classes for the title element. Defaults to 'text-[24px] text-mainBlack' */
  titleClassName?: string;
  /**
   * Async function that fetches items. Called once on mount.
   * Can return either an array or { items, buttonHref } when the link depends on fetched data.
   */
  fetchItems?: () => Promise<FetchResult>;
  /**
   * Pre-loaded items (skips the loading state entirely).
   * Use when the parent already has the data and no fetch is needed.
   */
  items?: any[];
  /** Render function for each item */
  renderItem?: (item: any, index: number) => ReactNode;
  /**
   * Full custom renderer for the items area (replaces the default gridClassName div + renderItem).
   * Receives the raw items array, must return the full JSX container.
   * When provided, renderItem and gridClassName are ignored.
   */
  renderGrid?: (items: any[]) => ReactNode;
  /** Tailwind grid classes for the items container (used only when renderGrid is not set) */
  gridClassName?: string;
  /** Label for the action button (requires buttonHref to show) */
  buttonLabel?: string;
  /** Static href for the action button. Can be overridden by fetchItems result */
  buttonHref?: string;
  /** Message shown when the list is empty */
  emptyLabel?: string;
  /** Number of skeleton placeholders during loading */
  skeletonCount?: number;
  /** Tailwind classes for each skeleton placeholder */
  skeletonItemClassName?: string;
  /** If true, the block renders null instead of showing an empty state */
  hideIfEmpty?: boolean;
  /** Extra class applied to the outer wrapper div */
  className?: string;
}

export function ContentBlock({
  title,
  titleClassName,
  fetchItems,
  items: propsItems,
  renderItem,
  renderGrid,
  gridClassName = 'grid grid-cols-1 main:grid-cols-2 w-full gap-10',
  buttonLabel,
  buttonHref: staticHref,
  emptyLabel = 'Nothing here yet!',
  skeletonCount = 6,
  skeletonItemClassName = 'h-[70px] bg-gray-300 animate-pulse rounded',
  hideIfEmpty = false,
  className,
}: ContentBlockProps) {
  const hasPreloaded = propsItems !== undefined;
  const [items, setItems] = useState<any[]>(propsItems ?? []);
  const [loading, setLoading] = useState(!hasPreloaded);
  const [resolvedHref, setResolvedHref] = useState<string | undefined>(
    staticHref
  );

  // Store fetchItems in a ref so the effect stays mount-only without stale-closure issues
  const fetchRef = useRef(fetchItems);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (hasPreloaded || !fetchRef.current) return;
    let canceled = false;
    setLoading(true);
    fetchRef
      .current()
      .then((result) => {
        if (canceled) return;
        if (Array.isArray(result)) {
          setItems(result);
        } else {
          setItems(result.items);
          if (result.buttonHref) setResolvedHref(result.buttonHref);
        }
      })
      .catch(console.error)
      .finally(() => {
        if (!canceled) setLoading(false);
      });
    return () => {
      canceled = true;
    };
  }, []); // intentionally mount-only

  if (!loading && items.length === 0 && hideIfEmpty) return null;

  return (
    <div className={`flex flex-col gap-10${className ? ` ${className}` : ''}`}>
      <div
        className={`font-bold${titleClassName ? ` ${titleClassName}` : 'text-[24px] text-mainBlack'}`}
      >
        {title}
      </div>

      {loading ? (
        <div className={gridClassName}>
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <div key={i} className={skeletonItemClassName} />
          ))}
        </div>
      ) : items.length > 0 ? (
        renderGrid ? (
          renderGrid(items)
        ) : (
          <div className={gridClassName}>
            {items.map((item, index) => renderItem!(item, index))}
          </div>
        )
      ) : (
        <div className="flex h-[230px] flex-col items-center justify-center gap-20 rounded-[7px] border border-dashed border-mainOrange text-mainOrange">
          <StreamlineSleep className="h-[40px] w-[40px]" />
          <p>{emptyLabel}</p>
        </div>
      )}

      {!loading && items.length > 0 && resolvedHref && buttonLabel && (
        <ArrowButton
          title={buttonLabel}
          href={resolvedHref}
          color="mainOrange"
          maxWidth="100px"
        />
      )}
    </div>
  );
}
