"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { JournalEntry } from "@/types/database";

export function useJournalArchive(search?: string) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;
    setError(null);

    async function fetchAll() {
      try {
        let query = supabase
          .from("journal")
          .select("*")
          .neq("content", "")
          .order("created_at", { ascending: false });

        const term = search?.trim();
        if (term) {
          query = query.ilike("content", `%${term}%`);
        }

        const { data, error: e } = await query;
        if (e) throw e;
        if (mounted) setEntries(data ?? []);
      } catch (e) {
        if (mounted) setError(e instanceof Error ? e : new Error(String(e)));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchAll();
    return () => {
      mounted = false;
    };
  }, [search]);

  return { entries, loading, error };
}
