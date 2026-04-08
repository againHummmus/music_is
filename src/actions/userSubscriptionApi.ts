import { supabase } from "@/lib/supabaseClient";

const SUB_TABLE = "User_user_subscription";
const USER_TABLE = "User";

const PLAYLIST_SELECT = `
  User_playlist (
    id,
    is_creator,
    Playlist (
      *,
      Creator:Creator ( id, username, avatar_url ),
      Playlist_track (
        *,
        Track (
          *,
          Album(*),
          Artist(*),
          Genre(*),
          Track_like(*),
          Playlist_track(*)
        )
      )
    )
  )
`;

const POSTS_SELECT = `
  Post (
    *,
    Post_like(*)
  )
`;

export default class SubscriptionApi {
  static async createSubscription({
    follower,
    followee,
  }: {
    follower: string;
    followee: string;
  }) {
    const { data, error } = await supabase
      .from(SUB_TABLE)
      .insert({ Follower: follower, Followee: followee })
      .select("*")
      .single();
    if (error) throw error;
    return data ? [data] : [];
  }

  static async deleteSubscription({ id }: { id: string }) {
    const { data, error } = await supabase
      .from(SUB_TABLE)
      .delete()
      .eq("id", id)
      .select("*");
    if (error) throw error;
    return data;
  }

  static async searchSubscriptions(
    params: { follower?: string; followee?: string; limit?: number; offset?: number } = {}
  ) {
    let query = supabase.from(SUB_TABLE).select(`
      *,
      Followee:Followee (
        *,
        Post (
          *,
          Post_like(*)
        )
      )
    `);
    if (params.follower) query = query.eq("Follower", params.follower);
    if (params.followee) query = query.eq("Followee", params.followee);
    if (params.limit) {
      const offset = params.offset ?? 0;
      query = query.range(offset, offset + params.limit - 1);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  }

  static async searchMutualFriends(params: {
    userId: string;
    limit?: number;
    offset?: number;
    getPosts?: boolean;
    getPlaylists?: boolean;
  }) {
    const { userId, limit = 20, offset = 0, getPosts, getPlaylists } = params;

    const [{ data: following, error: followingError }, { data: followers, error: followersError }] =
      await Promise.all([
        supabase.from(SUB_TABLE).select("Followee").eq("Follower", userId),
        supabase.from(SUB_TABLE).select("Follower").eq("Followee", userId),
      ]);

    if (followingError) throw followingError;
    if (followersError) throw followersError;

    const followingIds = new Set((following ?? []).map((f: any) => f.Followee));
    const mutualIds = (followers ?? [])
      .map((f: any) => f.Follower)
      .filter((id: any) => followingIds.has(id));

    if (mutualIds.length === 0) return [];

    let select = "*";
    if (getPosts) select += `, ${POSTS_SELECT}`;
    if (getPlaylists) select += `, ${PLAYLIST_SELECT}`;

    let query = supabase
      .from(USER_TABLE)
      .select(select)
      .in("id", mutualIds)
      .range(offset, offset + limit - 1);

    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  }
}