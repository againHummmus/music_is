'use server';

import { requireSession } from './session';
import { RECOMMENDATION_SELECT } from './types';
import type { RecommendationRow } from './types';

const RECS_TABLE = 'User_recommendation';

export async function getUserRecommendations(): Promise<RecommendationRow[]> {
  const { supabase, user } = await requireSession();

  const { data, error } = await supabase
    .from(RECS_TABLE)
    .select(RECOMMENDATION_SELECT)
    .eq('User', user.id);
  if (error) throw error;
  return data ?? [];
}
