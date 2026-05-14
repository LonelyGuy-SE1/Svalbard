"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "../AuthProvider";

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-crimson-200 border-t-crimson-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <header className="mb-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg
            viewBox="0 0 32 32"
            className="size-7"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="dg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>
            <path d="M16 2L30 16 16 30 2 16 16 2Z" fill="url(#dg)" />
          </svg>
          <h1 className="text-xl font-bold tracking-tight text-stone-900">
            Dashboard
          </h1>
        </div>
        <button
          onClick={() => supabase.auth.signOut()}
          className="rounded-lg border border-stone-300 px-4 py-2 text-sm text-stone-600 transition-colors hover:border-stone-400 hover:text-stone-800"
        >
          Sign out
        </button>
      </header>

      <div className="rounded-2xl border border-stone-200 bg-stone-50 p-8">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex size-11 items-center justify-center rounded-full bg-crimson-100 text-base font-semibold text-crimson-700">
            {user.email?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xs text-stone-500">Signed in as</p>
            <p className="font-medium text-stone-900">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
