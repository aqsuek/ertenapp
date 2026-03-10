"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Archive, BookOpen, BarChart3, ImageIcon } from "lucide-react";

const navItems = [
  { href: "/", label: "Басты", icon: Home },
  { href: "/archive", label: "Архив", icon: Archive },
  { href: "/journal", label: "Күнделік", icon: BookOpen },
  { href: "/stats", label: "Статистика", icon: BarChart3 },
  { href: "/frames", label: "Кадрлар", icon: ImageIcon },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-4 left-0 right-0 z-50 safe-bottom px-4"
      aria-label="Main navigation"
    >
      <div className="max-w-lg mx-auto h-14 rounded-2xl flex items-center justify-around px-2 bg-[#0400ff] shadow-xl">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className="relative flex flex-col items-center justify-center min-w-[52px] h-10 rounded-xl transition-colors"
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && (
                <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-red-400" />
              )}
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isActive ? "text-white" : "text-white/80"
                }`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={`text-[10px] font-medium ${
                  isActive ? "text-white" : "text-white/80"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
