'use server';

import { requireSession } from './session';
import { USER_CARD_SELECT } from './types';
import type { UserCardRow } from './types';

export async function getRecommendedUsers(limit = 10): Promise<UserCardRow[]> {
  const { supabase, user } = await requireSession();

  const { data: ranked, error: rankError } = await supabase.rpc(
    'recommended_users',
    {
      max_count: limit,
    }
  );
  if (rankError) throw rankError;
  if (!ranked?.length) return [];

  const ids = ranked.map((row) => row.user_id);
  const { data, error } = await supabase
    .from('User')
    .select(USER_CARD_SELECT)
    .in('id', ids)
    .eq('viewerSubscription.Follower', user.id);
  if (error) throw error;

  const rankById = new Map(ids.map((id, index) => [id, index]));
  return (data ?? []).sort(
    (a, b) => (rankById.get(a.id) ?? 0) - (rankById.get(b.id) ?? 0)
  );
}
