"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  CheckCircle2,
  Calendar,
  Users,
  Settings,
} from "lucide-react";
import { useTaskTracker } from "@/lib/storage";

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const { role } = useTaskTracker();

  const items = [
    { href: "/dashboard", label: "ภาพรวม", icon: LayoutDashboard },
    { href: "/tasks", label: "รายการงาน", icon: BookOpen },
    {
      href: "/checker",
      label: role === "teacher" ? "เช็คงาน" : "สถานะส่ง",
      icon: CheckCircle2,
      highlight: role === "teacher",
    },
    { href: "/calendar", label: "ปฏิทิน", icon: Calendar },
    { href: "/students", label: "รายชื่อ", icon: Users },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 lg:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
      <div className="grid grid-cols-5 h-16 max-w-md mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 transition-all relative ${
                isActive
                  ? "text-blue-600 font-semibold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {isActive && (
                <span className="absolute top-0 w-8 h-1 bg-blue-600 rounded-b-full shadow-sm shadow-blue-500/50" />
              )}
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive
                    ? "bg-blue-50 scale-110"
                    : item.highlight
                    ? "bg-amber-50 text-amber-600"
                    : ""
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
