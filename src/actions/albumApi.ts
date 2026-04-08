import { supabase } from "@/lib/supabaseClient";
import { makeObjectKey, uploadPublicFile } from "@/lib/supabaseUtils";

const ALBUM_TABLE = "Album";

const ALBUM_SELECT = `
  *,
  Artist(*),
  Track (
    *,
    Artist(*),
    Album(*),
    Genre(*),
    Track_like(*),
    Playlist_track(*)
  )
`;

export default class AlbumApi {
  static async createAlbum({
    name,
    year,
    artistId,
    image_hash,
  }: Omit<Album, "id">) {
    const file = image_hash as unknown as File;
    const objectKey = makeObjectKey("img", file?.name);
    const { error: uploadError } = await uploadPublicFile(objectKey, file);
    if (uploadError) throw uploadError;
    const hash = objectKey.split("/").pop();

    const { data, error } = await supabase
      .from(ALBUM_TABLE)
      .insert({
        name,
        year,
        artistId,
        image_hash: hash,
      })
      .select(ALBUM_SELECT)
      .single();

    if (error) throw error;
    return { data };
  }

  static async searchAlbums({
    id,
    name,
    artistId,
    limit = 10,
    offset = 0,
  }: {
    id?: any;
    name?: string;
    artistId?: string;
    limit?: number;
    offset?: number;
  }) {
    let query = supabase.from(ALBUM_TABLE).select(ALBUM_SELECT);

    if (id) query = query.eq("id", id);
    if (name) query = query.ilike("name", `%${name}%`);
    if (artistId) query = query.eq("artistId", artistId);
    if (limit) query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;
    if (error) throw error;
    return { data };
  }
}
