'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { createPlaylist } from '@/actions/playlistApi';
import { PlaylistItem } from '@/components/playlist/PlaylistItem';
import HugeiconsPlusSign from '~icons/hugeicons/plus-sign';
import { searchUserPlaylists } from '@/actions/userPlaylistApi';
import type {
  PlaylistWithTracksRow,
  UserPlaylistRow,
  UserWithArtist,
} from '@/actions/types';
import { EmptyState } from '@/components/ui/EmptyState';
import { useInfiniteList } from '@/hooks/useInfiniteList';
import { useUiStore } from '@/stores/uiStore';
import { describeError } from '@/lib/utils/describeError';

const LIMIT = 6;

const toPlaylists = (connections: UserPlaylistRow[]): PlaylistWithTracksRow[] =>
  connections.flatMap((conn) => (conn.Playlist ? [conn.Playlist] : []));

export function PlaylistsScreen({
  initialUser,
  initialPlaylists,
  openCreateForm = false,
}: {
  initialUser: UserWithArtist | null;
  initialPlaylists?: UserPlaylistRow[];
  openCreateForm?: boolean;
}) {
  const storeUser = useAuthStore((s) => s.user);
  const user = storeUser ?? initialUser;

  const [newName, setNewName] = useState('');
  const [newDescription, setDescription] = useState('');
  const [newIsPublic, setNewIsPublic] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showAddPlaylist, setShowAddPlaylist] = useState(openCreateForm);
  const setModal = useUiStore((s) => s.setModal);

  const userId = user?.id;
  const [createdPlaylists, setCreatedPlaylists] = useState<
    PlaylistWithTracksRow[]
  >([]);
  const {
    items: connections,
    hasMore,
    isLoading: isFetching,
    sentinelRef,
  } = useInfiniteList({
    fetchPage: (offset, limit) =>
      userId
        ? searchUserPlaylists({ userId, limit, offset })
        : Promise.resolve([]),
    limit: LIMIT,
    initialItems: initialPlaylists,
    enabled: Boolean(userId),
  });
  const playlists = [...createdPlaylists, ...toPlaylists(connections)];

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const created = await createPlaylist({
        name: newName,
        description: newDescription,
        isPublic: newIsPublic,
      });
      setCreatedPlaylists((prev) => [created, ...prev]);
      setNewName('');
      setDescription('');
      setNewIsPublic(false);
    } catch (err) {
      console.error('Failed to create playlist:', err);
      setModal({
        isOpen: true,
        type: 'error',
        message: `Could not create the playlist: ${describeError(err)}`,
      });
    } finally {
      setCreating(false);
    }
  };

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
      {isFetching && playlists.length === 0 ? (
        <div className="grid grid-cols-1 gap-4 main:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-[90px] animate-pulse rounded bg-gray-200"
            />
          ))}
        </div>
      ) : playlists.length === 0 ? (
        <EmptyState>You have no playlists yet!</EmptyState>
      ) : (
        <div className="grid grid-cols-1 gap-4 main:grid-cols-2">
          {playlists.map((playlist) => (
            <PlaylistItem key={playlist.id} info={playlist} />
          ))}
        </div>
      )}
      <div ref={sentinelRef} />
      {!hasMore && playlists.length > 0 && (
        <div className="py-4 text-center text-sm text-gray-400">
          You&apos;ve reached the end!
        </div>
      )}
    </div>
  );
}
