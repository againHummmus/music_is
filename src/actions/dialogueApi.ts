'use server';

import { requireSession } from './session';
import { assertDialogueMember } from './guards';
import { DIALOGUE_SELECT, PARTICIPANT_SELECT } from './types';
import type { DialogueRow, ParticipantRow } from './types';

const USER_DIALOGUE_TABLE = 'User_dialogue';
const DIALOGUE_TABLE = 'Dialogue';

export async function createDialogue({
  otherUserId,
}: {
  otherUserId: string | number;
}): Promise<{ dialogueId: number; isNew: boolean }> {
  const { supabase, user } = await requireSession();
  const otherId = Number(otherUserId);

  const { data: existing, error: existingError } = await supabase
    .from(USER_DIALOGUE_TABLE)
    .select('dialogueId,userId')
    .in('userId', [user.id, otherId]);
  if (existingError) throw existingError;

  const map = new Map<number, Set<number>>();
  (existing ?? []).forEach((row) => {
    if (row.dialogueId == null || row.userId == null) return;
    const set = map.get(row.dialogueId) ?? new Set<number>();
    set.add(row.userId);
    map.set(row.dialogueId, set);
  });

  for (const [dialogueId, set] of map.entries()) {
    if (set.has(user.id) && set.has(otherId)) {
      return { dialogueId, isNew: false };
    }
  }

  const { data: dialogue, error: dialogueError } = await supabase
    .from(DIALOGUE_TABLE)
    .insert({ title: null })
    .select('id')
    .single();
  if (dialogueError) throw dialogueError;

  const { error: linkError } = await supabase
    .from(USER_DIALOGUE_TABLE)
    .insert([
      { userId: user.id, dialogueId: dialogue.id, is_creator: true },
      { userId: otherId, dialogueId: dialogue.id, is_creator: false },
    ]);
  if (linkError) throw linkError;

  return { dialogueId: dialogue.id, isNew: true };
}

export async function getUserDialogues(): Promise<DialogueRow[]> {
  const { supabase, user } = await requireSession();

  const { data, error } = await supabase
    .from(USER_DIALOGUE_TABLE)
    .select(DIALOGUE_SELECT)
    .eq('userId', user.id);
  if (error) throw error;
  return data ?? [];
}

export async function getParticipants(
  dialogueId: number
): Promise<ParticipantRow[]> {
  const { supabase, user } = await requireSession();
  await assertDialogueMember(supabase, user.id, dialogueId);

  const { data, error } = await supabase
    .from(USER_DIALOGUE_TABLE)
    .select(PARTICIPANT_SELECT)
    .eq('dialogueId', dialogueId);
  if (error) throw error;
  return data ?? [];
}
