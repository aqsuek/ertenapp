"use client";

export function HomeSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="rounded-2xl bg-slate-200 h-32" />
      <div className="rounded-2xl bg-slate-200 h-40" />
      <div className="rounded-2xl overflow-hidden">
        <div className="h-12 bg-slate-200" />
        <div className="p-4 space-y-3">
          <div className="h-10 bg-slate-100 rounded-xl" />
          <div className="h-8 bg-slate-100 rounded-xl w-3/4" />
          <div className="h-8 bg-slate-100 rounded-xl w-1/2" />
        </div>
      </div>
    </div>
  );
}
