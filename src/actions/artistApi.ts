'use server';

import { publicClient, requireRole, requireSession } from './session';
import { uploadAndGetHash } from '@/lib/supabase/supabaseUtils';

const ARTIST_TABLE = 'Artist';
const USER_TABLE = 'User';

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
  if (error) throw error;

  return { data };
}

export async function becomeArtist({
  name,
  image,
}: {
  name: string;
  image: File;
}) {
  const { supabase, user } = await requireSession();

  const hash = await uploadAndGetHash(supabase, 'img', image);

  const { data: artist, error } = await supabase
    .from(ARTIST_TABLE)
    .insert({ name, image_hash: hash })
    .select('*')
    .single();
  if (error) throw error;

  const { error: userError } = await supabase
    .from(USER_TABLE)
    .update({ artistId: artist.id, app_role: 'artist' })
    .eq('id', user.id);
  if (userError) throw userError;

  return { data: artist };
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
  if (limit) query = query.range(offset, offset + limit - 1);

  const { data, error } = await query;
  if (error) throw error;
  return { data };
}
