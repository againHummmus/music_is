'use server';

import { publicClient, requireRole, requireSession } from './session';
import {
  removeStoredFile,
  uploadAndGetHash,
} from '@/lib/supabase/supabaseUtils';

const ARTIST_TABLE = 'Artist';

export async function createArtist({
  name,
  image,
}: {
  name: string;
  image: File;
}) {
  const { supabase } = await requireRole('admin');

  const hash = await uploadAndGetHash(supabase, 'img', image);

  const { data, error } = await supabase
    .from(ARTIST_TABLE)
    .insert({ name, image_hash: hash })
    .select('*')
    .single();
  if (error) {
    await removeStoredFile(supabase, 'img', hash);
    throw error;
  }

  return data;
}

export async function becomeArtist({
  name,
  image,
}: {
  name: string;
  image: File;
}): Promise<number> {
  const { supabase } = await requireSession();

  const hash = await uploadAndGetHash(supabase, 'img', image);

  const { data: artistId, error } = await supabase.rpc('become_artist', {
    artist_name: name,
    artist_image_hash: hash,
  });
  if (error) {
    await removeStoredFile(supabase, 'img', hash);
    throw error;
  }

  return artistId;
}

export async function searchArtists({
  id,
  name,
  limit = 10,
  offset = 0,
}: {
  id?: string | number;
  name?: string;
  limit?: number;
  offset?: number;
}) {
  const supabase = publicClient();

  let query = supabase.from(ARTIST_TABLE).select('*');
  if (id) query = query.eq('id', Number(id));
  if (name) query = query.ilike('name', `%${name}%`);
  query = query.order('id');
  if (limit) query = query.range(offset, offset + limit - 1);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}
