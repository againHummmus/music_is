import { supabase } from "@/lib/supabaseClient";

const POST_TABLE = "Post";

const POST_SELECT = `
  *,
  User:User ( id, username, avatar_url ),
  Post_like(*),
  Track (
    *,
    Album(*),
    Artist(*),
    Genre(*),
    Track_like(*),
    Playlist_track(*)
  ),
  Playlist (
    *,
    Creator:Creator ( id, username, avatar_url )
  )
`;

export default class PostApi {
  static async createPost({
    content,
    trackId,
    playlistId,
    userId,
  }: {
    content: string;
    trackId?: string;
    playlistId?: string;
    userId: string;
  }) {
    const { data, error } = await supabase
      .from(POST_TABLE)
      .insert({
        content,
        trackId: trackId ?? null,
        playlistId: playlistId ?? null,
        userId,
      })
      .select(POST_SELECT)
      .single();
    if (error) throw error;
    return data;
  }

  static async deletePost({ id }: { id: string }) {
    const { data, error } = await supabase
      .from(POST_TABLE)
      .delete()
      .eq("id", id)
      .select("*");
    if (error) throw error;
    return data;
  }

  static async searchPosts(params: any) {
    let query = supabase.from(POST_TABLE).select(POST_SELECT);
    if (params?.id) query = query.eq("id", params.id);
    if (params?.userId) query = query.eq("userId", params.userId);
    if (params?.trackId) query = query.eq("trackId", params.trackId);
    if (params?.playlistId) query = query.eq("playlistId", params.playlistId);
    if (params?.limit) {
      const offset = params?.offset ?? 0;
      query = query.range(offset, offset + params.limit - 1);
    }
    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  }

  static async getPost({ id }: { id: string }) {
    const { data, error } = await supabase
      .from(POST_TABLE)
      .select(POST_SELECT)
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  }
}
