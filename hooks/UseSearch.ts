import { useState, useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { searchTracks } from '@/actions/trackApi';
import { searchPlaylists } from '@/actions/playlistApi';
import { searchUsers } from '@/actions/userApi';
import type { TrackRow } from '@/actions/types';
import type { PlaylistRow } from '@/actions/types';
import type { UserBasicRow } from '@/actions/types';

export type SearchTab = 'tracks' | 'playlists' | 'users';

const PAGE_SIZE = 20;

export const useSearch = () => {
  const [tab, setTab] = useState<SearchTab>('tracks');
  const [query, setQuery] = useState('');
  const [trackResults, setTrackResults] = useState<TrackRow[]>([]);
  const [playlistResults, setPlaylistResults] = useState<PlaylistRow[]>([]);
  const [userResults, setUserResults] = useState<UserBasicRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const resetResults = () => {
    setPage(1);
    setTrackResults([]);
    setPlaylistResults([]);
    setUserResults([]);
  };

  const changeTab = (next: SearchTab) => {
    resetResults();
    setLoading(query.trim() !== '');
    setTab(next);
  };

  const changeQuery = (next: string) => {
    resetResults();
    setLoading(next.trim() !== '');
    setQuery(next);
  };

  const changePage: Dispatch<SetStateAction<number>> = (next) => {
    setLoading(true);
    setPage(next);
  };

  useEffect(() => {
    if (query.trim() === '') return;
    let cancelled = false;
    const offset = (page - 1) * PAGE_SIZE;

    const run = async () => {
      try {
        if (tab === 'tracks') {
          const { data } = await searchTracks({
            name: query,
            limit: PAGE_SIZE,
            offset,
          });
          if (!cancelled)
            setTrackResults((prev) =>
              page === 1 ? (data ?? []) : [...prev, ...(data ?? [])]
            );
        } else if (tab === 'playlists') {
          const data = await searchPlaylists({
            name: query,
            limit: PAGE_SIZE,
            offset,
          });
          if (!cancelled)
            setPlaylistResults((prev) =>
              page === 1 ? data : [...prev, ...data]
            );
        } else {
          const data = await searchUsers({
            username: query,
            name: query,
            limit: PAGE_SIZE,
            offset,
          });
          if (!cancelled)
            setUserResults((prev) => (page === 1 ? data : [...prev, ...data]));
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [tab, query, page]);

  const results =
    tab === 'tracks'
      ? trackResults.length
      : tab === 'playlists'
        ? playlistResults.length
        : userResults.length;

  return {
    tab,
    setTab: changeTab,
    query,
    setQuery: changeQuery,
    trackResults,
    playlistResults,
    userResults,
    loading,
    page,
    setPage: changePage,
    PAGE_SIZE,
    totalResults: results,
  };
};
