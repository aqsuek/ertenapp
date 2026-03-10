"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ImagePlus, Loader2, RotateCcw } from "lucide-react";
import { useFrames } from "@/hooks/useFrames";
import { uploadFrame } from "@/lib/upload";
import { getTodayKeyLocal, isFrameFromToday } from "@/lib/date";

export function DailyFrame() {
  const { frames, addFrame } = useFrames();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingCaption, setPendingCaption] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const todayKey = getTodayKeyLocal(new Date());
  const todayFrame = useMemo(
    () => frames.find((f) => isFrameFromToday(f.created_at, todayKey)) ?? null,
    [frames, todayKey]
  );

  const previewUrl = useMemo(
    () => (pendingFile ? URL.createObjectURL(pendingFile) : null),
    [pendingFile]
  );

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const openPicker = useCallback(() => {
    setError(null);
    inputRef.current?.click();
  }, []);

  const MAX_FILE_SIZE_MB = 10;
  const MAX_FILE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

  const handleFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !file.type.startsWith("image/")) return;
      setError(null);
      if (file.size > MAX_FILE_BYTES) {
        setError(`Файл тым үлкен. Максимум ${MAX_FILE_SIZE_MB} МБ.`);
        e.target.value = "";
        return;
      }
      setSaved(false);
      setPendingFile(file);
      setPendingCaption("");
      e.target.value = "";
    },
    []
  );

  const handleSave = useCallback(
    async () => {
      if (!pendingFile) return;
      setError(null);
      setUploading(true);
      try {
        const url = await uploadFrame(pendingFile);
        const caption = pendingCaption.trim() || `Бүгінгі кадр – ${todayKey}`;
        await addFrame(url, caption);
        setSaved(true);
        setPendingFile(null);
        setPendingCaption("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
        if (inputRef.current) inputRef.current.value = "";
      }
    },
    [pendingFile, pendingCaption, addFrame, todayKey]
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-panel rounded-2xl overflow-hidden"
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="sr-only"
        aria-label="Фото таңдау"
      />
      <div className="relative aspect-[16/9] bg-slate-100 flex items-center justify-center min-h-[140px]">
        <AnimatePresence mode="wait">
          {uploading ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-2 text-slate-400"
            >
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-xs">Жүктелуде...</span>
            </motion.div>
          ) : previewUrl ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <Image
                src={previewUrl}
                alt="Таңдалған фото"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
                unoptimized
              />
              <div className="absolute inset-x-0 bottom-0 pt-8 pb-2 px-2 card-overlay rounded-b-2xl">
                <span className="text-white font-semibold text-sm">Таңдалған кадр</span>
              </div>
            </motion.div>
          ) : todayFrame ? (
            <motion.div
              key="saved"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center gap-2.5 py-3"
            >
              <span className="text-sm font-semibold text-slate-800">Сақталды</span>
              <button
                type="button"
                onClick={openPicker}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[#0400ff] text-white hover:bg-[#0300cc] transition-colors"
              >
                Тағы жүктеу
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center gap-3 py-4"
            >
              <button
                type="button"
                onClick={openPicker}
                className="inline-flex flex-col items-center gap-2 w-full max-w-[200px] py-4 px-4 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-600 hover:border-[#0400ff] hover:bg-blue-50/50 hover:text-[#0400ff] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0400ff] focus:ring-offset-2"
              >
                <ImagePlus className="w-8 h-8 text-slate-400" aria-hidden />
                <span className="text-sm font-medium">Кадрды таңдау</span>
                <span className="text-xs text-slate-400">немесе камерадан түсіру</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <p className="absolute bottom-2 left-2 right-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg py-2 px-3">
            {error}
          </p>
        )}
      </div>
      {previewUrl && (
        <div className="px-3 py-2 border-t border-slate-100">
          <label className="block text-xs font-medium text-slate-600 mb-1.5">
            Фото тақырыбы
          </label>
          <input
            type="text"
            value={pendingCaption}
            onChange={(e) => setPendingCaption(e.target.value)}
            placeholder="Тақырып жазыңыз (міндетті емес)"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0400ff] focus:ring-1 focus:ring-[#0400ff]"
          />
        </div>
      )}
      <div className="px-3 py-2 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
        <span className="text-xs text-slate-500">
          {todayFrame && !pendingFile ? "Сақталды" : previewUrl ? "Таңдалған фото" : "Бүгінгі кадр"}
        </span>
        <div className="flex items-center gap-2">
          {previewUrl && (
            <button
              type="button"
              onClick={openPicker}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Басқасын таңдау
            </button>
          )}
          {todayFrame && !pendingFile ? (
            <button
              type="button"
              onClick={openPicker}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-[#0400ff] text-white hover:bg-[#0300cc] transition-colors"
            >
              Тағы жүктеу
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              disabled={uploading || !pendingFile}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-[#0400ff] text-white hover:bg-[#0300cc] disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              {uploading ? "Сақталуда..." : "Сақтау"}
            </button>
          )}
        </div>
      </div>
    </motion.section>
  );
}
