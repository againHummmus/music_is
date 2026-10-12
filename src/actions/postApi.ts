'use server';

import { publicClient, requireSession, FORBIDDEN } from './session';
import { POST_SELECT } from './types';
import type { PostRow } from './types';

const POST_TABLE = 'Post';

export async function createPost({
  content,
  trackId,
  playlistId,
}: {
  content: string;
  trackId?: string | number;
  playlistId?: string | number;
}): Promise<PostRow> {
  const { supabase, user } = await requireSession();

  const { data, error } = await supabase
    .from(POST_TABLE)
    .insert({
      content,
      trackId: trackId ? Number(trackId) : null,
      playlistId: playlistId ? Number(playlistId) : null,
      userId: user.id,
    })
    .select(POST_SELECT)
    .single();
  if (error) throw error;
  return data;
}

export async function deletePost({ id }: { id: string | number }) {
  const { supabase, user } = await requireSession();

  const { data: post, error: postError } = await supabase
    .from(POST_TABLE)
    .select('id, userId')
    .eq('id', Number(id))
    .single();
  if (postError) throw postError;

  const canDelete = user.app_role === 'admin' || post.userId === user.id;
  if (!canDelete) throw new Error(FORBIDDEN);

  const { error } = await supabase
    .from(POST_TABLE)
    .delete()
    .eq('id', Number(id));
  if (error) throw error;
}

export async function searchPosts(params: {
  id?: string | number;
  userId?: string | number;
  trackId?: string | number;
  playlistId?: string | number;
  limit?: number;
  before?: string;
}): Promise<PostRow[]> {
  const supabase = publicClient();

  let query = supabase.from(POST_TABLE).select(POST_SELECT);
  if (params?.id) query = query.eq('id', Number(params.id));
  if (params?.userId) query = query.eq('userId', Number(params.userId));
  if (params?.trackId) query = query.eq('trackId', Number(params.trackId));
  if (params?.playlistId)
    query = query.eq('playlistId', Number(params.playlistId));
  if (params?.before) query = query.lt('created_at', params.before);
  if (params?.limit) query = query.limit(params.limit);
  query = query
    .order('created_at', { ascending: false })
    .order('id', { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getPost({
  id,
}: {
  id: string | number;
}): Promise<PostRow> {
  const supabase = publicClient();

  const { data, error } = await supabase
    .from(POST_TABLE)
    .select(POST_SELECT)
    .eq('id', Number(id))
    .single();
  if (error) throw error;
  return data;
}

export async function getFeedPosts({
  limit = 20,
  before,
}: {
  limit?: number;
  before?: string;
} = {}): Promise<PostRow[]> {
  const { supabase, user } = await requireSession();

  const { data: subscriptions, error: subscriptionsError } = await supabase
    .from('User_user_subscription')
    .select('Followee')
    .eq('Follower', user.id);
  if (subscriptionsError) throw subscriptionsError;

  const followeeIds = (subscriptions ?? [])
    .map((s) => s.Followee)
    .filter((id): id is number => id !== null);
  if (followeeIds.length === 0) return [];

  let query = supabase
    .from(POST_TABLE)
    .select(POST_SELECT)
    .in('userId', followeeIds);
  if (before) query = query.lt('created_at', before);

  const { data, error } = await query
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}
