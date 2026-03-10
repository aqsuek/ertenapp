"use client";

import { useState, useEffect } from "react";
import { WifiOff } from "lucide-react";

export function OfflineBanner() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setOnline(typeof navigator !== "undefined" ? navigator.onLine : true);
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  if (online) return null;

  return (
    <div
      className="sticky top-0 z-[60] py-2 px-4 bg-amber-500 text-white text-center text-sm font-medium flex items-center justify-center gap-2"
      role="status"
      aria-live="polite"
    >
      <WifiOff className="w-4 h-4 flex-shrink-0" aria-hidden />
      Интернет байланысы жоқ. Деректер сақталмайды.
    </div>
  );
}
