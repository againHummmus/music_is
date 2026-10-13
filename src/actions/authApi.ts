'use server';

import { headers } from 'next/headers';
import { createSupabaseServerClient } from '@/lib/supabase/supabaseServer';
import { USER_WITH_ARTIST_SELECT } from './types';
import type { AuthResult } from './types';
import { getCurrentUser } from './session';
import type { SupabaseServerClient } from './session';

const USER_TABLE = 'User';
const ACCOUNT_EXISTS =
  'An account with this email already exists. Please sign in instead.';
const PROFILE_MISSING =
  'Your profile could not be found. Please contact support.';

function originFromHeaders(): string | undefined {
  const headerList = headers();
  const origin = headerList.get('origin');
  if (origin) return origin;

  const host = headerList.get('host');
  if (!host) return undefined;
  const protocol = headerList.get('x-forwarded-proto') ?? 'https';
  return `${protocol}://${host}`;
}

async function loadProfile(
  supabase: SupabaseServerClient,
  sbUserId: string,
  email: string | undefined
): Promise<AuthResult> {
  const { data, error } = await supabase
    .from(USER_TABLE)
    .select(USER_WITH_ARTIST_SELECT)
    .eq('sbUserId', sbUserId)
    .maybeSingle();
  if (error) return { data: { user: null }, error };
  if (!data) {
    return { data: { user: null }, error: { message: PROFILE_MISSING } };
  }
  return { data: { user: { ...data, email: email ?? null } }, error: null };
}

export async function signUp({
  email,
  password,
  username,
}: {
  email: string;
  password: string;
  username: string;
}): Promise<AuthResult & { needsConfirmation: boolean }> {
  const supabase = createSupabaseServerClient();
  const origin = originFromHeaders();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
      emailRedirectTo: origin ? `${origin}/auth?mode=signIn` : undefined,
    },
  });

  if (error || !data?.user) {
    return { data: { user: null }, error, needsConfirmation: false };
  }
  if (data.user.identities?.length === 0) {
    return {
      data: { user: null },
      error: { message: ACCOUNT_EXISTS },
      needsConfirmation: false,
    };
  }
  if (!data.session) {
    return { data: { user: null }, error: null, needsConfirmation: true };
  }

  return {
    ...(await loadProfile(supabase, data.user.id, data.user.email)),
    needsConfirmation: false,
  };
}

export async function signIn({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<AuthResult> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data?.user) {
    return { data: { user: null }, error };
  }

  return loadProfile(supabase, data.user.id, data.user.email);
}

export async function signOut(): Promise<AuthResult> {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();
  return { data: { user: null }, error };
}

export async function getUser(): Promise<AuthResult> {
  const user = await getCurrentUser();
  return { data: { user }, error: null };
}

export async function resendConfirmation(email: string) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.resend({ type: 'signup', email });
  return { error };
}
