"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useAuth } from "../AuthProvider";
import FileUpload from "@/components/FileUpload";
import FileList from "@/components/FileList";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [notes, setNotes] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [fileRefresh, setFileRefresh] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setNotes(data || []);
      });
  }, [user, authLoading, router]);

  const addNote = async () => {
    if (!user || !content || saving) return;
    setSaving(true);

    const { data } = await supabase
      .from("notes")
      .insert([{ user_id: user.id, content }])
      .select();

    if (data) {
      setNotes([data[0], ...notes]);
      setContent("");
    }
    setSaving(false);
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-crimson-200 border-t-crimson-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <header className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg viewBox="0 0 32 32" className="size-7" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="dg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>
            <path d="M16 2L30 16 16 30 2 16 16 2Z" fill="url(#dg)" />
          </svg>
          <h1 className="text-xl font-bold tracking-tight text-stone-900">Dashboard</h1>
        </div>
        <button
          onClick={() => supabase.auth.signOut()}
          className="rounded-lg border border-stone-300 px-4 py-2 text-sm text-stone-600 transition-colors hover:border-stone-400 hover:text-stone-800"
        >
          Sign out
        </button>
      </header>

      <div className="mb-8 rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-stone-400">Files</h2>
        <FileUpload user={user} onUpload={() => setFileRefresh((n) => n + 1)} />
        <div className="mt-4">
          <FileList user={user} refreshKey={fileRefresh} />
        </div>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-stone-400">Notes</h2>

        <textarea
          placeholder="Write a note…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 placeholder-stone-400 outline-none transition-colors focus:border-crimson-400 focus:ring-2 focus:ring-crimson-500/10 resize-none"
        />

        <button
          onClick={addNote}
          disabled={saving || !content.trim()}
          className="mt-4 rounded-xl bg-crimson-600 px-6 py-2.5 font-semibold text-white shadow-sm transition-all hover:bg-crimson-500 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save note"}
        </button>
      </div>

      {notes.length > 0 && (
        <div className="mt-8 space-y-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className="rounded-xl border border-stone-200 bg-white px-5 py-4 text-stone-800 leading-relaxed"
            >
              {note.content}
            </div>
          ))}
        </div>
      )}

      {notes.length === 0 && !authLoading && (
        <p className="mt-12 text-center text-stone-400">No notes yet.</p>
      )}
    </div>
  );
}
