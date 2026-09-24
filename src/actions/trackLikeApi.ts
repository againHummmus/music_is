'use server';

import { publicClient, requireSession } from './session';

const TRACK_LIKE_TABLE = 'Track_like';

export async function createTrackLike({
  trackId,
}: {
  trackId: string | number;
}) {
  const { supabase, user } = await requireSession();

  const { data, error } = await supabase
    .from(TRACK_LIKE_TABLE)
    .insert({ userId: user.id, trackId: Number(trackId) })
    .select('*')
    .single();
  if (error) throw error;
  return { data };
}

export async function searchTrackLikes({
  userId,
  trackId,
  limit = 10,
  offset = 0,
}: {
  userId?: string | number;
  trackId?: string | number;
  limit?: number;
  offset?: number;
}) {
  const supabase = publicClient();

  let query = supabase.from(TRACK_LIKE_TABLE).select('*');
  if (userId) query = query.eq('userId', Number(userId));
  if (trackId) query = query.eq('trackId', Number(trackId));
  if (limit) query = query.range(offset, offset + limit - 1);

  const { data, error } = await query;
  if (error) throw error;
  return { data };
}

export async function deleteTrackLike({
  trackId,
}: {
  trackId: string | number;
}) {
  const { supabase, user } = await requireSession();

  const { data, error } = await supabase
    .from(TRACK_LIKE_TABLE)
    .delete()
    .eq('userId', user.id)
    .eq('trackId', Number(trackId))
    .select('*');
  if (error) throw error;
  return { data };
}
