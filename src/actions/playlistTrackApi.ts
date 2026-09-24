'use server';

import { publicClient, requireSession, FORBIDDEN } from './session';
import { assertPlaylistMember } from './guards';
import { PLAYLIST_TRACK_SELECT } from './types';

const PLAYLIST_TRACK_TABLE = 'Playlist_track';

export async function createPlaylistTrack({
  trackId,
  playlistId,
}: {
  trackId: string | number;
  playlistId: string | number;
}) {
  const { supabase, user } = await requireSession();
  await assertPlaylistMember(supabase, user.id, Number(playlistId));

  const { data, error } = await supabase
    .from(PLAYLIST_TRACK_TABLE)
    .insert({ trackId: Number(trackId), playlistId: Number(playlistId) })
    .select(PLAYLIST_TRACK_SELECT)
    .single();
  if (error) throw error;
  return { data };
}

export async function deletePlaylistTrack({ id }: { id: string | number }) {
  const { supabase, user } = await requireSession();

  const { data: link, error: linkError } = await supabase
    .from(PLAYLIST_TRACK_TABLE)
    .select('id, playlistId')
    .eq('id', Number(id))
    .single();
  if (linkError) throw linkError;
  if (link.playlistId == null) throw new Error(FORBIDDEN);

  await assertPlaylistMember(supabase, user.id, link.playlistId);

  const { data, error } = await supabase
    .from(PLAYLIST_TRACK_TABLE)
    .delete()
    .eq('id', Number(id))
    .select('*');
  if (error) throw error;
  return { data };
}

export async function searchPlaylistTracks({
  playlistId,
  trackId,
  limit = 10,
  offset = 0,
}: {
  playlistId?: string | number;
  trackId?: string | number;
  limit?: number;
  offset?: number;
}) {
  const supabase = publicClient();

  let query = supabase.from(PLAYLIST_TRACK_TABLE).select(PLAYLIST_TRACK_SELECT);
  if (playlistId) query = query.eq('playlistId', Number(playlistId));
  if (trackId) query = query.eq('trackId', Number(trackId));
  if (limit) query = query.range(offset, offset + limit - 1);

  const { data, error } = await query;
  if (error) throw error;
  return { data };
}
