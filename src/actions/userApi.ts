'use server';

import { publicClient, requireSession } from './session';
import {
  removeStoredFile,
  uploadAndGetHash,
} from '@/lib/supabase/supabaseUtils';
import {
  USER_CARD_SELECT,
  USER_PROFILE_SELECT,
  USER_SELECT,
  USER_WITH_ARTIST_SELECT,
} from './types';
import type { TablesUpdate } from '@/types/supabase';
import type {
  UserCardRow,
  UserProfileRow,
  UserRow,
  UserWithArtist,
} from './types';

const USER_TABLE = 'User';

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
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getUserProfile(
  id: string | number
): Promise<UserProfileRow | null> {
  const supabase = publicClient();

  const { data, error } = await supabase
    .from(USER_TABLE)
    .select(USER_PROFILE_SELECT)
    .eq('id', Number(id))
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function searchUsers(params?: {
  id?: string | number;
  username?: string;
  name?: string;
  limit?: number;
  offset?: number;
}): Promise<UserCardRow[]> {
  const { supabase, user } = await requireSession();

  let query = supabase
    .from(USER_TABLE)
    .select(USER_CARD_SELECT)
    .eq('viewerSubscription.Follower', user.id);

  if (params?.id) query = query.eq('id', Number(params.id));
  const usernameQuery = params?.username ?? params?.name;
  if (usernameQuery) query = query.ilike('username', `%${usernameQuery}%`);
  query = query.order('id');
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

  if (error) {
    if (updates.avatar_url) {
      await removeStoredFile(supabase, 'img', updates.avatar_url);
    }
    throw error;
  }
  if (updates.avatar_url && user.avatar_url) {
    await removeStoredFile(supabase, 'img', user.avatar_url);
  }
  return { ...data, email: user.email };
}
