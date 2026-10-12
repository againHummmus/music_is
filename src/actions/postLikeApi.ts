'use server';

import { requireSession } from './session';

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
  return data;
}


export async function deletePostLike({
  postId,
}: {
  postId: string | number;
}) {
  const { supabase, user } = await requireSession();

  const { error } = await supabase
    .from(POST_LIKE_TABLE)
    .delete()
    .eq('userId', user.id)
    .eq('postId', Number(postId));
  if (error) throw error;
}
