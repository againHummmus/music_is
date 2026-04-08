import { supabase } from "@/lib/supabaseClient";

const PLAYLIST_TRACK_TABLE = "Playlist_track";

const PLAYLIST_TRACK_SELECT = `
  *,
    Track (
      *,
      Album(*),
      Artist(*),
      Genre(*),
      Track_like(*),
      Playlist_track(*)
    )
`;

export default class PlaylistTrackApi {
  static async createPlaylistTrack({
    trackId,
    playlistId,
  }: {
    trackId: string;
    playlistId: string;
  }) {
    const { data, error } = await supabase
      .from(PLAYLIST_TRACK_TABLE)
      .insert({ trackId, playlistId })
      .select(PLAYLIST_TRACK_SELECT)
      .single();
    if (error) throw error;
    return { data };
  }

  static async deletePlaylistTrack({ id }: { id: string }) {
    const { data, error } = await supabase
      .from(PLAYLIST_TRACK_TABLE)
      .delete()
      .eq("id", id)
      .select("*");
    if (error) throw error;
    return { data };
  }

  static async searchPlaylistTracks({
    playlistId,
    trackId,
    limit = 10,
    offset = 0,
  }: {
    playlistId?: string;
    trackId?: string;
    limit?: number;
    offset?: number;
  }) {
    let query = supabase.from(PLAYLIST_TRACK_TABLE).select(PLAYLIST_TRACK_SELECT);
    if (playlistId) query = query.eq("playlistId", playlistId);
    if (trackId) query = query.eq("trackId", trackId);
    if (limit) query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;
    if (error) throw error;
    return { data };
  }
}
