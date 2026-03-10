"use client";

import { motion } from "framer-motion";
import { DailyFrame } from "@/components/DailyFrame";
import { DailyNarrative } from "@/components/DailyNarrative";
import { TaskList } from "@/components/TaskList";
import { HomeSkeleton } from "@/components/HomeSkeleton";
import { useTasks } from "@/hooks/useTasks";
import { useJournal } from "@/hooks/useJournal";
import { useFrames } from "@/hooks/useFrames";

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

export default function HomePage() {
  const todayKey = getTodayKey();
  const { loading: tasksLoading } = useTasks(todayKey);
  const { loading: journalLoading } = useJournal(todayKey);
  const { loading: framesLoading } = useFrames();
  const initialLoading = tasksLoading || journalLoading || framesLoading;

  return (
    <div className="min-h-dvh">
      <div className="max-w-lg mx-auto px-4 pt-8 pb-28 space-y-6">
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-0.5"
        >
          <h1 className="text-xl font-bold text-slate-900">
            Сәлем 👋
          </h1>
          <p className="text-sm text-slate-500">
            {new Date().toLocaleDateString("kk-KZ", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </motion.header>

        {initialLoading ? (
          <HomeSkeleton />
        ) : (
          <div className="space-y-5">
            <DailyFrame />
            <DailyNarrative />
            <TaskList />
          </div>
        )}
      </div>
    </div>
  );
}
