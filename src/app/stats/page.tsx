"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { useTasksForArchive } from "@/hooks/useTasksForArchive";
import { AchievementsRing } from "@/components/AchievementsRing";

export default function StatsPage() {
  const { tasks, loading } = useTasksForArchive();

  const { completed, total } = useMemo(() => {
    const completed = tasks.filter((t) => t.is_done).length;
    return { completed, total: tasks.length };
  }, [tasks]);

  return (
    <div className="min-h-dvh">
      <div className="max-w-lg mx-auto px-4 pt-8 pb-28 space-y-6">
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-0.5"
        >
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-slate-700" />
            Статистика
          </h1>
          <p className="text-sm text-slate-500">
            Бүгінгі жетістіктер
          </p>
        </motion.header>

        <motion.section
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="glass-panel rounded-2xl py-6 px-4 flex flex-col items-center"
        >
          <h2 className="text-sm font-bold text-slate-900 mb-4">
            Жетістіктер
          </h2>
          {loading ? (
            <div className="h-[200px] flex items-center justify-center text-slate-500 text-sm">
              Жүктелуде...
            </div>
          ) : (
            <AchievementsRing variant="large" />
          )}
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel rounded-2xl p-4"
        >
          <h3 className="text-sm font-bold text-slate-900 mb-2">
            Барлық уақыт
          </h3>
          <p className="text-slate-600 text-sm">
            Сіз{" "}
            <span className="font-semibold text-slate-900">{completed}</span>{" "}
            тапсырманы{" "}
            <span className="text-slate-700">{total}</span>-дан орындадыңыз.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
