'use server';

import { publicClient, requireSession, FORBIDDEN } from './session';
import { isPlaylistCreator } from './guards';
import { USER_PLAYLIST_SELECT } from './types';

const USER_PLAYLIST_TABLE = 'User_playlist';

export async function createUserPlaylist({
  userId,
  playlistId,
  isCreator,
}: {
  userId: string | number;
  playlistId: string | number;
  isCreator: boolean;
}) {
  const { supabase, user } = await requireSession();

  const isSelf = Number(userId) === user.id;
  if (!isSelf) {
    const allowed = await isPlaylistCreator(
      supabase,
      user.id,
      Number(playlistId)
    );
    if (!allowed) throw new Error(FORBIDDEN);
  }

  const { data, error } = await supabase
    .from(USER_PLAYLIST_TABLE)
    .insert({
      User: Number(userId),
      Playlist: Number(playlistId),
      is_creator: isCreator,
    })
    .select(USER_PLAYLIST_SELECT)
    .single();
  if (error) throw error;
  return { data };
}

export async function deleteUserPlaylist({ id }: { id: string | number }) {
  const { supabase, user } = await requireSession();

  const { data: link, error: linkError } = await supabase
    .from(USER_PLAYLIST_TABLE)
    .select('id, User, Playlist')
    .eq('id', Number(id))
    .single();
  if (linkError) throw linkError;

  let canDelete = link.User === user.id;
  if (!canDelete && link.Playlist != null) {
    canDelete = await isPlaylistCreator(supabase, user.id, link.Playlist);
  }
  if (!canDelete) throw new Error(FORBIDDEN);

  const { data, error } = await supabase
    .from(USER_PLAYLIST_TABLE)
    .delete()
    .eq('id', Number(id))
    .select('*');
  if (error) throw error;
  return { data };
}

export async function searchUserPlaylists({
  userId,
  playlistId,
  isCreator,
  limit = 10,
  offset = 0,
  includeDefaultPlaylists,
}: {
  userId?: string | number;
  playlistId?: string | number;
  isCreator?: boolean;
  limit?: number;
  offset?: number;
  includeDefaultPlaylists?: boolean;
}) {
  const supabase = publicClient();

  let query = supabase.from(USER_PLAYLIST_TABLE).select(USER_PLAYLIST_SELECT);
  if (userId) query = query.eq('User', Number(userId));
  if (playlistId) query = query.eq('Playlist', Number(playlistId));
  if (typeof isCreator === 'boolean') query = query.eq('is_creator', isCreator);
  if (includeDefaultPlaylists === false) {
    query = query.eq('Playlist.is_default', false);
  }
  if (limit) query = query.range(offset, offset + limit - 1);

  const { data, error } = await query;
  if (error) throw error;
  return { data };
}
