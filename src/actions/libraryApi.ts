'use server';

import { requireSession } from './session';
import { TRACK_SELECT, TRACK_WITH_STATS_SELECT } from './types';
import type { TrackRow, TrackWithStatsRow } from './types';

const DEFAULT_LIMIT = 20;

async function getTracksInOrder(ids: number[]): Promise<TrackRow[]> {
  if (ids.length === 0) return [];
  const { supabase } = await requireSession();

  const { data, error } = await supabase
    .from('Track')
    .select(TRACK_SELECT)
    .in('id', ids);
  if (error) throw error;

  const rankById = new Map(ids.map((id, index) => [id, index]));
  return (data ?? []).sort(
    (a, b) => (rankById.get(a.id) ?? 0) - (rankById.get(b.id) ?? 0)
  );
}

export async function getLikedTracks(
  limit = DEFAULT_LIMIT
): Promise<TrackRow[]> {
  const { supabase, user } = await requireSession();

  const { data, error } = await supabase
    .from('Track_like')
    .select(`Track ( ${TRACK_SELECT} )`)
    .eq('userId', user.id)
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })
    .limit(limit);
  if (error) throw error;

  return (data ?? []).flatMap((like) => (like.Track ? [like.Track] : []));
}

export async function getChartTracks(
  limit = DEFAULT_LIMIT
): Promise<TrackRow[]> {
  const { supabase } = await requireSession();

  const { data, error } = await supabase.rpc('chart_tracks', {
    max_count: limit,
  });
  if (error) throw error;

  return getTracksInOrder((data ?? []).map((row) => row.track_id));
}

export async function getFriendsLikeTracks(
  limit = DEFAULT_LIMIT
): Promise<TrackRow[]> {
  const { supabase } = await requireSession();

  const { data, error } = await supabase.rpc('friends_like_tracks', {
    max_count: limit,
  });
  if (error) throw error;

  return getTracksInOrder((data ?? []).map((row) => row.track_id));
}

export async function getMyArtistTracks(): Promise<TrackWithStatsRow[]> {
  const { supabase, user } = await requireSession();
  if (!user.artistId) return [];

  const { data, error } = await supabase
    .from('Track')
    .select(TRACK_WITH_STATS_SELECT)
    .eq('artistId', user.artistId)
    .order('created_at', { ascending: false })
    .order('id', { ascending: false });
  if (error) throw error;
  return data ?? [];
}
