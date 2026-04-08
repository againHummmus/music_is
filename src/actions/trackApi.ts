import { supabase } from "@/lib/supabaseClient";
import { makeObjectKey, uploadPublicFile } from "@/lib/supabaseUtils";

const TRACK_TABLE = "Track";
const TRACK_LIKE_TABLE = "Track_like";

const TRACK_SELECT = `
  *,
  Album(*),
  Artist(*),
  Genre(*),
  Track_like(*),
  Playlist_track(*)
`;

export default class TrackApi {
  static async createTrack({
    genreId,
    artistId,
    albumId,
    name,
    lyrics,
    isAddedByUser,
    file,
  }: {
    genreId: string;
    artistId: string;
    albumId: string;
    name: string;
    lyrics?: string;
    isAddedByUser: boolean;
    file: File;
  }) {
    const objectKey = makeObjectKey("mp3", file?.name);
    const { error: uploadError } = await uploadPublicFile(objectKey, file);
    if (uploadError) throw uploadError;
    const hash = objectKey.split("/").pop();

    const { data, error } = await supabase
      .from(TRACK_TABLE)
      .insert({
        genreId,
        artistId,
        albumId,
        name,
        lyrics: lyrics ?? null,
        isAddedByUser,
        file_hash: hash,
      })
      .select(TRACK_SELECT)
      .single();

    if (error) throw error;
    return { data };
  }

  static async searchTracks({
    id,
    genre,
    artist,
    album,
    likedByUserId,
    name,
    limit = 10,
    offset = 0,
  }: {
    id?: string;
    genre?: string;
    artist?: string;
    album?: string;
    likedByUserId?: string;
    name?: string;
    limit?: number;
    offset?: number;
  }) {
    let idsFilter: number[] | null = null;

    if (likedByUserId) {
      const { data: likes, error: likesError } = await supabase
        .from(TRACK_LIKE_TABLE)
        .select("trackId")
        .eq("userId", likedByUserId);
      if (likesError) throw likesError;
      idsFilter = likes?.map((l: any) => l.trackId) ?? [];
      if (idsFilter.length === 0) return { data: [] };
    }

    let query = supabase.from(TRACK_TABLE).select(TRACK_SELECT);
    if (id) query = query.eq("id", id);
    if (genre) query = query.eq("genreId", genre);
    if (artist) query = query.eq("artistId", artist);
    if (album) query = query.eq("albumId", album);
    if (name) query = query.ilike("name", `%${name}%`);
    if (idsFilter) query = query.in("id", idsFilter);
    if (limit) query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;
    if (error) throw error;
    return { data };
  }

  static async deleteTrack(trackId: string) {
    if (!trackId) {
      throw new Error("Track ID is required for deletion.");
    }

    const { data, error } = await supabase
      .from(TRACK_TABLE)
      .delete()
      .eq("id", trackId)
      .select("*");
    if (error) throw error;
    return { data };
  }
}
