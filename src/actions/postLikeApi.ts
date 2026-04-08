import { supabase } from "@/lib/supabaseClient";

const POST_LIKE_TABLE = "Post_like";

export default class PostLikeApi {
  static async createPostLike({
    userId,
    postId,
  }: {
    userId: string;
    postId: string;
  }) {
    const { data, error } = await supabase
      .from(POST_LIKE_TABLE)
      .insert({ userId, postId })
      .select("*")
      .single();
    if (error) throw error;
    return { data };
  }

  static async searchPostLikes({
    userId,
    postId,
    limit = 10,
    offset = 0,
  }: {
    userId: string;
    postId: string;
    limit: number;
    offset: number;
  }) {
    let query = supabase.from(POST_LIKE_TABLE).select("*");
    if (userId) query = query.eq("userId", userId);
    if (postId) query = query.eq("postId", postId);
    if (limit) query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;
    if (error) throw error;
    return { data };
  }

  static async deletePostLike({ userId, postId }: { userId: string; postId: string }) {
    const { data, error } = await supabase
      .from(POST_LIKE_TABLE)
      .delete()
      .eq("userId", userId)
      .eq("postId", postId)
      .select("*");
    if (error) throw error;
    return { data };
  }
}
