'use server';

import { publicClient, requireSession, FORBIDDEN } from './session';
import {
  MUTUAL_PLAYLISTS_SELECT,
  MUTUAL_POSTS_SELECT,
  SUBSCRIPTION_SELECT,
  USER_PUBLIC_COLUMNS,
} from './types';
import type { MutualFriendRow, SubscriptionRow } from './types';

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
  return data ? [data] : [];
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

  const { data, error } = await supabase
    .from(SUB_TABLE)
    .delete()
    .eq('id', Number(id))
    .select('*');
  if (error) throw error;
  return data;
}

export async function searchSubscriptions(
  params: {
    follower?: string | number;
    followee?: string | number;
    limit?: number;
    offset?: number;
  } = {}
): Promise<SubscriptionRow[]> {
  const supabase = publicClient();

  let query = supabase.from(SUB_TABLE).select(SUBSCRIPTION_SELECT);
  if (params.follower) query = query.eq('Follower', Number(params.follower));
  if (params.followee) query = query.eq('Followee', Number(params.followee));
  if (params.limit) {
    const offset = params.offset ?? 0;
    query = query.range(offset, offset + params.limit - 1);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
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
  getPosts?: boolean;
  getPlaylists?: boolean;
}): Promise<MutualFriendRow[]> {
  const { supabase, user } = await requireSession();
  const {
    limit = 20,
    offset = 0,
    getPosts,
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

  let select = USER_PUBLIC_COLUMNS;
  if (getPosts) select += `, ${MUTUAL_POSTS_SELECT}`;
  if (getPlaylists) select += `, ${MUTUAL_PLAYLISTS_SELECT}`;

  const { data, error } = await supabase
    .from(USER_TABLE)
    .select(select)
    .in('id', mutualIds)
    .range(offset, offset + limit - 1);
  if (error) throw error;
  return (data ?? []) as unknown as MutualFriendRow[];
}
