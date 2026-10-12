import { createSupabaseServerClient } from '@/lib/supabase/supabaseServer';
import { LandingScreen } from '@/screens/landing/LandingScreen';

export default async function Page() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  return <LandingScreen initialAuth={!!authUser} />;
}
