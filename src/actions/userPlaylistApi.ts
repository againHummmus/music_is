import { supabase } from "@/lib/supabaseClient";

const USER_PLAYLIST_TABLE = "User_playlist";

const USER_PLAYLIST_SELECT = `
  *,
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
`;

export default class UserPlaylistApi {
  static async createUserPlaylist({
    userId,
    playlistId,
    isCreator,
  }: {
    userId: string;
    playlistId: string;
    isCreator: boolean;
  }) {
    const { data, error } = await supabase
      .from(USER_PLAYLIST_TABLE)
      .insert({ User: userId, Playlist: playlistId, is_creator: isCreator })
      .select(USER_PLAYLIST_SELECT)
      .single();
    if (error) throw error;
    return { data };
  }

  static async deleteUserPlaylist({ id }: { id: string }) {
    const { data, error } = await supabase
      .from(USER_PLAYLIST_TABLE)
      .delete()
      .eq("id", id)
      .select("*");
    if (error) throw error;
    return { data };
  }

  static async searchUserPlaylists({
    userId,
    playlistId,
    isCreator,
    limit = 10,
    offset = 0,
    includeDefaultPlaylists,
  }: {
    userId?: string;
    playlistId?: string;
    isCreator?: boolean;
    limit?: number;
    offset?: number;
    includeDefaultPlaylists?: boolean;
  }) {
    let query = supabase.from(USER_PLAYLIST_TABLE).select(USER_PLAYLIST_SELECT);
    if (userId) query = query.eq("User", userId);
    if (playlistId) query = query.eq("Playlist", playlistId);
    if (typeof isCreator === "boolean") query = query.eq("is_creator", isCreator);
    if (includeDefaultPlaylists === false) {
      query = query.eq("Playlist.is_default", false);
    }
    if (limit) query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;
    if (error) throw error;
    return { data };
  }
}
