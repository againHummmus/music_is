import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createSupabaseServerClient } from '@/lib/supabase/supabaseServer';
import { USER_WITH_ARTIST_SELECT } from './types';
import type { UserWithArtist } from './types';
import type { Database } from '../../database.types';

export type SupabaseServerClient = SupabaseClient<Database>;

export type Session = {
  supabase: SupabaseServerClient;
  user: UserWithArtist;
};

export const UNAUTHORIZED = 'Unauthorized';
export const FORBIDDEN = 'Forbidden';

export async function getCurrentUser(): Promise<UserWithArtist | null> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) return null;

  const { data } = await supabase
    .from('User')
    .select(USER_WITH_ARTIST_SELECT)
    .eq('sbUserId', authUser.id)
    .single();

  return (data as UserWithArtist | null) ?? null;
}

export async function getSession(): Promise<Session | null> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) return null;

  const { data } = await supabase
    .from('User')
    .select(USER_WITH_ARTIST_SELECT)
    .eq('sbUserId', authUser.id)
    .single();

  const user = (data as UserWithArtist | null) ?? null;
  return user ? { supabase, user } : null;
}

export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) throw new Error(UNAUTHORIZED);
  return session;
}

export async function requireRole(
  role: Database['public']['Enums']['roles']
): Promise<Session> {
  const session = await requireSession();
  if (session.user.app_role !== role) throw new Error(FORBIDDEN);
  return session;
}

export function publicClient(): SupabaseServerClient {
  return createSupabaseServerClient();
}
