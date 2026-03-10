"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Task } from "@/types/database";

export function useTasksForArchive() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;
    setError(null);

    async function fetchAll() {
      try {
        const { data, error: e } = await supabase
          .from("tasks")
          .select("*")
          .order("created_at", { ascending: false });
        if (e) throw e;
        if (mounted) setTasks(data ?? []);
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
  }, []);

  return { tasks, loading, error };
}
