import { supabase } from "@/lib/supabaseClient";

export default class DialogueApi {

  static async createDialogue({userId, otherUserId}:{userId: string, otherUserId: string}): Promise<{
    dialogueId: number;
    isNew: boolean;
  }> {
    const { data: existing, error: existingError } = await supabase
      .from("User_dialogue")
      .select("dialogueId,userId")
      .in("userId", [userId, otherUserId]);
    if (existingError) throw existingError;

    const map = new Map<number, Set<string>>();
    (existing ?? []).forEach((row: any) => {
      const set = map.get(row.dialogueId) ?? new Set<string>();
      set.add(row.userId?.toString());
      map.set(row.dialogueId, set);
    });

    for (const [dialogueId, set] of map.entries()) {
      if (set.has(userId.toString()) && set.has(otherUserId.toString())) {
        return { dialogueId, isNew: false };
      }
    }

    const { data: dialogue, error: dialogueError } = await supabase
      .from("Dialogue")
      .insert({ title: null })
      .select("id")
      .single();
    if (dialogueError) throw dialogueError;

    const { error: linkError } = await supabase.from("User_dialogue").insert([
      { userId, dialogueId: dialogue.id, is_creator: true },
      { userId: otherUserId, dialogueId: dialogue.id, is_creator: false },
    ]);
    if (linkError) throw linkError;

    return { dialogueId: dialogue.id, isNew: true };
  }

  static async getUserDialogues({userId}:{userId: string}): Promise<
    Array<any>
  > {
    const { data, error } = await supabase
      .from("User_dialogue")
      .select(`
        dialogueId,
        is_creator,
        Dialogue (
          id,
          title,
          Message(count),
          User_dialogue (
            userId,
            is_creator,
            User:User ( id, username, avatar_url )
          )
        )
      `)
      .eq("userId", userId);
    if (error) throw error;
    return data ?? [];
  }

  static async getParticipants(dialogueId: number): Promise<
    Array<{
      userId: number;
      is_creator: boolean;
      User: { id: number; username: string; avatar_url?: string };
    }>
  > {
    const { data, error } = await supabase
      .from("User_dialogue")
      .select("userId, is_creator, User:User ( id, username, avatar_url )")
      .eq("dialogueId", dialogueId);
    if (error) throw error;
    return (data ?? []) as any[];
  }
}
