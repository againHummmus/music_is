import { supabase } from "@/lib/supabaseClient";

const RECS_TABLE = "User_recommendation";

export default class RecommendationApi {
  static async getUserRecommendations({ userId }: { userId: string }) {
    const { data, error } = await supabase
      .from(RECS_TABLE)
      .select(`*, RecommendedUser:RecommendedUser ( * )`)
      .eq("User", userId);
    if (error) throw error;
    return data ?? [];
  }
}