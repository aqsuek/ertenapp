"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { DailyNarrative } from "@/components/DailyNarrative";

export default function JournalPage() {
  return (
    <div className="min-h-dvh">
      <div className="max-w-lg mx-auto px-4 pt-8 pb-28">
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-xl font-bold text-slate-900">
            Күнделік
          </h1>
          <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            Бүгінгі оқиға
          </p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <DailyNarrative />
        </motion.div>

        <p className="text-xs text-slate-500 mt-6 text-center">
          Сақтау батырмасын басыңыз.
        </p>
      </div>
    </div>
  );
}
