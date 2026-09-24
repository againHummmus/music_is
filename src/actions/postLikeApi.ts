'use server';

import { publicClient, requireSession } from './session';

const POST_LIKE_TABLE = 'Post_like';

export async function createPostLike({
  postId,
}: {
  postId: string | number;
}) {
  const { supabase, user } = await requireSession();

  const { data, error } = await supabase
    .from(POST_LIKE_TABLE)
    .insert({ userId: user.id, postId: Number(postId) })
    .select('*')
    .single();
  if (error) throw error;
  return { data };
}

export async function searchPostLikes({
  userId,
  postId,
  limit = 10,
  offset = 0,
}: {
  userId?: string | number;
  postId?: string | number;
  limit?: number;
  offset?: number;
}) {
  const supabase = publicClient();

  let query = supabase.from(POST_LIKE_TABLE).select('*');
  if (userId) query = query.eq('userId', Number(userId));
  if (postId) query = query.eq('postId', Number(postId));
  if (limit) query = query.range(offset, offset + limit - 1);

  const { data, error } = await query;
  if (error) throw error;
  return { data };
}

export async function deletePostLike({
  postId,
}: {
  postId: string | number;
}) {
  const { supabase, user } = await requireSession();

  const { data, error } = await supabase
    .from(POST_LIKE_TABLE)
    .delete()
    .eq('userId', user.id)
    .eq('postId', Number(postId))
    .select('*');
  if (error) throw error;
  return { data };
}
