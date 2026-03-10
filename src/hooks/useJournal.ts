"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { JournalEntry } from "@/types/database";

export function useJournal(dateFilter?: string) {
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    async function fetchJournal() {
      try {
        if (!dateFilter) {
          if (mounted) setEntry(null);
          return;
        }
        const start = `${dateFilter}T00:00:00`;
        const end = `${dateFilter}T23:59:59`;
        const { data, error: e } = await supabase
          .from("journal")
          .select("*")
          .gte("created_at", start)
          .lte("created_at", end)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (e) throw e;
        if (mounted) setEntry(data ?? null);
      } catch (e) {
        if (mounted)
          setError(e instanceof Error ? e : new Error(String(e)));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchJournal();

    const channel = supabase
      .channel("journal-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "journal" },
        () => fetchJournal()
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [dateFilter]);

  const upsertJournal = async (content: string, mood?: number) => {
    const payload = { content, updated_at: new Date().toISOString(), ...(mood !== undefined && { mood }) };
    if (entry?.id) {
      const { data, error: e } = await supabase
        .from("journal")
        .update(payload)
        .eq("id", entry.id)
        .select()
        .single();
      if (e) throw e;
      if (data) setEntry(data as typeof entry);
      return data;
    } else {
      const { data, error: e } = await supabase
        .from("journal")
        .insert({ content, mood: mood ?? 2 })
        .select()
        .single();
      if (e) throw e;
      if (data) setEntry(data);
      return data;
    }
  };

  return { entry, loading, error, upsertJournal };
}
