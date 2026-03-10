"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ImageIcon,
  ArrowLeft,
  Trash2,
  Check,
  X,
} from "lucide-react";
import { useFrames } from "@/hooks/useFrames";

export default function FramesPage() {
  const { frames, loading, deleteFrame } = useFrames();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const selected = selectedId
    ? frames.find((f) => f.id === selectedId)
    : null;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const exitSelectionMode = () => {
    setSelectionMode(false);
    setSelectedIds(new Set());
  };

  const handleDeleteSelected = async () => {
    const ids = Array.from(selectedIds);
    for (const id of ids) {
      await deleteFrame(id);
    }
    exitSelectionMode();
  };

  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!selected) return;
    closeButtonRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedId(null);
      if (e.key !== "Tab" || !modalRef.current) return;
      const focusable = modalRef.current.querySelectorAll<HTMLElement>("button, [href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])");
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected]);

  return (
    <div className="min-h-dvh">
      <div className="max-w-lg mx-auto px-4 pt-6 pb-28">
        {/* Заголовок — всегда сверху */}
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-slate-700" aria-hidden />
            Кадрлар
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Барлық күнделікті кадрлар
          </p>
        </motion.header>

        {/* Панель таңдау: или кнопка «Таңдау», или бар с Жабу / счётчик / Өшіру */}
        {frames.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4"
          >
            {selectionMode ? (
              <div className="flex items-center justify-between gap-3 py-2.5 px-3 rounded-xl bg-slate-100 border border-slate-200">
                <button
                  type="button"
                  onClick={exitSelectionMode}
                  className="text-sm font-medium text-slate-700 hover:text-slate-900"
                >
                  Жабу
                </button>
                <span className="text-sm text-slate-600 tabular-nums">
                  Таңдалған: {selectedIds.size}
                </span>
                <button
                  type="button"
                  onClick={handleDeleteSelected}
                  disabled={selectedIds.size === 0}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Өшіру
                </button>
              </div>
            ) : (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectionMode(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                >
                  Таңдау
                </button>
              </div>
            )}
          </motion.div>
        )}

        {loading ? (
          <div className="py-16 text-center text-slate-500 text-sm">
            Жүктелуде...
          </div>
        ) : frames.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-panel rounded-2xl p-10 text-center"
          >
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-7 h-7 text-slate-400" />
            </div>
            <p className="text-slate-600 font-medium mb-1">Әзірге кадр жоқ</p>
            <p className="text-slate-500 text-sm mb-6">
              Бүгінгі кадрды басты беттен қосыңыз
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-[#0400ff] text-white hover:bg-[#0300cc] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Басты бетке
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {frames.map((frame, i) => {
              const d = new Date(frame.created_at);
              const formatted = d.toLocaleDateString("kk-KZ", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              });
              const isSelected = selectedIds.has(frame.id);
              return (
                <motion.button
                  key={frame.id}
                  type="button"
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: Math.min(i * 0.02, 0.15) }}
                  className={`relative aspect-square rounded-xl overflow-hidden transition-all focus:outline-none focus:ring-2 focus:ring-[#0400ff] focus:ring-offset-2 ${
                    selectionMode
                      ? isSelected
                        ? "ring-2 ring-[#0400ff] ring-offset-2"
                        : "opacity-90 hover:opacity-100"
                      : "hover:opacity-95 active:scale-[0.98]"
                  }`}
                  onClick={() =>
                    selectionMode
                      ? toggleSelect(frame.id)
                      : setSelectedId(frame.id)
                  }
                >
                  <Image
                    src={frame.image_url}
                    alt={frame.caption ?? "Кадр"}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-x-0 bottom-0 pt-6 pb-1.5 px-2 bg-gradient-to-t from-black/70 to-transparent">
                    <span className="text-white text-[10px] font-medium drop-shadow-sm">
                      {formatted}
                    </span>
                  </div>
                  {selectionMode && (
                    <div
                      className={`absolute right-2 top-2 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
                        isSelected
                          ? "bg-[#0400ff] border-[#0400ff]"
                          : "bg-white/90 border-white"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      {/* Кадрды толық экранда көру */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelectedId(null)}
          >
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selected.image_url}
                alt={selected.caption ?? "Кадр"}
                fill
                className="object-contain"
                unoptimized
              />
              {selected.caption && (
                <p className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-sm text-white">
                  {selected.caption}
                </p>
              )}
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setSelectedId(null)}
                className="absolute right-3 top-3 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                aria-label="Жабу"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
