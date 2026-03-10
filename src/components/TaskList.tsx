"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function TaskList() {
  const todayKey = getTodayKey();
  const { tasks, loading, addTask, toggleTask, deleteTask } =
    useTasks(todayKey);
  const [input, setInput] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  const completed = tasks.filter((t) => t.is_done).length;
  const total = tasks.length;
  const progress = total > 0 ? (completed / total) * 100 : 0;

  const handleAdd = async () => {
    const title = input.trim();
    if (!title) return;
    setInput("");
    setActionError(null);
    try {
      await addTask(title);
    } catch {
      setActionError("Тапсырма қосылмады. Қайта көріңіз.");
    }
  };

  const handleToggle = async (id: string, is_done: boolean) => {
    setActionError(null);
    try {
      await toggleTask(id, is_done);
    } catch {
      setActionError("Өзгеріс сақталмады. Қайта көріңіз.");
    }
  };

  const handleDelete = async (id: string) => {
    setActionError(null);
    try {
      await deleteTask(id);
    } catch {
      setActionError("Өшіру сәтсіз аяқталды. Қайта көріңіз.");
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="glass-panel rounded-2xl overflow-hidden"
    >
      <div className="px-4 pt-4 pb-3 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-900">
          Ертеңгі жоспарлар
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            {completed}/{total}
          </span>
          <div className="w-14 h-1.5 rounded-full bg-slate-200 overflow-hidden">
            <motion.div
              className="h-full bg-slate-700 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      <div className="p-3">
        {actionError && (
          <div className="mb-3 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between gap-2">
            <p className="text-xs text-red-700 flex-1">{actionError}</p>
            <button
              type="button"
              onClick={() => setActionError(null)}
              className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200"
            >
              Жабу
            </button>
          </div>
        )}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Жоспар қосу..."
            className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
            disabled={loading}
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            aria-label="Тапсырма қосу"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <ul className="space-y-2">
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.li
                key={task.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className={`group flex items-center gap-3 py-2.5 px-3.5 rounded-xl border ${
                  task.is_done
                    ? "gradient-card-lime-cyan border-transparent text-white"
                    : "bg-white border-slate-200"
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleToggle(task.id, !task.is_done)}
                  className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all border-2 ${
                    task.is_done
                      ? "bg-white border-white"
                      : "bg-white border-slate-300 hover:border-slate-500"
                  }`}
                  aria-label={
                    task.is_done ? "Аяқталмады деп белгілеу" : "Аяқталды деп белгілеу"
                  }
                >
                  {task.is_done && (
                    <span className="w-2 h-2 rounded-full bg-slate-800" />
                  )}
                </button>
                <span
                  className={`flex-1 text-sm ${
                    task.is_done
                      ? "text-white/90 line-through"
                      : "text-slate-800"
                  }`}
                >
                  {task.title}
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(task.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-500 hover:text-red-500 transition-all"
                  aria-label="Тапсырманы өшіру"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {tasks.length === 0 && !loading && (
          <p className="text-sm text-slate-500 py-6 text-center">
            Әзірге жоспар жоқ. Жоғарыдан қосыңыз.
          </p>
        )}
      </div>
    </motion.section>
  );
}
