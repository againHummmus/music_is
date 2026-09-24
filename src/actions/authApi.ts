'use server';

import { headers } from 'next/headers';
import { createSupabaseServerClient } from '@/lib/supabase/supabaseServer';
import { USER_WITH_ARTIST_SELECT } from './types';
import type { AuthResult, UserWithArtist } from './types';
import type { SupabaseServerClient } from './session';
import type { TablesInsert } from '@/types/supabase';

const USER_TABLE = 'User';

function originFromHeaders(): string | undefined {
  const headerList = headers();
  const origin = headerList.get('origin');
  if (origin) return origin;

  const host = headerList.get('host');
  if (!host) return undefined;
  const protocol = headerList.get('x-forwarded-proto') ?? 'https';
  return `${protocol}://${host}`;
}

async function ensurePublicUser(
  supabase: SupabaseServerClient,
  {
    sbUserId,
    email,
    username,
    isActivated,
  }: {
    sbUserId: string;
    email?: string | null;
    username?: string | null;
    isActivated?: boolean;
  }
): Promise<{
  data: UserWithArtist | null;
  error: { message: string } | null;
}> {
  const { data: existing } = await supabase
    .from(USER_TABLE)
    .select(USER_WITH_ARTIST_SELECT)
    .eq('sbUserId', sbUserId)
    .single();

  if (existing) {
    if (
      typeof isActivated === 'boolean' &&
      existing.is_activated !== isActivated
    ) {
      const { data: updated, error } = await supabase
        .from(USER_TABLE)
        .update({ is_activated: isActivated })
        .eq('id', existing.id)
        .select(USER_WITH_ARTIST_SELECT)
        .single();
      return { data: updated ?? existing, error };
    }
    return { data: existing, error: null };
  }

  const payload: TablesInsert<'User'> = {
    sbUserId,
    email: email ?? null,
    username: username ?? (email ? email.split('@')[0] : 'User'),
    app_role: 'user',
    is_activated: Boolean(isActivated),
    avatar_url: null,
  };

  const { data, error } = await supabase
    .from(USER_TABLE)
    .insert(payload)
    .select(USER_WITH_ARTIST_SELECT)
    .single();

  return { data, error };
}

export async function signUp({
  email,
  password,
  username,
}: {
  email: string;
  password: string;
  username: string;
}): Promise<AuthResult> {
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
    return { data: { user: null }, error };
  }

  const { data: publicUser, error: publicUserError } = await ensurePublicUser(
    supabase,
    {
      sbUserId: data.user.id,
      email,
      username,
      isActivated: Boolean(data.user.email_confirmed_at),
    }
  );

  return { data: { user: publicUser }, error: publicUserError };
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

  const { data: publicUser, error: publicUserError } = await ensurePublicUser(
    supabase,
    {
      sbUserId: data.user.id,
      email: data.user.email,
      username: data.user.user_metadata?.username,
      isActivated: Boolean(data.user.email_confirmed_at),
    }
  );

  return { data: { user: publicUser }, error: publicUserError };
}

export async function signOut(): Promise<AuthResult> {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();
  return { data: { user: null }, error };
}

export async function getUser(): Promise<AuthResult> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  const authUser = data?.user ?? null;

  if (!authUser) {
    return { data: { user: null }, error };
  }

  const { data: publicUser, error: publicUserError } = await ensurePublicUser(
    supabase,
    {
      sbUserId: authUser.id,
      email: authUser.email,
      username: authUser.user_metadata?.username,
      isActivated: Boolean(authUser.email_confirmed_at),
    }
  );

  return { data: { user: publicUser }, error: error ?? publicUserError };
}

export async function resendConfirmation(email: string) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.resend({ type: 'signup', email });
  return { error };
}
