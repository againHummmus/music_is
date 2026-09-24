'use server';

import { requireSession, FORBIDDEN } from './session';
import { assertDialogueMember } from './guards';
import { MESSAGE_SELECT } from './types';
import type { MessageRow } from './types';

const MESSAGE_TABLE = 'Message';

export async function createMessage({
  dialogueId,
  content,
  track,
}: {
  dialogueId: number;
  content?: string;
  track?: { id: number | string } | null;
}): Promise<MessageRow> {
  const { supabase, user } = await requireSession();
  await assertDialogueMember(supabase, user.id, dialogueId);

  const { data, error } = await supabase
    .from(MESSAGE_TABLE)
    .insert({
      userId: user.id,
      dialogueId,
      content: content ?? null,
      Track: track ? Number(track.id) : null,
    })
    .select(MESSAGE_SELECT)
    .single();
  if (error) throw error;
  return data;
}

export async function getMessages({
  dialogueId,
  limit = 50,
  offset = 0,
  id,
}: {
  dialogueId: number;
  limit?: number;
  offset?: number;
  id?: number;
}): Promise<MessageRow[]> {
  const { supabase, user } = await requireSession();
  await assertDialogueMember(supabase, user.id, dialogueId);

  const safeOffset = Number.isFinite(offset) ? offset : 0;
  let query = supabase.from(MESSAGE_TABLE).select(MESSAGE_SELECT);
  query = query.eq('dialogueId', dialogueId);
  if (id) query = query.eq('id', id);
  if (limit) query = query.range(safeOffset, safeOffset + limit - 1);
  query = query.order('created_at', { ascending: true });

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getLastMessage({
  dialogueId,
}: {
  dialogueId: number;
}): Promise<MessageRow | null> {
  const { supabase, user } = await requireSession();
  await assertDialogueMember(supabase, user.id, dialogueId);

  const { data, error } = await supabase
    .from(MESSAGE_TABLE)
    .select(MESSAGE_SELECT)
    .eq('dialogueId', dialogueId)
    .order('created_at', { ascending: false })
    .limit(1);
  if (error) throw error;
  return data?.[0] ?? null;
}

export async function deleteMessage(
  messageId: number
): Promise<{ success: boolean }> {
  const { supabase, user } = await requireSession();

  const { data: message, error: messageError } = await supabase
    .from(MESSAGE_TABLE)
    .select('id, userId')
    .eq('id', messageId)
    .single();
  if (messageError) throw messageError;
  if (message.userId !== user.id) throw new Error(FORBIDDEN);

  const { error } = await supabase
    .from(MESSAGE_TABLE)
    .delete()
    .eq('id', messageId);
  if (error) throw error;
  return { success: true };
}
