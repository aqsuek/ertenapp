"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useTasks } from "@/hooks/useTasks";

type Variant = "large" | "small";

type Props = {
  variant?: Variant;
};

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function AchievementsRing({ variant = "large" }: Props) {
  const todayKey = getTodayKey();
  const { tasks } = useTasks(todayKey);

  const { completed, total, percent } = useMemo(() => {
    const completed = tasks.filter((t) => t.is_done).length;
    const total = tasks.length;
    const raw = total > 0 ? (completed / total) * 100 : 0;
    return {
      completed,
      total,
      percent: Math.round(raw),
    };
  }, [tasks]);

  const size = variant === "large" ? 210 : 115;
  const stroke = variant === "large" ? 8 : 6;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - percent / 100);

  const isDone = total > 0 && percent === 100;

  return (
    <motion.div
      className="relative inline-flex items-center justify-center"
      animate={
        isDone
          ? {
              scale: [1, 1.05, 1],
            }
          : { scale: 1 }
      }
      transition={
        isDone
          ? {
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
            }
          : undefined
      }
    >
      <svg
        width={size}
        height={size}
        className="absolute inset-0 rotate-[-90deg]"
        aria-hidden
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={stroke}
        />
      </svg>
      <svg
        width={size}
        height={size}
        className="relative rotate-[-90deg]"
        aria-hidden
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#achievementsGradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="achievementsGradient">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className={`font-bold tabular-nums text-slate-900 ${
            variant === "large" ? "text-2xl" : "text-lg"
          }`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          {percent}%
        </motion.span>
        <span className="text-[11px] text-slate-500">
          Ертеңгі жоспарлар
        </span>
        {total === 0 && (
          <span className="mt-1 text-[10px] text-slate-400">
            Алғашқы жоспарды күтіп тұр...
          </span>
        )}
      </div>
    </motion.div>
  );
}

