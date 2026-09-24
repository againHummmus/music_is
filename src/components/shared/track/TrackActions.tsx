'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useUiStore } from '@/stores/uiStore';
import HugeiconsPlaylist01 from '~icons/hugeicons/playlist-01?width=24px&height=24px';
import HugeiconsArrowUp02 from '~icons/hugeicons/arrow-up-02';
import HugeiconsDelete02 from '~icons/hugeicons/delete-02?width=48px&height=48px';
import { createPlaylistTrack } from '@/actions/playlistTrackApi';
import { searchUserPlaylists } from '@/actions/userPlaylistApi';
import { deleteTrack } from '@/actions/trackApi';

const ActionTypes = {
  AddToPlaylist: 'addToPlaylist',
  Delete: 'delete',
  ConfirmDelete: 'confirmDelete',
} as const;
type ActionType = (typeof ActionTypes)[keyof typeof ActionTypes];

export function TrackActions({
  setMenuOpen,
  setDeletedTrack,
}: {
  setMenuOpen: (open: boolean) => void;
  setDeletedTrack: (track: any) => void;
}) {
  const chosenTrack = useUiStore((s) => s.chosenTrack);
  const user = useAuthStore((s) => s.user);
  const track = chosenTrack;

  const [userPlaylistConnections, setUserPlaylistConnections] = useState<any[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState<ActionType | undefined>(undefined);
  const [isDeleting, setIsDeleting] = useState(false);

  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;
    (async function () {
      setLoading(true);
      await searchUserPlaylists({
        userId,
        includeDefaultPlaylists: false,
      })
        .then((res: any) => setUserPlaylistConnections(res.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    })();
  }, [userId]);

  const handleAdd = async (playlist: any) => {
    if (!track) return;
    try {
      await createPlaylistTrack({
        trackId: track.id,
        playlistId: playlist.id,
      });
      setMenuOpen(false);
    } catch (err) {
      console.error('Failed to add track to playlist:', err);
    }
  };

  const handleDelete = async () => {
    if (!track || isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteTrack(track.id);
      setMenuOpen(false);
    } catch (err) {
      console.error('Failed to delete track:', err);
    } finally {
      setIsDeleting(false);
      setDeletedTrack(track.id);
    }
  };

  if (!track) return null;

  const currentArtistId = user?.artistId;
  const isAuthor =
    currentArtistId != null && currentArtistId === track.artistId;
  const isAdmin = user?.app_role === 'admin';

  const renderActionBlock = () => {
    switch (action) {
      case ActionTypes.AddToPlaylist:
        return (
          <>
            <div
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                setAction(undefined);
              }}
            >
              <HugeiconsArrowUp02 className="-rotate-90 cursor-pointer hover:text-mainOrange" />
            </div>
            <p className="px-2 py-1 text-sm font-medium">
              Add {track?.name} to:
            </p>
            {loading ? (
              <div className="space-y-2 px-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-6 animate-pulse rounded bg-gray-200"
                  />
                ))}
              </div>
            ) : userPlaylistConnections.length === 0 ? (
              <p className="px-2 py-1 text-sm text-gray-500">
                You have no playlists
              </p>
            ) : (
              userPlaylistConnections.map((pl) => (
                <button
                  key={pl.Playlist.id}
                  onClick={() => handleAdd(pl.Playlist)}
                  className="group flex w-full items-center gap-2 rounded px-2 py-1 text-left text-sm hover:bg-mainBlack/[3%]"
                >
                  <span className="truncate text-mainBlack transition-all group-hover:text-mainOrange">
                    {pl.Playlist.name}
                  </span>
                </button>
              ))
            )}
          </>
        );
      case ActionTypes.ConfirmDelete:
        return (
          <>
            <div
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                setAction(undefined);
              }}
            >
              <HugeiconsArrowUp02 className="-rotate-90 cursor-pointer hover:text-mainOrange" />
            </div>
            <p className="px-2 py-1 text-sm font-medium text-red-600">
              Are you sure you want to delete &quot;{track?.name}&quot;?
            </p>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex w-full flex-row items-center gap-5 rounded p-2 text-left text-sm font-semibold text-red-600 hover:bg-red-100"
            >
              {isDeleting ? 'Deleting...' : 'Yes, delete it'}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setAction(undefined);
              }}
              disabled={isDeleting}
              className="flex w-full flex-row items-center gap-5 rounded p-2 text-left text-sm hover:bg-gray-100"
            >
              Cancel
            </button>
          </>
        );
      default:
        return (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setAction(ActionTypes.AddToPlaylist);
              }}
              className="flex w-full flex-row items-center gap-5 rounded p-2 text-left text-sm hover:bg-gray-100"
            >
              <HugeiconsPlaylist01 className="h-[25px] w-[25px]" />
              <span className="whitespace-nowrap">Add to playlist</span>
            </button>
            {(isAuthor || isAdmin) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setAction(ActionTypes.ConfirmDelete);
                }}
                className="flex w-full flex-row items-center gap-5 rounded p-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                <HugeiconsDelete02 className="h-[25px] w-[25px]" />
                <span className="whitespace-nowrap">Delete track</span>
              </button>
            )}
          </>
        );
    }
  };

  return <>{renderActionBlock()}</>;
}
