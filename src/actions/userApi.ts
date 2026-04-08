import { supabase } from "@/lib/supabaseClient";
import { makeObjectKey, uploadPublicFile } from "@/lib/supabaseUtils";

const USER_TABLE = "User";

const USER_SELECT = `
  *,
  Artist(*),
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

export default class UserApi {
  static async getMe() {
    const { data: sessionData } = await supabase.auth.getSession();
    const sbUserId = sessionData?.session?.user?.id;
    if (!sbUserId) return null;

    const { data, error } = await supabase
      .from(USER_TABLE)
      .select("*, Artist(*)")
      .eq("sbUserId", sbUserId)
      .single();

    if (error) return null;
    return data;
  }

  static async getUser({ id }: { id: string }) {
    const { data, error } = await supabase
      .from(USER_TABLE)
      .select(USER_SELECT)
      .eq("id", id)
      .single();

    if (error) return null;
    return data;
  }

  static async searchUsers(params?: any) {
    let query = supabase.from(USER_TABLE).select("*");

    if (params?.id) query = query.eq("id", params.id);
    const usernameQuery = params?.username ?? params?.name;
    if (usernameQuery) query = query.ilike("username", `%${usernameQuery}%`);
    if (params?.limit) {
      const offset = params?.offset ?? 0;
      query = query.range(offset, offset + params.limit - 1);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { data: true };
  }

  static async updateUser({
    file,
    newUsername,
    userId,
  }: {
    file?: File;
    newUsername?: string;
    userId: string;
  }) {
    const updates: any = {};
    if (newUsername) updates.username = newUsername;

    if (file) {
      const objectKey = makeObjectKey("img", file.name);
      const { error: uploadError } = await uploadPublicFile(objectKey, file);
      if (uploadError) throw uploadError;
      const hash = objectKey.split("/").pop();
      updates.avatar_url = hash;
    }

    const { data, error } = await supabase
      .from(USER_TABLE)
      .update(updates)
      .eq("id", userId)
      .select("*, Artist(*)")
      .single();

    if (error) throw error;
    return data;
  }
}