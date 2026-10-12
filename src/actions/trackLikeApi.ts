'use server';

import { requireSession } from './session';

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
  return data;
}


export async function deleteTrackLike({
  trackId,
}: {
  trackId: string | number;
}) {
  const { supabase, user } = await requireSession();

  const { error } = await supabase
    .from(TRACK_LIKE_TABLE)
    .delete()
    .eq('userId', user.id)
    .eq('trackId', Number(trackId));
  if (error) throw error;
}

export async function getMyLikedTrackIds(): Promise<number[]> {
  const { supabase, user } = await requireSession();

  const { data, error } = await supabase
    .from(TRACK_LIKE_TABLE)
    .select('trackId')
    .eq('userId', user.id);
  if (error) throw error;
  return (data ?? [])
    .map((like) => like.trackId)
    .filter((id): id is number => id !== null);
}
