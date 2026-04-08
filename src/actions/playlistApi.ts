import { supabase } from "@/lib/supabaseClient";

const PLAYLIST_TABLE = "Playlist";

const PLAYLIST_SELECT = `
  *,
  Creator:Creator ( id, username, avatar_url ),
  User_playlist ( id, User ),
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
`;

export default class PlaylistApi {
  static async createPlaylist({
    name,
    description,
    creatorId,
    isPublic,
  }: {
    name: string;
    description: string;
    creatorId?: string;
    isPublic?: boolean;
  }) {
    const { data, error } = await supabase
      .from(PLAYLIST_TABLE)
      .insert({
        name,
        description,
        Creator: creatorId ?? null,
        is_public: Boolean(isPublic),
        is_default: false,
      })
      .select(PLAYLIST_SELECT)
      .single();

    if (error) throw error;
    return { data };
  }

  static async deletePlaylist({ id }: { id: string }) {
    const { data, error } = await supabase
      .from(PLAYLIST_TABLE)
      .delete()
      .eq("id", id)
      .select("*");
    if (error) throw error;
    return { data };
  }

  static async searchPlaylists({
    id,
    name,
    creatorId,
    isPublic,
    isDefault,
    limit,
    offset = 0,
  }: {
    id?: string;
    name?: string;
    creatorId?: string;
    isPublic?: boolean;
    isDefault?: boolean;
    limit?: number;
    offset?: number;
  }) {
    let query = supabase.from(PLAYLIST_TABLE).select(PLAYLIST_SELECT);
    if (id) query = query.eq("id", id);
    if (name) query = query.ilike("name", `%${name}%`);
    if (creatorId) query = query.eq("Creator", creatorId);
    if (typeof isPublic === "boolean") query = query.eq("is_public", isPublic);
    if (typeof isDefault === "boolean") query = query.eq("is_default", isDefault);
    if (limit) query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  }
}
