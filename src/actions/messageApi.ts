export interface MessageDto {
  id: number;
  dialogueId: number;
  userId: number;
  content: string;
  created_at: string;
  User: {
    id: number;
    username: string;
    avatar_url?: string;
  };
  Track: Track
}

import { supabase } from "@/lib/supabaseClient";

const MESSAGE_TABLE = "Message";

const MESSAGE_SELECT = `
  *,
  User:User ( id, username, avatar_url ),
  Track (
    *,
    Album(*),
    Artist(*),
    Genre(*),
    Track_like(*),
    Playlist_track(*)
  )
`;

export default class MessageApi {
  static async createMessage({
    userId,
    dialogueId,
    content,
    track,
  }: {
    userId: string;
    dialogueId: number;
    content?: string;
    track?: any;
  }): Promise<MessageDto> {
    const { data, error } = await supabase
      .from(MESSAGE_TABLE)
      .insert({
        userId,
        dialogueId,
        content: content ?? null,
        Track: track?.id ?? null,
      })
      .select(MESSAGE_SELECT)
      .single();
    if (error) throw error;
    return data as MessageDto;
  }

  static async getMessages({
    userId,
    dialogueId,
    limit = 50,
    offset = 0,
    id,
  }: {
    userId: string;
    dialogueId: number;
    limit?: number;
    offset?: number;
    id?: any;
  }): Promise<MessageDto[]> {
    const safeOffset = Number.isFinite(offset) ? offset : 0;
    let query = supabase.from(MESSAGE_TABLE).select(MESSAGE_SELECT);
    if (dialogueId) query = query.eq("dialogueId", dialogueId);
    if (id) query = query.eq("id", id);
    if (limit) query = query.range(safeOffset, safeOffset + limit - 1);
    query = query.order("created_at", { ascending: true });

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as MessageDto[];
  }

  static async deleteMessage(messageId: number): Promise<{ success: boolean }> {
    const { error } = await supabase
      .from(MESSAGE_TABLE)
      .delete()
      .eq("id", messageId);
    if (error) throw error;
    return { success: true };
  }
}
