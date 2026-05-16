"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function FileUpload({
  user,
  onUpload,
}: {
  user: any;
  onUpload?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    const path = `${user.id}/${file.name}`;

    const { error: uploadErr } = await supabase.storage
      .from("vault")
      .upload(path, file, { upsert: true });

    if (uploadErr) {
      setLoading(false);
      e.target.value = "";
      if (
        uploadErr.message?.includes("bucket") ||
        uploadErr.message?.includes("not found")
      ) {
        setError(
          'Storage bucket "vault" does not exist. Create it in your Supabase dashboard under Storage.'
        );
      } else {
        setError(uploadErr.message);
      }
      return;
    }

    const { error: insertErr } = await supabase.from("documents").insert({
      user_id: user.id,
      file_name: file.name,
      storage_path: path,
    });

    setLoading(false);
    e.target.value = "";

    if (insertErr) {
      if (insertErr.message?.includes("row-level security")) {
        setError(
          "Upload succeeded but failed to save metadata. Make sure your RLS policy uses `auth.uid() = user_id` and you're signed in."
        );
      } else {
        setError(insertErr.message);
      }
    } else {
      onUpload?.();
    }
  };

  return (
    <div>
      <label className="relative inline-flex cursor-pointer items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 shadow-sm transition-colors hover:bg-stone-100 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-crimson-500/10 has-[:focus-visible]:border-crimson-400">
        <svg className="size-4 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
        Upload file
        <input type="file" onChange={upload} className="absolute inset-0 cursor-pointer opacity-0" />
      </label>

      {loading && (
        <p className="mt-3 flex items-center gap-2 text-sm text-stone-500">
          <span className="inline-block size-4 animate-spin rounded-full border-2 border-crimson-200 border-t-crimson-600" />
          Uploading…
        </p>
      )}

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-crimson-600">{error}</p>
      )}
    </div>
  );
}
