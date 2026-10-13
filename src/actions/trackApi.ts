'use server';

import { publicClient, requireSession, FORBIDDEN } from './session';
import {
  removeStoredFile,
  uploadAndGetHash,
} from '@/lib/supabase/supabaseUtils';
import { TRACK_SELECT } from './types';
import type { TrackRow } from './types';

const TRACK_TABLE = 'Track';

export async function createTrack({
  genreId,
  artistId,
  albumId,
  name,
  lyrics,
  isAddedByUser,
  file,
}: {
  genreId: string | number;
  artistId: string | number;
  albumId: string | number;
  name: string;
  lyrics?: string;
  isAddedByUser: boolean;
  file: File;
}) {
  const { supabase, user } = await requireSession();

  const canPublishForArtist =
    user.app_role === 'admin' || user.artistId === Number(artistId);
  if (!canPublishForArtist) throw new Error(FORBIDDEN);

  const hash = await uploadAndGetHash(supabase, 'mp3', file);

  const { data, error } = await supabase
    .from(TRACK_TABLE)
    .insert({
      genreId: Number(genreId),
      artistId: Number(artistId),
      albumId: Number(albumId),
      name,
      lyrics: lyrics ?? null,
      isAddedByUser,
      file_hash: hash,
    })
    .select(TRACK_SELECT)
    .single();

  if (error) {
    await removeStoredFile(supabase, 'mp3', hash);
    throw error;
  }
  return data;
}

export async function searchTracks({
  id,
  genre,
  artist,
  album,
  name,
  limit = 10,
  offset = 0,
}: {
  id?: string | number;
  genre?: string | number;
  artist?: string | number;
  album?: string | number;
  name?: string;
  limit?: number;
  offset?: number;
}): Promise<TrackRow[]> {
  const supabase = publicClient();

  let query = supabase.from(TRACK_TABLE).select(TRACK_SELECT);
  if (id) query = query.eq('id', Number(id));
  if (genre) query = query.eq('genreId', Number(genre));
  if (artist) query = query.eq('artistId', Number(artist));
  if (album) query = query.eq('albumId', Number(album));
  if (name) query = query.ilike('name', `%${name}%`);
  query = query.order('id');
  if (limit) query = query.range(offset, offset + limit - 1);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function deleteTrack(trackId: string | number) {
  if (!trackId) {
    throw new Error('Track ID is required for deletion.');
  }

  const { supabase, user } = await requireSession();

  const { data: track, error: trackError } = await supabase
    .from(TRACK_TABLE)
    .select('id, artistId, file_hash')
    .eq('id', Number(trackId))
    .single();
  if (trackError) throw trackError;

  const canDelete =
    user.app_role === 'admin' ||
    (user.artistId != null && user.artistId === track.artistId);
  if (!canDelete) throw new Error(FORBIDDEN);

  const { error } = await supabase
    .from(TRACK_TABLE)
    .delete()
    .eq('id', Number(trackId));
  if (error) throw error;

  await removeStoredFile(supabase, 'mp3', track.file_hash);
}
