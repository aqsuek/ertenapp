"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useJournal } from "@/hooks/useJournal";

const MOOD_LABELS: Record<number, string> = {
  0: "Өте жаман",
  1: "Жаман",
  2: "Орташа",
  3: "Жақсы",
  4: "Өте жақсы",
};

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function formatDateTime(date: Date) {
  return date.toLocaleDateString("kk-KZ", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatSavedAt(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("kk-KZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function DailyNarrative() {
  const todayKey = getTodayKey();
  const { entry, loading, upsertJournal } = useJournal(todayKey);
  const [content, setContent] = useState("");
  const [mood, setMood] = useState(2);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (entry) {
      setContent(entry.content);
      setMood(typeof entry.mood === "number" ? Math.min(4, Math.max(0, entry.mood)) : 2);
    } else {
      setContent("");
      setMood(2);
    }
    setDirty(false);
    setSaved(false);
  }, [entry?.id, entry?.content, entry?.mood]);

  const handleSave = async () => {
    const trimmed = content.trim();
    if (!trimmed) return;
    setSaveError(null);
    setSaving(true);
    try {
      await upsertJournal(trimmed, mood);
      setSaved(true);
      setDirty(false);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Сақтау сәтсіз аяқталды. Қайта көріңіз.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="glass-panel rounded-2xl overflow-hidden"
    >
      <div className="px-4 pt-4 pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h2 className="text-sm font-bold text-slate-900">
            Бүгінгі оқиға
          </h2>
          {saving && (
            <span className="text-xs text-slate-500">Сақталуда...</span>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-1.5" aria-live="polite">
          {entry?.updated_at
            ? `Сақталған: ${formatSavedAt(entry.updated_at)}`
            : `Күн: ${formatDateTime(now)}`}
        </p>
      </div>
      <div className="p-4">
        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setDirty(true);
            setSaved(false);
          }}
          placeholder="Бүгінгі оқиғаңызды жазыңыз..."
          rows={4}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-800 placeholder:text-slate-400 resize-none focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300 text-sm leading-relaxed"
          disabled={loading}
        />
        {!entry && !content.trim() && !loading && (
          <p className="text-xs text-slate-400 mt-2">Әзірге оқиға жазбаңыз жоқ. Жоғарыда жазып, Сақтау басыңыз.</p>
        )}
        {saveError && (
          <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between gap-2">
            <p className="text-xs text-red-700 flex-1">{saveError}</p>
            <button
              type="button"
              onClick={() => { setSaveError(null); handleSave(); }}
              className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200"
            >
              Қайталау
            </button>
          </div>
        )}

        <div className="mt-4">
          <div className="flex items-center justify-between gap-3 mb-2">
            <span className="text-xs font-medium text-slate-600">Көңіл күйі</span>
            <span
              className="text-sm font-medium text-slate-800 min-w-[100px] text-right transition-colors"
              aria-live="polite"
            >
              {MOOD_LABELS[mood]}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={4}
            step={1}
            value={mood}
            onChange={(e) => {
              const v = Number(e.target.value);
              setMood(v);
              setDirty(true);
              setSaved(false);
            }}
            className="w-full h-2 rounded-full appearance-none bg-slate-200 accent-[#0400ff] cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#0400ff] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
            aria-label="Көңіл күйі"
          />
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          {saved && (
            <span className="text-xs text-slate-500">Сақталды</span>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !dirty || !content.trim()}
            className="ml-auto px-4 py-2 rounded-xl text-sm font-medium bg-[#0400ff] text-white hover:bg-[#0300cc] disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            {saving ? "Сақталуда..." : "Сақтау"}
          </button>
        </div>
      </div>
    </motion.section>
  );
}
