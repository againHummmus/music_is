'use server';

import { publicClient, requireSession, FORBIDDEN } from './session';
import { MUTUAL_PLAYLISTS_SELECT, USER_CARD_SELECT } from './types';
import type { MutualFriendRow } from './types';

const SUB_TABLE = 'User_user_subscription';
const USER_TABLE = 'User';

export async function createSubscription({
  followee,
}: {
  followee: string | number;
}) {
  const { supabase, user } = await requireSession();

  const { data, error } = await supabase
    .from(SUB_TABLE)
    .insert({ Follower: user.id, Followee: Number(followee) })
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

export async function deleteSubscription({ id }: { id: string | number }) {
  const { supabase, user } = await requireSession();

  const { data: sub, error: subError } = await supabase
    .from(SUB_TABLE)
    .select('id, Follower')
    .eq('id', Number(id))
    .single();
  if (subError) throw subError;
  if (sub.Follower !== user.id) throw new Error(FORBIDDEN);

  const { error } = await supabase
    .from(SUB_TABLE)
    .delete()
    .eq('id', Number(id));
  if (error) throw error;
}

export async function findSubscriptionId({
  follower,
  followee,
}: {
  follower: string | number;
  followee: string | number;
}): Promise<number | null> {
  const supabase = publicClient();

  const { data, error } = await supabase
    .from(SUB_TABLE)
    .select('id')
    .eq('Follower', Number(follower))
    .eq('Followee', Number(followee))
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data?.id ?? null;
}

export async function countFollowers({
  followee,
}: {
  followee: string | number;
}): Promise<number> {
  const supabase = publicClient();

  const { count, error } = await supabase
    .from(SUB_TABLE)
    .select('id', { count: 'exact', head: true })
    .eq('Followee', Number(followee));
  if (error) throw error;
  return count ?? 0;
}

export async function searchMutualFriends(params?: {
  limit?: number;
  offset?: number;
  getPlaylists?: boolean;
}): Promise<MutualFriendRow[]> {
  const { supabase, user } = await requireSession();
  const {
    limit = 20,
    offset = 0,
    getPlaylists,
  } = params ?? {};

  const [
    { data: following, error: followingError },
    { data: followers, error: followersError },
  ] = await Promise.all([
    supabase.from(SUB_TABLE).select('Followee').eq('Follower', user.id),
    supabase.from(SUB_TABLE).select('Follower').eq('Followee', user.id),
  ]);

  if (followingError) throw followingError;
  if (followersError) throw followersError;

  const followingIds = new Set<number>(
    (following ?? [])
      .map((f) => f.Followee)
      .filter((v): v is number => v !== null)
  );
  const mutualIds = (followers ?? [])
    .map((f) => f.Follower)
    .filter((id): id is number => id !== null && followingIds.has(id));

  if (mutualIds.length === 0) return [];

  const select = getPlaylists
    ? `${USER_CARD_SELECT}, ${MUTUAL_PLAYLISTS_SELECT}`
    : USER_CARD_SELECT;

  let query = supabase
    .from(USER_TABLE)
    .select(select)
    .in('id', mutualIds)
    .eq('viewerSubscription.Follower', user.id)
    .order('id')
    .range(offset, offset + limit - 1);
  if (getPlaylists) {
    query = query.eq('User_playlist.Playlist.is_public', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as MutualFriendRow[];
}
