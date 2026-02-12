import { useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { upsertUser } from "@/lib/supabase-products";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(!!SUPABASE_URL);

  useEffect(() => {
    if (!SUPABASE_URL) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) syncUser(s.user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) syncUser(s.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  /** Sync auth user to our public.users table */
  const syncUser = (authUser: User) => {
    const meta = authUser.user_metadata;
    upsertUser({
      id: authUser.id,
      name: meta?.full_name ?? meta?.name ?? authUser.email ?? "User",
      email: authUser.email ?? "",
      avatar: meta?.avatar_url ?? "",
      location: "", // filled later via LocationPrompt
    });
  };

  const signInWithGoogle = async () => {
    if (!SUPABASE_URL) return;
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  const signOut = async () => {
    if (!SUPABASE_URL) return;
    await supabase.auth.signOut();
  };

  return { user, session, loading, signInWithGoogle, signOut };
}
