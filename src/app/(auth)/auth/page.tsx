import AuthScreen from "@/components/auth/Auth";

export const dynamic = 'force-dynamic'

export default function SignIn({searchParams}: { searchParams: { mode: "signIn" | "signUp" }}) {
  const { mode } = searchParams;
  return (
    <AuthScreen initialMode={mode}/>
  );
}
