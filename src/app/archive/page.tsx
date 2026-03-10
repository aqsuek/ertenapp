"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  Circle,
  ScrollText,
  CheckCircle2,
  ListFilter,
  Search,
  X,
} from "lucide-react";
import { useTasksForArchive } from "@/hooks/useTasksForArchive";
import { useJournalArchive } from "@/hooks/useJournalArchive";

type FilterId = "all" | "scripts" | "completed";

const FILTERS: { id: FilterId; label: string; icon: React.ComponentType<any> }[] =
  [
    { id: "all", label: "Барлық күндер", icon: ListFilter },
    { id: "scripts", label: "Тек оқиғалар", icon: ScrollText },
    { id: "completed", label: "Толық орындалған", icon: CheckCircle2 },
  ];

function getDateKey(iso: string) {
  return iso.slice(0, 10);
}

function formatDateKey(key: string) {
  const d = new Date(key + "T12:00:00");
  return d.toLocaleDateString("kk-KZ", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function getMonthKey(dateKey: string) {
  // YYYY-MM
  return dateKey.slice(0, 7);
}

function formatMonthLabel(monthKey: string) {
  const d = new Date(monthKey + "-01T12:00:00");
  return d.toLocaleDateString("kk-KZ", {
    month: "short",
    year: "numeric",
  });
}

function getCalendarDays(monthKey: string): { dateKey: string; isCurrentMonth: boolean }[] {
  const [y, m] = monthKey.split("-").map(Number);
  const first = new Date(y, m - 1, 1);
  const last = new Date(y, m, 0);
  const startPad = (first.getDay() + 6) % 7;
  const daysInMonth = last.getDate();
  const prevMonth = new Date(y, m - 2, 1);
  const prevLast = new Date(y, m - 1, 0).getDate();
  const out: { dateKey: string; isCurrentMonth: boolean }[] = [];
  for (let i = startPad - 1; i >= 0; i--) {
    const d = prevLast - i;
    out.push({
      dateKey: `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
      isCurrentMonth: false,
    });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    out.push({
      dateKey: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
      isCurrentMonth: true,
    });
  }
  const rest = 42 - out.length;
  const nextMonth = new Date(y, m, 1);
  for (let d = 1; d <= rest; d++) {
    out.push({
      dateKey: `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
      isCurrentMonth: false,
    });
  }
  return out.slice(0, 42);
}

const WEEKDAYS_KK = ["Дс", "Сс", "Ср", "Бс", "Жм", "Сн", "Жс"];

export default function ArchivePage() {
  const [filter, setFilter] = useState<FilterId>("all");
  const [expandedDate, setExpandedDate] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeMonth, setActiveMonth] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [calendarMonth, setCalendarMonth] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
  const [calendarOpen, setCalendarOpen] = useState(false);

  const { tasks, loading, error: tasksError } = useTasksForArchive();
  const { entries, loading: journalLoading, error: journalError } = useJournalArchive(search);
  const archiveError = tasksError || journalError;

  const { days, months } = useMemo(() => {
    const map = new Map<
      string,
      {
        tasks: typeof tasks;
        journal: string | null;
        // тек жоспарлар мен оқиғалар, кадрлар архивке кірмейді
      }
    >();

    for (const t of tasks) {
      const key = getDateKey(t.created_at);
      const cur = map.get(key) ?? { tasks: [], journal: null };
      cur.tasks.push(t);
      map.set(key, cur);
    }

    for (const e of entries) {
      const key = getDateKey(e.created_at);
      const cur = map.get(key) ?? { tasks: [], journal: null };
      cur.journal = e.content;
      map.set(key, cur);
    }

    const days = Array.from(map.entries())
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, data]) => ({ date, ...data }));

    const monthSet = new Set<string>();
    days.forEach((d) => monthSet.add(getMonthKey(d.date)));
    const months = Array.from(monthSet).sort((a, b) => b.localeCompare(a));

    return { days, months };
  }, [tasks, entries]);

  const datesWithData = useMemo(() => new Set(days.map((d) => d.date)), [days]);

  const filteredDays = useMemo(() => {
    return days.filter((day) => {
      if (selectedDate && day.date !== selectedDate) return false;
      const monthKey = getMonthKey(day.date);
      if (activeMonth && monthKey !== activeMonth) return false;
      if (filter === "scripts" && !day.journal) return false;
      if (filter === "completed") {
        const totalTasks = day.tasks.length;
        const completedTasks = day.tasks.filter((t) => t.is_done).length;
        if (!(totalTasks > 0 && totalTasks === completedTasks)) return false;
      }

      return true;
    });
  }, [days, filter, activeMonth, selectedDate]);

  useEffect(() => {
    if (selectedDate && filteredDays.some((d) => d.date === selectedDate)) {
      setExpandedDate(selectedDate);
    }
  }, [selectedDate, filteredDays]);

  const prevCalendarMonth = () => {
    const [y, m] = calendarMonth.split("-").map(Number);
    if (m === 1) setCalendarMonth(`${y - 1}-12`);
    else setCalendarMonth(`${y}-${String(m - 1).padStart(2, "0")}`);
  };
  const nextCalendarMonth = () => {
    const [y, m] = calendarMonth.split("-").map(Number);
    if (m === 12) setCalendarMonth(`${y + 1}-01`);
    else setCalendarMonth(`${y}-${String(m + 1).padStart(2, "0")}`);
  };

  const isLoadingInitial =
    (loading || journalLoading) && days.length === 0;

  return (
    <div className="min-h-dvh">
      <div className="max-w-lg mx-auto px-4 pt-8 pb-28 space-y-5">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-0.5"
        >
          <h1 className="text-xl font-bold text-slate-900">
            Архив
          </h1>
          <p className="text-sm text-slate-500">
            Өткен күндер мен оқиғалар
          </p>
        </motion.header>

        {archiveError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
            Деректер жүктелмеді. Қайта көріңіз.
          </div>
        )}

        {/* Filter bar */}
        <LayoutGroup>
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 glass-panel rounded-2xl px-3 py-3"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
                {FILTERS.map(({ id, label, icon: Icon }) => {
                  const active = filter === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setFilter(id)}
                      className={`relative px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 flex-shrink-0 ${
                        active
                          ? "bg-slate-900 text-white"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Күнделік бойынша іздеу..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                />
              </div>
            </div>
          </motion.div>

          {/* Month timeline */}
          {months.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 flex items-center gap-2 overflow-x-auto scrollbar-hide"
            >
              <button
                type="button"
                onClick={() => setActiveMonth(null)}
                className={`px-3 py-2 rounded-xl text-xs font-medium flex-shrink-0 transition-colors ${
                  !activeMonth ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Барлығы
              </button>
              {months.map((monthKey) => {
                const active = activeMonth === monthKey;
                return (
                  <button
                    key={monthKey}
                    type="button"
                    onClick={() =>
                      setActiveMonth(active ? null : monthKey)
                    }
                    className={`px-3 py-2 rounded-xl text-xs font-medium flex-shrink-0 transition-colors ${
                      active ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {formatMonthLabel(monthKey)}
                  </button>
                );
              })}
            </motion.div>
          )}
        </LayoutGroup>

        <div className="glass-panel rounded-2xl overflow-hidden">
          {/* Календар — жабу/ашу */}
          <div className="border-b border-slate-100">
            <button
              type="button"
              onClick={() => setCalendarOpen((v) => !v)}
              className="w-full p-3 flex items-center justify-between gap-2 text-left hover:bg-slate-50 transition-colors"
              aria-expanded={calendarOpen}
            >
              <span className="flex items-center gap-2 text-slate-700">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium">Календар</span>
                {selectedDate && (
                  <span className="text-xs text-slate-500 font-normal">
                    — {formatDateKey(selectedDate)}
                  </span>
                )}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-slate-500 transition-transform ${calendarOpen ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence initial={false}>
              {calendarOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-3 pb-3">
                    <div className="flex items-center justify-between mb-3">
                      <button
                        type="button"
                        onClick={prevCalendarMonth}
                        className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                        aria-label="Алдыңғы ай"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="text-sm font-medium text-slate-800">
                        {formatMonthLabel(calendarMonth)}
                      </span>
                      <button
                        type="button"
                        onClick={nextCalendarMonth}
                        className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                        aria-label="Келесі ай"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-7 gap-0.5 text-center">
                      {WEEKDAYS_KK.map((wd) => (
                        <span key={wd} className="text-[10px] font-medium text-slate-400 py-1">
                          {wd}
                        </span>
                      ))}
                      {getCalendarDays(calendarMonth).map(({ dateKey, isCurrentMonth }) => {
                        const hasData = datesWithData.has(dateKey);
                        const isSelected = selectedDate === dateKey;
                        return (
                          <button
                            key={dateKey}
                            type="button"
                            onClick={() => setSelectedDate(dateKey)}
                            className={`aspect-square rounded-lg text-xs font-medium transition-colors ${
                              !isCurrentMonth
                                ? "text-slate-300"
                                : isSelected
                                  ? "bg-[#0400ff] text-white"
                                  : hasData
                                    ? "text-slate-800 bg-slate-100 hover:bg-slate-200"
                                    : "text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            {new Date(dateKey + "T12:00:00").getDate()}
                          </button>
                        );
                      })}
                    </div>
                    {selectedDate && (
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <span className="text-xs text-slate-500">
                          Таңдалған: {formatDateKey(selectedDate)}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedDate(null)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100"
                        >
                          <X className="w-3.5 h-3.5" />
                          Таңдауды алып тастау
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {archiveError ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              Қате орын алды. Бетті жаңартып көріңіз.
            </div>
          ) : isLoadingInitial ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              Жүктелуде...
            </div>
          ) : filteredDays.length === 0 ? (
            <div className="p-10 text-center text-slate-500 text-sm bg-slate-50 rounded-b-2xl">
              <p className="text-base text-slate-700 mb-1">
                Таңдау бойынша жазба жоқ.
              </p>
              <p className="text-xs text-slate-500">
                Фильтрді жеңілдетіп, қайтадан көріңіз.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              <AnimatePresence initial={false}>
                {filteredDays.map(({ date, tasks: dayTasks, journal }) => {
                  const isOpen = expandedDate === date;
                  const totalTasks = dayTasks.length;
                  const completedTasks = dayTasks.filter(
                    (t) => t.is_done
                  ).length;
                  const allDone =
                    totalTasks > 0 && totalTasks === completedTasks;

                  return (
                    <motion.li
                      key={date}
                      layout
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedDate(isOpen ? null : date)
                        }
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex flex-col">
                          <span className="text-slate-900 font-medium">
                            {formatDateKey(date)}
                          </span>
                          <span className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                            {totalTasks > 0 && (
                              <span>
                                {completedTasks}/{totalTasks} тапсырма
                              </span>
                            )}
                            {journal && <span>• оқиға бар</span>}
                            {allDone && (
                              <span className="text-emerald-600">
                                • толық орындалған
                              </span>
                            )}
                          </span>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-500 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden border-t border-slate-100 bg-slate-50"
                          >
                            <div className="p-4 space-y-4">
                              {journal && (
                                <div>
                                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                                    Оқиға
                                  </p>
                                  <p className="text-sm text-slate-700 whitespace-pre-wrap">
                                    {journal}
                                  </p>
                                </div>
                              )}
                              <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                                  Жоспарлар
                                </p>
                                <ul className="space-y-1.5">
                                  {dayTasks.map((t) => (
                                    <li
                                      key={t.id}
                                      className="flex items-center gap-2 text-sm"
                                    >
                                      {t.is_done ? (
                                        <Check className="w-4 h-4 text-slate-600 flex-shrink-0" />
                                      ) : (
                                        <Circle className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                      )}
                                      <span
                                        className={
                                          t.is_done
                                            ? "text-slate-500 line-through"
                                            : "text-slate-800"
                                        }
                                      >
                                        {t.title}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
