import { createSupabaseServerClient } from '@/lib/supabase/supabaseServer';
import HeroSlideshow from './HeroSlideshow';

export default async function Page() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  return <HeroSlideshow initialAuth={!!authUser} />;
}
