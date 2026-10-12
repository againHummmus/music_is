import { AuthScreen } from '@/screens/auth/AuthScreen';

export const dynamic = 'force-dynamic';

export default function SignIn({
  searchParams,
}: {
  searchParams: { mode: 'signIn' | 'signUp' };
}) {
  const { mode } = searchParams;
  return <AuthScreen initialMode={mode} />;
}
