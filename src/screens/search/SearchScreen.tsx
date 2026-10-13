'use client';

import { useSearch } from '@/hooks/useSearch';
import type { SearchTab } from '@/hooks/useSearch';
import { TrackItem } from '@/components/track/TrackItem';
import { PlaylistItem } from '@/components/playlist/PlaylistItem';
import HugeiconsSpinner01 from '~icons/uil/spinner?width=32px&height=32px';
import { UserItem } from '@/components/user/UserItem';

const TABS: SearchTab[] = ['tracks', 'playlists', 'users'];

export function SearchScreen() {
  const {
    tab,
    setTab,
    query,
    setQuery,
    trackResults,
    playlistResults,
    userResults,
    loading,
    setPage,
    hasMore,
    totalResults,
  } = useSearch();

  return (
    <div className="flex flex-col gap-20">
      <h1 className="mb-[22px] text-[30px] font-bold">Search</h1>

      <div className="flex space-x-4">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded px-4 py-2 ${tab === t ? 'bg-mainOrange text-white' : 'bg-gray-200'}`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type to search..."
        className="w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-mainOrange"
      />

      {loading && (
        <div className="flex justify-center py-4 text-mainOrange">
          <HugeiconsSpinner01 className="animate-spin" />
        </div>
      )}

      {!loading && totalResults === 0 && query && (
        <div className="py-4 text-center text-gray-500">Nothing found.</div>
      )}

      {tab === 'tracks' && (
        <div className="space-y-10">
          {trackResults.map((item) => (
            <TrackItem key={item.id} info={item} className="" />
          ))}
        </div>
      )}

      {tab === 'playlists' && (
        <div className="space-y-10">
          {playlistResults.map(
            (item) =>
              item.is_public === true && (
                <div key={item.id} className="flex justify-center">
                  <PlaylistItem info={item} />
                </div>
              )
          )}
        </div>
      )}

      {tab === 'users' && (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,250px))] gap-10">
          {userResults.map((item) => (
            <UserItem key={item.id} user={item} />
          ))}
        </div>
      )}

      {hasMore && !loading && (
        <div className="flex justify-center">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="rounded bg-mainOrange px-4 py-2 text-white"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}
