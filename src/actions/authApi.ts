import { supabase } from "@/lib/supabaseClient";

const USER_TABLE = "User";

type AuthResult = {
  data: {
    user: any | null;
    session: any | null;
  } | null;
  error: any | null;
};

export default class AuthApi {
  private static async getPublicUserBySbId(sbUserId: string) {
    return supabase
      .from(USER_TABLE)
      .select("*, Artist(*)")
      .eq("sbUserId", sbUserId)
      .single();
  }

  private static async ensurePublicUser({
    sbUserId,
    email,
    username,
    isActivated,
  }: {
    sbUserId: string;
    email?: string | null;
    username?: string | null;
    isActivated?: boolean;
  }) {
    const { data: existing } = await this.getPublicUserBySbId(sbUserId);
    if (existing) {
      if (typeof isActivated === "boolean" && existing.is_activated !== isActivated) {
        const { data: updated, error } = await supabase
          .from(USER_TABLE)
          .update({ is_activated: isActivated })
          .eq("id", existing.id)
          .select("*, Artist(*)")
          .single();
        return { data: updated ?? existing, error };
      }
      return { data: existing, error: null };
    }

    const payload: any = {
      sbUserId,
      email: email ?? null,
      username: username ?? (email ? email.split("@")[0] : "User"),
      app_role: "user",
      is_activated: Boolean(isActivated),
      avatar_url: null,
    };

    return supabase.from(USER_TABLE).insert(payload).select("*, Artist(*)").single();
  }

  static async signUp({
    email,
    password,
    username,
  }: {
    email: string;
    password: string;
    username: string;
  }): Promise<AuthResult> {
    const emailRedirectTo =
      typeof window !== "undefined" ? `${window.location.origin}/auth?mode=signIn` : undefined;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
        emailRedirectTo,
      },
    });

    if (error || !data?.user) {
      return { data: { user: data?.user ?? null, session: data?.session ?? null }, error };
    }

    const { data: publicUser, error: publicUserError } = await this.ensurePublicUser({
      sbUserId: data.user.id,
      email,
      username,
      isActivated: Boolean(data.user.email_confirmed_at),
    });

    return {
      data: { user: publicUser ?? null, session: data.session },
      error: publicUserError ?? null,
    };
  }

  static async signIn({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<AuthResult> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data?.user) {
      return { data: { user: data?.user ?? null, session: data?.session ?? null }, error };
    }

    const { data: publicUser, error: publicUserError } = await this.ensurePublicUser({
      sbUserId: data.user.id,
      email: data.user.email,
      username: data.user.user_metadata?.username,
      isActivated: Boolean(data.user.email_confirmed_at),
    });

    return {
      data: { user: publicUser ?? null, session: data.session },
      error: publicUserError ?? null,
    };
  }

  static async signOut(): Promise<AuthResult> {
    const { error } = await supabase.auth.signOut();
    return { data: { user: null, session: null }, error };
  }

  static async getSession(): Promise<AuthResult> {
    const { data, error } = await supabase.auth.getSession();
    const user = data?.session?.user ?? null;

    if (!user) {
      return { data: { user: null, session: data?.session ?? null }, error };
    }

    const { data: publicUser, error: publicUserError } = await this.ensurePublicUser({
      sbUserId: user.id,
      email: user.email,
      username: user.user_metadata?.username,
      isActivated: Boolean(user.email_confirmed_at),
    });

    return {
      data: { user: publicUser ?? null, session: data.session },
      error: error ?? publicUserError ?? null,
    };
  }

  static async resendConfirmation(email: string) {
    return supabase.auth.resend({ type: "signup", email });
  }
}
