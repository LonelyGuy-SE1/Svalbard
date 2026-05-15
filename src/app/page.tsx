"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.push("/dashboard");
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-crimson-200 border-t-crimson-600" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4">
      <div className="text-center">
        <svg
          viewBox="0 0 32 32"
          className="mx-auto mb-5 size-12"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>
          <path d="M16 2L30 16 16 30 2 16 16 2Z" fill="url(#logo-g)" />
          <path d="M16 8L24 16 16 24 8 16 16 8Z" fill="#fff" opacity="0.15" />
        </svg>
        <h1 className="text-4xl font-bold tracking-tight text-stone-900">
          Svalbard
        </h1>
        <p className="mt-2 text-stone-500">Sign in to continue</p>
      </div>
      <button
        onClick={() => router.push("/login")}
        className="rounded-xl bg-crimson-600 px-8 py-3 font-semibold text-white shadow-sm transition-all hover:bg-crimson-500 active:scale-[0.97]"
      >
        Sign in
      </button>
    </div>
  );
}
