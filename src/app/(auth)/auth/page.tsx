import AuthScreen from "@/components/auth/Auth";

export const dynamic = 'force-dynamic'

export default function SignIn({params}:{ params: { mode: "signIn" | "signUp" }}) {
  const { mode } = params;
  return (
    <AuthScreen initialMode={mode}/>
  );
}
