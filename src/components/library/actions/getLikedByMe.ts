'use server'

import TrackApi from '@/actions/trackApi';

export async function getLikedByMe({ limit, likedByUserId }: { limit?: number; likedByUserId: string; }) {
  const response = await TrackApi.searchTracks({
    limit: limit ?? 6,
    likedByUserId,
  });
  return response.data;
}
