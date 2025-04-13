'use server'

import TrackApi from '@/actions/trackApi';

export async function searchTracksAction({ limit, artist }: { limit?: number; artist: string; }) {
  const response = await TrackApi.searchTracks({
    limit: limit ?? 6,
    artist,
  });
  return response.data;
}
