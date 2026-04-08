import { supabase } from "@/lib/supabaseClient";

const GENRE_TABLE = "Genre";

export default class GenreApi {
  static async createGenre({ name }: { name: string }) {
    const { data, error } = await supabase
      .from(GENRE_TABLE)
      .insert({ name })
      .select("*")
      .single();
    if (error) throw error;
    return { data };
  }

  static async searchGenres({
    name = "",
    limit = 10,
    offset = 0,
  }: {
    name?: string;
    limit?: number;
    offset?: number;
  }) {
    let query = supabase.from(GENRE_TABLE).select("*");
    if (name) query = query.ilike("name", `%${name}%`);
    if (limit) query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;
    if (error) throw error;
    return { data };
  }
}
