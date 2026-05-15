"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "../AuthProvider";

export default function Login() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) router.push("/dashboard");
  }, [user, authLoading, router]);

  const send = async () => {
    if (loading) return;
    if (!email) return;
    setLoading(true);
    setError("");

    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });

    if (err) {
      setError(err.message);
      setLoading(false);
    } else {
      setSent(true);
      setTimeout(() => setLoading(false), 60000);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-crimson-200 border-t-crimson-600" />
      </div>
    );
  }

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <svg
            viewBox="0 0 32 32"
            className="mx-auto mb-6 size-14"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="logo-g3" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>
            <path
              d="M16 2L30 16 16 30 2 16 16 2Z"
              fill="url(#logo-g3)"
            />
          </svg>
          <h2 className="text-2xl font-bold text-stone-900">
            Check your email
          </h2>
          <p className="mt-2 text-stone-500">
            We sent a sign-in link to{" "}
            <span className="font-medium text-stone-700">{email}</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <svg
            viewBox="0 0 32 32"
            className="mx-auto mb-4 size-11"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="logo-g4" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>
            <path
              d="M16 2L30 16 16 30 2 16 16 2Z"
              fill="url(#logo-g4)"
            />
          </svg>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">
            Svalbard
          </h1>
          <p className="mt-1 text-stone-500">Sign in with your email</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="rounded-2xl border border-stone-200 bg-stone-50 p-8"
        >
          <label className="text-sm font-medium text-stone-600">
            Email address
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 block w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 outline-none transition-colors focus:border-crimson-400 focus:ring-2 focus:ring-crimson-500/10"
            required
          />

          {error && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-crimson-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-5 w-full rounded-xl bg-crimson-600 py-3 font-semibold text-white shadow-sm transition-all hover:bg-crimson-500 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-flex items-center justify-center gap-2">
                <div className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Sending…
              </span>
            ) : (
              "Send sign-in link"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
