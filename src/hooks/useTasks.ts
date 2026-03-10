"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Task } from "@/types/database";

export function useTasks(dateFilter?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    async function fetchTasks() {
      try {
        let query = supabase
          .from("tasks")
          .select("*")
          .order("created_at", { ascending: true });

        if (dateFilter) {
          const start = `${dateFilter}T00:00:00`;
          const end = `${dateFilter}T23:59:59`;
          query = query.gte("created_at", start).lte("created_at", end);
        }

        const { data, error: e } = await query;
        if (e) throw e;
        if (mounted) setTasks(data ?? []);
      } catch (e) {
        if (mounted)
          setError(e instanceof Error ? e : new Error(String(e)));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchTasks();

    const channel = supabase
      .channel("tasks-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks" },
        () => fetchTasks()
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [dateFilter]);

  const addTask = async (title: string) => {
    const { data, error: e } = await supabase
      .from("tasks")
      .insert({ title, is_done: false })
      .select()
      .single();
    if (e) throw e;
    if (data) setTasks((prev) => [...prev, data]);
    return data;
  };

  const toggleTask = async (id: string, is_done: boolean) => {
    const { data, error: e } = await supabase
      .from("tasks")
      .update({ is_done })
      .eq("id", id)
      .select()
      .single();
    if (e) throw e;
    if (data) setTasks((prev) => prev.map((t) => (t.id === id ? data : t)));
    return data;
  };

  const deleteTask = async (id: string) => {
    await supabase.from("tasks").delete().eq("id", id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return { tasks, loading, error, addTask, toggleTask, deleteTask };
}
