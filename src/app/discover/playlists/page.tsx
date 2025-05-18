'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useStore } from '@/app/store'
import PlaylistApi from '@/actions/playlistApi'
import { PlaylistItem } from '@/components/shared/playlist/PlaylistItem'
import HugeiconsPlusSign from '~icons/hugeicons/plus-sign';
import UserPlaylistApi from '@/actions/userPlaylistApi'

export default function MyPlaylistsBlock() {
  const { user } = useStore()

  const [newName, setNewName] = useState('')
  const [newDescription, setDescription] = useState('')
  const [newIsPublic, setNewIsPublic] = useState(false)
  const [creating, setCreating] = useState(false)
  const [showAddPlaylist, setShowAddPlaylist] = useState(false)

  const LIMIT = 12
  const [userPlaylistConnections, setUserPlaylistConnections] = useState<any[]>([])
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const isFetchingRef = useRef(false)
  const loaderRef = useRef<HTMLDivElement | null>(null)

  const loadMore = useCallback(async () => {
    if (isFetchingRef.current || !hasMore || !user?.id) return
    isFetchingRef.current = true
    try {
      const data: any = await UserPlaylistApi.searchUserPlaylists({ userId: user.id, limit: 6, offset }).then((res: any) => setUserPlaylistConnections(res.data));
      setHasMore(data.length === LIMIT)
      setOffset(prev => prev + data.length)
    } catch (err) {
      console.error('Error loading playlists:', err)
    } finally {
      isFetchingRef.current = false
    }
  }, [user?.id, offset, hasMore])


  useEffect(() => {
    loadMore()
  }, [loadMore])

  useEffect(() => {
    const node = loaderRef.current
    if (!node) return
    const obs = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMore()
        }
      },
      { rootMargin: '200px' }
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [loadMore])

  const handleCreate = async () => {
    if (!newName.trim()) return
    setCreating(true)
    try {
      const response = await PlaylistApi.createPlaylist({
        name: newName,
        description: newDescription,
        creatorId: user.id,
        isPublic: newIsPublic,
      })
      const created = response.data

      setUserPlaylistConnections(prev => [
        { Playlist: created },
        ...prev,
      ])
      setNewName('')
      setDescription('')
      setNewIsPublic(false)
    } catch (err) {
      console.error('Failed to create playlist:', err)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className='flex flex-col gap-10'>
      <div className={`flex flex-row items-center cursor-pointer rounded-[7px] w-fit p-[5px] transition-all ${showAddPlaylist ? 'bg-badRed hover:bg-badRed/80' : 'bg-mainOrange hover:bg-mainOrange/80 '}`} onClick={() => {setShowAddPlaylist(!showAddPlaylist)}}>
          <HugeiconsPlusSign className={`h-[32px] w-[32px] text-white transition-all ${showAddPlaylist ? 'rotate-45' : ''}`}/>
      </div>
      <div className={`${showAddPlaylist ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'} overflow-hidden grid transition-all`}>
        <div className="min-h-0 flex flex-col gap-2">
          <input
            type="text"
            placeholder="New playlist name"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-[7px] focus:outline-none"
            disabled={creating}
          />
          <input
            type="text"
            placeholder="Description"
            value={newDescription}
            onChange={e => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-[7px] focus:outline-none"
            disabled={creating}
          />
          <div className="flex items-center gap-4">
            <button
              onClick={handleCreate}
              disabled={creating || !newName.trim()}
              className="px-4 py-2 bg-mainOrange text-white rounded-[7px] disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create'}
            </button>
            <label className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={newIsPublic}
                onChange={e => setNewIsPublic(e.target.checked)}
                disabled={creating}
              />
              Public
            </label>
          </div>
        </div>
      </div>

      {isFetchingRef.current ? (
        <div className="grid grid-cols-1 main:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-[90px] bg-gray-200 animate-pulse rounded"
            />
          ))}
        </div>
      ) : userPlaylistConnections.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          You have no playlists yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 main:grid-cols-2 gap-4">
          {userPlaylistConnections.map(conn => (
            <PlaylistItem
              key={conn.Playlist.id}
              info={conn.Playlist}
            />
          ))}
        </div>
      )}

      <div ref={loaderRef} />

      {isFetchingRef.current && userPlaylistConnections.length > 0 && (
        <div className="text-center py-4 text-sm text-gray-500">
          Loading more…
        </div>
      )}

      {!hasMore && userPlaylistConnections.length > 0 && (
        <div className="text-center py-4 text-sm text-gray-400">
          You&apos;ve reached the end!
        </div>
      )}
    </div>
  )
}
