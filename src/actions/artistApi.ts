import { supabase } from "@/lib/supabaseClient";
import { makeObjectKey, uploadPublicFile } from "@/lib/supabaseUtils";

const ARTIST_TABLE = "Artist";
const USER_TABLE = "User";

export default class ArtistApi {
  static async createArtist({
    name,
    userId,
    image,
  }: { name: string; userId?: string; image: File }) {
    const objectKey = makeObjectKey("img", image?.name);
    const { error: uploadError } = await uploadPublicFile(objectKey, image);
    if (uploadError) throw uploadError;
    const hash = objectKey.split("/").pop();

    const { data: artist, error } = await supabase
      .from(ARTIST_TABLE)
      .insert({ name, image_hash: hash })
      .select("*")
      .single();

    if (error) throw error;

    if (userId && artist?.id) {
      const { error: userError } = await supabase
        .from(USER_TABLE)
        .update({ artistId: artist.id, app_role: "artist" })
        .eq("id", userId);
      if (userError) throw userError;
    }

    return { data: artist };
  }

  static async searchArtists({
    id,
    name,
    limit = 10,
    offset = 0,
  }: {
    id?: string;
    name?: string;
    limit?: number;
    offset?: number;
  }) {
    let query = supabase.from(ARTIST_TABLE).select("*");
    if (id) query = query.eq("id", id);
    if (name) query = query.ilike("name", `%${name}%`);
    if (limit) query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;
    if (error) throw error;
    return { data };
  }
}
