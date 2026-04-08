import { supabase } from "@/lib/supabaseClient";

const TRACK_LIKE_TABLE = "Track_like";

export default class TrackLikeApi {
  static async createTrackLike({
    userId,
    trackId,
  }: {
    userId: string;
    trackId: string;
  }) {
    const { data, error } = await supabase
      .from(TRACK_LIKE_TABLE)
      .insert({ userId, trackId })
      .select("*")
      .single();
    if (error) throw error;
    return { data };
  }

  static async searchTrackLikes({
    userId,
    trackId,
    limit = 10,
    offset = 0,
  }: {
    userId: string;
    trackId: string;
    limit: number;
    offset: number;
  }) {
    let query = supabase.from(TRACK_LIKE_TABLE).select("*");
    if (userId) query = query.eq("userId", userId);
    if (trackId) query = query.eq("trackId", trackId);
    if (limit) query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;
    if (error) throw error;
    return { data };
  }

  static async deleteTrackLike({ userId, trackId }: { userId: string; trackId: string }) {
    const { data, error } = await supabase
      .from(TRACK_LIKE_TABLE)
      .delete()
      .eq("userId", userId)
      .eq("trackId", trackId)
      .select("*");
    if (error) throw error;
    return { data };
  }
}
