'use server';

import { publicClient, requireSession, FORBIDDEN } from './session';
import { PLAYLIST_SELECT } from './types';
import type { PlaylistRow } from './types';

const PLAYLIST_TABLE = 'Playlist';

export async function createPlaylist({
  name,
  description,
  isPublic,
}: {
  name: string;
  description: string;
  isPublic?: boolean;
}) {
  const { supabase, user } = await requireSession();

  const { data, error } = await supabase
    .from(PLAYLIST_TABLE)
    .insert({
      name,
      description,
      Creator: user.id,
      is_public: Boolean(isPublic),
      is_default: false,
    })
    .select(PLAYLIST_SELECT)
    .single();

  if (error) throw error;
  return { data };
}

export async function deletePlaylist({ id }: { id: string | number }) {
  const { supabase, user } = await requireSession();

  const { data: playlist, error: playlistError } = await supabase
    .from(PLAYLIST_TABLE)
    .select('id, Creator, is_default')
    .eq('id', Number(id))
    .single();
  if (playlistError) throw playlistError;

  const canDelete =
    !playlist.is_default &&
    (user.app_role === 'admin' || playlist.Creator === user.id);
  if (!canDelete) throw new Error(FORBIDDEN);

  const { data, error } = await supabase
    .from(PLAYLIST_TABLE)
    .delete()
    .eq('id', Number(id))
    .select('*');
  if (error) throw error;
  return { data };
}

export async function searchPlaylists({
  id,
  name,
  creatorId,
  isPublic,
  isDefault,
  limit,
  offset = 0,
}: {
  id?: string | number;
  name?: string;
  creatorId?: string | number;
  isPublic?: boolean;
  isDefault?: boolean;
  limit?: number;
  offset?: number;
}): Promise<PlaylistRow[]> {
  const supabase = publicClient();

  let query = supabase.from(PLAYLIST_TABLE).select(PLAYLIST_SELECT);
  if (id) query = query.eq('id', Number(id));
  if (name) query = query.ilike('name', `%${name}%`);
  if (creatorId) query = query.eq('Creator', Number(creatorId));
  if (typeof isPublic === 'boolean') query = query.eq('is_public', isPublic);
  if (typeof isDefault === 'boolean') query = query.eq('is_default', isDefault);
  if (limit) query = query.range(offset, offset + limit - 1);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}
