'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { createPlaylist } from '@/actions/playlistApi';
import { PlaylistItem } from '@/components/shared/playlist/PlaylistItem';
import HugeiconsPlusSign from '~icons/hugeicons/plus-sign';
import { searchUserPlaylists } from '@/actions/userPlaylistApi';
import StreamlineSleep from '~icons/streamline/sleep?width=48px&height=48px';

export default function PlaylistsScreen({
  initialUser,
  initialPlaylists = [],
}: {
  initialUser: any;
  initialPlaylists?: any[];
}) {
  const storeUser = useAuthStore((s) => s.user);
  const user = storeUser ?? initialUser;

  const [newName, setNewName] = useState('');
  const [newDescription, setDescription] = useState('');
  const [newIsPublic, setNewIsPublic] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showAddPlaylist, setShowAddPlaylist] = useState(false);

  const LIMIT = 6;
  const [userPlaylistConnections, setUserPlaylistConnections] =
    useState<any[]>(initialPlaylists);
  const [offset, setOffset] = useState(initialPlaylists.length);
  const [hasMore, setHasMore] = useState(initialPlaylists.length >= LIMIT);
  const [isFetching, setIsFetching] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const userId = user?.id;

  const loadMore = useCallback(async () => {
    if (isFetching || !hasMore || !userId) return;
    setIsFetching(true);
    try {
      const { data } = await searchUserPlaylists({
        userId,
        limit: LIMIT,
        offset,
      });
      const newItems = data ?? [];
      setUserPlaylistConnections((prev) => [...prev, ...newItems]);
      setHasMore(newItems.length === LIMIT);
      setOffset((prev) => prev + newItems.length);
    } catch (err) {
      console.error('Error loading playlists:', err);
    } finally {
      setIsFetching(false);
    }
  }, [userId, offset, hasMore, isFetching]);

  useEffect(() => {
    const node = loaderRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: '200px' }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [loadMore]);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const response = await createPlaylist({
        name: newName,
        description: newDescription,
        isPublic: newIsPublic,
      });
      setUserPlaylistConnections((prev) => [
        { Playlist: response.data },
        ...prev,
      ]);
      setNewName('');
      setDescription('');
      setNewIsPublic(false);
    } catch (err) {
      console.error('Failed to create playlist:', err);
    } finally {
      setCreating(false);
    }
  };

  const visibleConnections = userPlaylistConnections.filter(
    (conn) => conn.Playlist
  );

  return (
    <div className="flex flex-col gap-10">
      <div
        className={`flex w-fit cursor-pointer flex-row items-center rounded-[7px] p-[5px] transition-all ${showAddPlaylist ? 'bg-badRed hover:bg-badRed/80' : 'bg-mainOrange hover:bg-mainOrange/80'}`}
        onClick={() => setShowAddPlaylist(!showAddPlaylist)}
      >
        <HugeiconsPlusSign
          className={`h-[32px] w-[32px] text-white transition-all ${showAddPlaylist ? 'rotate-45' : ''}`}
        />
      </div>
      <div
        className={`${showAddPlaylist ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'} grid overflow-hidden transition-all`}
      >
        <div className="flex min-h-0 flex-col gap-2">
          <input
            type="text"
            placeholder="New playlist name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full rounded-[7px] border border-gray-300 px-3 py-2 focus:outline-none"
            disabled={creating}
          />
          <input
            type="text"
            placeholder="Description"
            value={newDescription}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-[7px] border border-gray-300 px-3 py-2 focus:outline-none"
            disabled={creating}
          />
          <div className="flex items-center gap-4">
            <button
              onClick={handleCreate}
              disabled={creating || !newName.trim()}
              className="rounded-[7px] bg-mainOrange px-4 py-2 text-white disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create'}
            </button>
            <label className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={newIsPublic}
                onChange={(e) => setNewIsPublic(e.target.checked)}
                disabled={creating}
              />
              Public
            </label>
          </div>
        </div>
      </div>
      {isFetching ? (
        <div className="grid grid-cols-1 gap-4 main:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-[90px] animate-pulse rounded bg-gray-200"
            />
          ))}
        </div>
      ) : visibleConnections.length === 0 ? (
        <div className="flex h-[230px] flex-col items-center justify-center gap-20 rounded-[7px] border border-dashed border-mainOrange text-mainOrange">
          <StreamlineSleep className="h-[40px] w-[40px]" />
          <p>You have no playlists yet!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 main:grid-cols-2">
          {visibleConnections.map((conn) => (
            <PlaylistItem key={conn.Playlist.id} info={conn.Playlist} />
          ))}
        </div>
      )}
      <div ref={loaderRef} />
      {!hasMore && visibleConnections.length > 0 && (
        <div className="py-4 text-center text-sm text-gray-400">
          You&apos;ve reached the end!
        </div>
      )}
    </div>
  );
}
