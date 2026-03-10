"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Frame } from "@/types/database";

export function useFramesForArchive() {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    async function fetchAll() {
      const { data } = await supabase
        .from("frames")
        .select("*")
        .order("created_at", { ascending: false });
      if (mounted) setFrames(data ?? []);
      if (mounted) setLoading(false);
    }

    fetchAll();
    return () => {
      mounted = false;
    };
  }, [supabase]);

  return { frames, loading };
}

