"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function FileList({
  user,
  refreshKey,
}: {
  user: any;
  refreshKey: number;
}) {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFiles();
  }, [refreshKey]);

  const loadFiles = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", user.id)
      .order("uploaded_at", { ascending: false });

    setFiles(data || []);
    setLoading(false);
  };

  const openFile = async (storagePath: string) => {
    const { data } = await supabase.storage
      .from("vault")
      .createSignedUrl(storagePath, 60);

    if (data?.signedUrl) {
      window.open(data.signedUrl, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-stone-400">
        <div className="size-3.5 animate-spin rounded-full border-2 border-crimson-200 border-t-crimson-600" />
        Loading files…
      </div>
    );
  }

  if (files.length === 0) {
    return <p className="text-sm text-stone-400">No files uploaded yet.</p>;
  }

  return (
    <div className="space-y-2">
      {files.map((doc) => (
        <div
          key={doc.id}
          onClick={() => openFile(doc.storage_path)}
          className="flex cursor-pointer items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 transition-colors hover:border-stone-300 hover:bg-stone-100"
        >
          <svg className="size-4 shrink-0 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <span className="truncate">{doc.file_name}</span>
          <span className="ml-auto shrink-0 text-xs text-stone-400">
            {new Date(doc.uploaded_at).toLocaleDateString()}
          </span>
        </div>
      ))}
    </div>
  );
}
