'use client'

import { useState, useEffect } from 'react'
import { useStore } from '@/app/store'
import HugeiconsPlaylist01 from '~icons/hugeicons/playlist-01?width=24px&height=24px'
import HugeiconsArrowUp02 from '~icons/hugeicons/arrow-up-02'
import HugeiconsDelete02 from '~icons/hugeicons/delete-02?width=48px&height=48px';
import PlaylistTrackApi from '@/actions/playlistTrackApi'
import UserPlaylistApi from '@/actions/userPlaylistApi'
import TrackApi from '@/actions/trackApi'

const ActionTypes = {
  AddToPlaylist: 'addToPlaylist',
  Delete: 'delete',
  ConfirmDelete: 'confirmDelete',
} as const
type ActionType = typeof ActionTypes[keyof typeof ActionTypes]

export function TrackActions({
  setMenuOpen,
  setDeletedTrack
}: {
  setMenuOpen: (open: boolean) => void,
  setDeletedTrack: (track: any) => void
}) {
  const store = useStore()
  const track = store.chosenTrack

  const [userPlaylistConnections, setUserPlaylistConnections] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [action, setAction] = useState<ActionType | undefined>(undefined)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!store.user?.id) return
    (async function () {
      setLoading(true)
      await UserPlaylistApi.searchUserPlaylists({ userId: store.user.id, includeDefaultPlaylists: false })
        .then((res: any) => setUserPlaylistConnections(res.data))
        .catch(console.error)
        .finally(() => setLoading(false))
    })()
  }, [store.user?.id])

  const handleAdd = async (playlist: any) => {
    if (!track) return
    try {
      await PlaylistTrackApi.createPlaylistTrack({
        trackId: track.id,
        playlistId: playlist.id,
      })
      setMenuOpen(false)
    } catch (err) {
      console.error('Failed to add track to playlist:', err)
    }
  }

  const handleDelete = async () => {
    if (!track || isDeleting) return 
    setIsDeleting(true) 
    try {
      await TrackApi.deleteTrack(track.id)
      setMenuOpen(false);

    } catch (err) {
      console.error('Failed to delete track:', err)
    } finally {
      setIsDeleting(false)
      setDeletedTrack(track.id)
    }
  }

  const isAuthor = track.Artist.User[0]?.id === store.user?.id || false;
  const isAdmin = store.user?.app_role === 'admin' || false

  const renderActionBlock = () => {
    switch (action) {
      case ActionTypes.AddToPlaylist:
        return (
          <>
            <div className="w-full" onClick={(e) => { e.stopPropagation(); setAction(undefined) }}>
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
                    className="h-6 bg-gray-200 animate-pulse rounded"
                  />
                ))}
              </div>
            ) : userPlaylistConnections.length === 0 ? (
              <p className="px-2 py-1 text-sm text-gray-500">
                You have no playlists
              </p>
            ) : (
              userPlaylistConnections.map(pl => (
                <button
                  key={pl.Playlist.id}
                  onClick={() => handleAdd(pl.Playlist)}
                  className="group w-full flex items-center gap-2 px-2 py-1 text-left text-sm hover:bg-mainBlack/[3%] rounded"
                >
                  <span className="truncate text-mainBlack group-hover:text-mainOrange transition-all">
                    {pl.Playlist.name}
                  </span>
                </button>
              ))
            )}
          </>
        )
      case ActionTypes.ConfirmDelete:
        return (
          <>
            <div className="w-full" onClick={(e) => { e.stopPropagation(); setAction(undefined) }}>
              <HugeiconsArrowUp02 className="-rotate-90 cursor-pointer hover:text-mainOrange" />
            </div>
            <p className="px-2 py-1 text-sm font-medium text-red-600">
              Are you sure you want to delete "{track?.name}"?
            </p>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="w-full text-left text-sm p-2 hover:bg-red-100 flex flex-row gap-5 items-center rounded text-red-600 font-semibold"
            >
              {isDeleting ? 'Deleting...' : 'Yes, delete it'}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setAction(undefined) }}
              disabled={isDeleting}
              className="w-full text-left text-sm p-2 hover:bg-gray-100 flex flex-row gap-5 items-center rounded"
            >
              Cancel
            </button>
          </>
        )
      default:
        return (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); setAction(ActionTypes.AddToPlaylist) }}
              className="w-full text-left text-sm p-2 hover:bg-gray-100 flex flex-row gap-5 items-center rounded"
            >
              <HugeiconsPlaylist01 className="w-[25px] h-[25px]" />
              <span className="whitespace-nowrap">Add to playlist</span>
            </button>
            {(isAuthor || isAdmin) && (
              <button
                onClick={(e) => { e.stopPropagation(); setAction(ActionTypes.ConfirmDelete) }}
                className="w-full text-left text-sm p-2 hover:bg-red-50 flex flex-row gap-5 items-center rounded text-red-600"
              >
                <HugeiconsDelete02 className="w-[25px] h-[25px]" />
                <span className="whitespace-nowrap">Delete track</span>
              </button>
            )}
          </>
        )
    }
  }

  return <>{renderActionBlock()}</>
}