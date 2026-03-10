"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Frame } from "@/types/database";

export function useFrames() {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    async function fetchFrames() {
      try {
        const { data, error: e } = await supabase
          .from("frames")
          .select("*")
          .order("created_at", { ascending: false });
        if (e) throw e;
        if (mounted) setFrames(data ?? []);
      } catch (e) {
        if (mounted)
          setError(e instanceof Error ? e : new Error(String(e)));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchFrames();

    const channel = supabase
      .channel("frames-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "frames" },
        () => fetchFrames()
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const addFrame = async (image_url: string, caption?: string) => {
    const { data, error: e } = await supabase
      .from("frames")
      .insert({ image_url, caption: caption ?? null })
      .select()
      .single();
    if (e) throw e;
    if (data) setFrames((prev) => [data, ...prev]);
    return data;
  };

  const deleteFrame = async (id: string) => {
    await supabase.from("frames").delete().eq("id", id);
    setFrames((prev) => prev.filter((f) => f.id !== id));
  };

  return { frames, loading, error, addFrame, deleteFrame };
}
