'use server';

import { getSession, publicClient, requireSession } from './session';
import { uploadAndGetHash } from '@/lib/supabase/supabaseUtils';
import {
  USER_PUBLIC_COLUMNS,
  USER_SELECT,
  USER_WITH_ARTIST_SELECT,
} from './types';
import type { TablesUpdate } from '@/types/supabase';
import type { UserBasicRow, UserRow, UserWithArtist } from './types';

const USER_TABLE = 'User';

export async function getMe(): Promise<UserWithArtist | null> {
  const session = await getSession();
  return session?.user ?? null;
}

export async function getUser({
  id,
}: {
  id: string | number;
}): Promise<UserRow | null> {
  const supabase = publicClient();

  const { data, error } = await supabase
    .from(USER_TABLE)
    .select(USER_SELECT)
    .eq('id', Number(id))
    .single();

  if (error) return null;
  return data;
}

export async function searchUsers(params?: {
  id?: string | number;
  username?: string;
  name?: string;
  limit?: number;
  offset?: number;
}): Promise<UserBasicRow[]> {
  const supabase = publicClient();

  let query = supabase.from(USER_TABLE).select(USER_PUBLIC_COLUMNS);

  if (params?.id) query = query.eq('id', Number(params.id));
  const usernameQuery = params?.username ?? params?.name;
  if (usernameQuery) query = query.ilike('username', `%${usernameQuery}%`);
  if (params?.limit) {
    const offset = params?.offset ?? 0;
    query = query.range(offset, offset + params.limit - 1);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function updateUser({
  file,
  newUsername,
}: {
  file?: File;
  newUsername?: string;
}): Promise<UserWithArtist> {
  const { supabase, user } = await requireSession();

  const updates: TablesUpdate<'User'> = {};
  if (newUsername) updates.username = newUsername;

  if (file) {
    updates.avatar_url = await uploadAndGetHash(supabase, 'img', file);
  }

  const { data, error } = await supabase
    .from(USER_TABLE)
    .update(updates)
    .eq('id', user.id)
    .select(USER_WITH_ARTIST_SELECT)
    .single();

  if (error) throw error;
  return data;
}
