'use server';

import { publicClient, requireSession, FORBIDDEN } from './session';
import {
  assertUploadedHash,
  removeStoredFile,
} from '@/lib/supabase/supabaseUtils';
import { ALBUM_DETAILS_SELECT, ALBUM_SELECT } from './types';
import type { AlbumDetailsRow } from './types';

const ALBUM_TABLE = 'Album';

export async function createAlbum({
  name,
  year,
  artistId,
  imageHash,
}: {
  name: string | null;
  year: number | null;
  artistId: number | null;
  imageHash: string;
}) {
  const { supabase, user } = await requireSession();

  const canPublishForArtist =
    user.app_role === 'admin' ||
    (user.artistId != null && user.artistId === artistId);
  if (!canPublishForArtist) throw new Error(FORBIDDEN);

  const hash = assertUploadedHash('img', imageHash);

  const { data, error } = await supabase
    .from(ALBUM_TABLE)
    .insert({
      name,
      year,
      artistId,
      image_hash: hash,
    })
    .select(ALBUM_SELECT)
    .single();

  if (error) {
    await removeStoredFile(supabase, 'img', hash);
    throw error;
  }
  return data;
}

export async function searchAlbums({
  id,
  name,
  artistId,
  limit = 10,
  offset = 0,
}: {
  id?: string | number;
  name?: string;
  artistId?: string | number;
  limit?: number;
  offset?: number;
}) {
  const supabase = publicClient();

  let query = supabase.from(ALBUM_TABLE).select(ALBUM_SELECT);

  if (id) query = query.eq('id', Number(id));
  if (name) query = query.ilike('name', `%${name}%`);
  if (artistId) query = query.eq('artistId', Number(artistId));
  query = query.order('id');
  if (limit) query = query.range(offset, offset + limit - 1);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getAlbum(id: string | number): Promise<AlbumDetailsRow | null> {
  const supabase = publicClient();

  const { data, error } = await supabase
    .from(ALBUM_TABLE)
    .select(ALBUM_DETAILS_SELECT)
    .eq('id', Number(id))
    .maybeSingle();
  if (error) throw error;
  return data;
}
