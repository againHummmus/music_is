import 'server-only';
import { FORBIDDEN } from './session';
import type { SupabaseServerClient } from './session';

const USER_DIALOGUE_TABLE = 'User_dialogue';
const USER_PLAYLIST_TABLE = 'User_playlist';
const PLAYLIST_TABLE = 'Playlist';

export async function assertDialogueMember(
  supabase: SupabaseServerClient,
  userId: number,
  dialogueId: number
) {
  const { data, error } = await supabase
    .from(USER_DIALOGUE_TABLE)
    .select('id')
    .eq('userId', userId)
    .eq('dialogueId', dialogueId)
    .limit(1);
  if (error) throw error;
  if (!data || data.length === 0) throw new Error(FORBIDDEN);
}

export async function isPlaylistCreator(
  supabase: SupabaseServerClient,
  userId: number,
  playlistId: number
): Promise<boolean> {
  const { data: playlist, error } = await supabase
    .from(PLAYLIST_TABLE)
    .select('id, Creator')
    .eq('id', playlistId)
    .single();
  if (error) throw error;
  if (playlist.Creator === userId) return true;

  const { data: link, error: linkError } = await supabase
    .from(USER_PLAYLIST_TABLE)
    .select('id')
    .eq('User', userId)
    .eq('Playlist', playlistId)
    .eq('is_creator', true)
    .limit(1);
  if (linkError) throw linkError;
  return Boolean(link && link.length > 0);
}

export async function assertPlaylistMember(
  supabase: SupabaseServerClient,
  userId: number,
  playlistId: number
) {
  const { data, error } = await supabase
    .from(USER_PLAYLIST_TABLE)
    .select('id')
    .eq('User', userId)
    .eq('Playlist', playlistId)
    .limit(1);
  if (error) throw error;
  if (data && data.length > 0) return;

  if (await isPlaylistCreator(supabase, userId, playlistId)) return;
  throw new Error(FORBIDDEN);
}
