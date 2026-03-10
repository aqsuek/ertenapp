"use client";

import { motion } from "framer-motion";

const SIZE = 200;
const STROKE = 10;
const R = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * R;

type Props = {
  completed: number;
  total: number;
  className?: string;
};

export function ProgressRing({ completed, total, className = "" }: Props) {
  const value = total > 0 ? completed / total : 0;
  const offset = CIRCUMFERENCE * (1 - value);

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
    >
      <svg
        width={SIZE}
        height={SIZE}
        className="absolute inset-0 rotate-[-90deg]"
        aria-hidden
      >
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke="rgba(0, 245, 255, 0.15)"
          strokeWidth={STROKE + 8}
          className="blur-md"
        />
      </svg>
      <svg
        width={SIZE}
        height={SIZE}
        className="relative rotate-[-90deg]"
        style={{
          filter:
            "drop-shadow(0 0 8px rgba(0,245,255,0.4)) drop-shadow(0 0 20px rgba(0,245,255,0.2))",
        }}
        aria-hidden
      >
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={STROKE}
        />
        <motion.circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          initial={{ strokeDashoffset: CIRCUMFERENCE }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <defs>
          <linearGradient
            id="progressGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#00f5ff" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-4xl font-semibold tabular-nums text-slate-100"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          {completed}
        </motion.span>
        <span className="text-sm text-slate-500">барлығы {total}</span>
        <span className="text-xs text-slate-600 mt-0.5">
          тапсырма орындалды
        </span>
      </div>
    </div>
  );
}
