"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { User, Session } from "@supabase/supabase-js";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      let session: Session | null = null;

      if (code) {
        const { data } = await supabase.auth
          .exchangeCodeForSession(code)
          .catch(() => ({ data: { session: null as Session | null } }));
        session = data?.session ?? null;
        window.history.replaceState({}, "", window.location.pathname);
      }

      if (!session) {
        const {
          data: { session: s },
        } = await supabase.auth.getSession();
        session = s;
      }

      if (session) {
        setUser(session.user);
        await supabase.auth.setSession(session);
      }

      setLoading(false);
    };

    init();

    const { data } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
};
