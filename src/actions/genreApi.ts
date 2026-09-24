'use server';

import { publicClient, requireRole } from './session';

const GENRE_TABLE = 'Genre';

export async function createGenre({ name }: { name: string }) {
  const { supabase } = await requireRole('admin');

  const { data, error } = await supabase
    .from(GENRE_TABLE)
    .insert({ name })
    .select('*')
    .single();
  if (error) throw error;
  return { data };
}

export async function searchGenres({
  name = '',
  limit = 10,
  offset = 0,
}: {
  name?: string;
  limit?: number;
  offset?: number;
}) {
  const supabase = publicClient();

  let query = supabase.from(GENRE_TABLE).select('*');
  if (name) query = query.ilike('name', `%${name}%`);
  if (limit) query = query.range(offset, offset + limit - 1);

  const { data, error } = await query;
  if (error) throw error;
  return { data };
}
