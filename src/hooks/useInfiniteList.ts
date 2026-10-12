import { useCallback, useEffect, useRef, useState } from 'react';

interface UseInfiniteListOptions<T> {
  fetchPage: (offset: number, limit: number) => Promise<T[]>;
  limit: number;
  initialItems?: T[];
  enabled?: boolean;
}

export function useInfiniteList<T>({
  fetchPage,
  limit,
  initialItems,
  enabled = true,
}: UseInfiniteListOptions<T>) {
  const [items, setItems] = useState<T[]>(initialItems ?? []);
  const [hasMore, setHasMore] = useState(
    initialItems ? initialItems.length >= limit : true
  );
  const [isLoading, setIsLoading] = useState(false);
  const offsetRef = useRef(initialItems?.length ?? 0);
  const isLoadingRef = useRef(false);
  const fetchPageRef = useRef(fetchPage);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPageRef.current = fetchPage;
  });

  const loadMore = useCallback(async () => {
    if (!enabled || !hasMore || isLoadingRef.current) return;
    isLoadingRef.current = true;
    setIsLoading(true);
    try {
      const page = await fetchPageRef.current(offsetRef.current, limit);
      offsetRef.current += page.length;
      setItems((prev) => [...prev, ...page]);
      setHasMore(page.length === limit);
    } catch (error) {
      console.error(error);
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, [enabled, hasMore, limit]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: '200px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore, items.length]);

  return { items, setItems, hasMore, isLoading, sentinelRef };
}
