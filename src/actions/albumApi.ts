'use server';

import { publicClient, requireSession, FORBIDDEN } from './session';
import { uploadAndGetHash } from '@/lib/supabase/supabaseUtils';
import { ALBUM_SELECT } from './types';

const ALBUM_TABLE = 'Album';

export async function createAlbum({
  name,
  year,
  artistId,
  image_hash,
}: {
  name: string | null;
  year: number | null;
  artistId: number | null;
  image_hash: File;
}) {
  const { supabase, user } = await requireSession();

  const canPublishForArtist =
    user.app_role === 'admin' ||
    (user.artistId != null && user.artistId === artistId);
  if (!canPublishForArtist) throw new Error(FORBIDDEN);

  const hash = await uploadAndGetHash(supabase, 'img', image_hash);

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

  if (error) throw error;
  return { data };
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
  if (limit) query = query.range(offset, offset + limit - 1);

  const { data, error } = await query;
  if (error) throw error;
  return { data };
}
