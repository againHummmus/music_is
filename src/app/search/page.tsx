'use client'

import { useState, useEffect } from 'react'
import TrackApi from '@/actions/trackApi'
import PlaylistApi from '@/actions/playlistApi'
import UserApi from '@/actions/userApi'

import { Track } from '@/components/shared/track/TrackItem'
import { PlaylistItem } from '@/components/shared/playlist/PlaylistItem'
import HugeiconsSpinner01 from '~icons/uil/spinner?width=32px&height=32px'
import { User } from '@/components/shared/user/UserItem'

type Tab = 'tracks' | 'playlists' | 'users'

export default function SearchPage() {
  const [tab, setTab] = useState<Tab>('tracks')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 20

  useEffect(() => {
    setPage(1)
    setResults([])
  }, [tab, query])

  useEffect(() => {
    if (query.trim() === '') {
      setResults([])
      return
    }
    let cancelled = false
    setLoading(true)

    const offset = (page - 1) * PAGE_SIZE
    const params = { 
      name: query, 
      username: query,
      limit: PAGE_SIZE, 
      offset 
    }

    const loader = {
      tracks: () => TrackApi.searchTracks(params),
      playlists: () => PlaylistApi.searchPlaylists(params),
      users: () => UserApi.searchUsers(params)
    }[tab]

    loader()
      .then((res: any) => {
        if (cancelled) return
        const data = res.data ?? res
        setResults(prev => page === 1 ? data : [...prev, ...data])
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [tab, query, page])

  return (
    <div className='flex flex-col gap-20'>
      <h1 className="text-[30px] font-bold mb-[22px]">Search</h1>

      <div className="flex space-x-4">
        {(['tracks','playlists','users'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded ${
              tab === t ? 'bg-mainOrange text-white' : 'bg-gray-200'
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Type to search..."
        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-mainOrange"
      />

      {loading && (
        <div className="flex justify-center py-4 text-mainOrange">
          <HugeiconsSpinner01 className="animate-spin" />
        </div>
      )}

      {!loading && results.length === 0 && query && (
        <div className="text-center text-gray-500 py-4">
          Nothing found.
        </div>
      )}

      <div className="space-y-10">
        {results.map((item, i) => {
          switch (tab) {
            case 'tracks':
              return <Track key={item.id} info={item} className="" />
            case 'playlists':
              return <div className='flex justify-center'><PlaylistItem key={item.id} info={item} /></div>
            case 'users':
              return <User key={item.id} user={item} />
          }
        })}
      </div>

      {results.length === PAGE_SIZE && !loading && (
        <div className="flex justify-center">
          <button
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 bg-mainOrange text-white rounded"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  )
}
