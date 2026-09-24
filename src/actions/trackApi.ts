'use server';

import { publicClient, requireSession, FORBIDDEN } from './session';
import { uploadAndGetHash } from '@/lib/supabase/supabaseUtils';
import { TRACK_SELECT } from './types';
import type { TrackRow } from './types';

const TRACK_TABLE = 'Track';
const TRACK_LIKE_TABLE = 'Track_like';

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

  if (error) throw error;
  return { data };
}

export async function searchTracks({
  id,
  genre,
  artist,
  album,
  likedByUserId,
  name,
  limit = 10,
  offset = 0,
}: {
  id?: string | number;
  genre?: string | number;
  artist?: string | number;
  album?: string | number;
  likedByUserId?: string | number;
  name?: string;
  limit?: number;
  offset?: number;
}): Promise<{ data: TrackRow[] }> {
  const supabase = publicClient();

  let idsFilter: number[] | null = null;

  if (likedByUserId) {
    const { data: likes, error: likesError } = await supabase
      .from(TRACK_LIKE_TABLE)
      .select('trackId')
      .eq('userId', Number(likedByUserId));
    if (likesError) throw likesError;
    idsFilter = (likes ?? []).map((l) => l.trackId ?? 0);
    if (idsFilter.length === 0) return { data: [] };
  }

  let query = supabase.from(TRACK_TABLE).select(TRACK_SELECT);
  if (id) query = query.eq('id', Number(id));
  if (genre) query = query.eq('genreId', Number(genre));
  if (artist) query = query.eq('artistId', Number(artist));
  if (album) query = query.eq('albumId', Number(album));
  if (name) query = query.ilike('name', `%${name}%`);
  if (idsFilter) query = query.in('id', idsFilter);
  if (limit) query = query.range(offset, offset + limit - 1);

  const { data, error } = await query;
  if (error) throw error;
  return { data: data ?? [] };
}

export async function deleteTrack(trackId: string | number) {
  if (!trackId) {
    throw new Error('Track ID is required for deletion.');
  }

  const { supabase, user } = await requireSession();

  const { data: track, error: trackError } = await supabase
    .from(TRACK_TABLE)
    .select('id, artistId')
    .eq('id', Number(trackId))
    .single();
  if (trackError) throw trackError;

  const canDelete =
    user.app_role === 'admin' ||
    (user.artistId != null && user.artistId === track.artistId);
  if (!canDelete) throw new Error(FORBIDDEN);

  const { data, error } = await supabase
    .from(TRACK_TABLE)
    .delete()
    .eq('id', Number(trackId))
    .select('*');
  if (error) throw error;
  return { data };
}
