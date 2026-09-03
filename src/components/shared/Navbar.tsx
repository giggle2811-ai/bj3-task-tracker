"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTaskTracker } from "@/lib/storage";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Users,
  BarChart3,
  Settings,
  Sparkles,
  UserCheck,
  GraduationCap,
  ChevronDown,
  LayoutDashboard,
  Bell,
  AlertTriangle,
} from "lucide-react";
import { isOverdue, isDueSoon } from "@/lib/utils";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const {
    settings,
    role,
    setRole,
    students,
    activeStudents,
    currentStudentId,
    setCurrentStudentId,
    currentStudent,
    tasks,
    getStudentSubmission,
  } = useTaskTracker();

  const [studentDropdownOpen, setStudentDropdownOpen] = useState(false);

  // Count unsubmitted tasks for current student
  const studentAlerts = React.useMemo(() => {
    if (role !== "student" || !currentStudent) return { overdue: 0, dueSoon: 0 };
    let overdue = 0;
    let dueSoon = 0;

    tasks.forEach((t) => {
      const isDone = getStudentSubmission(t.id, currentStudent.id);
      if (!isDone) {
        if (isOverdue(t.dueDate, t.dueTime)) overdue++;
        else if (isDueSoon(t.dueDate)) dueSoon++;
      }
    });

    return { overdue, dueSoon };
  }, [role, currentStudent, tasks, getStudentSubmission]);

  const navLinks = [
    { href: "/dashboard", label: "ภาพรวม", icon: LayoutDashboard },
    { href: "/tasks", label: "รายการงาน", icon: BookOpen },
    { href: "/checker", label: "เช็คงานรายคน", icon: CheckCircle2, badge: role === "teacher" ? "คุณครู" : undefined },
    { href: "/students", label: "รายชื่อห้อง", icon: Users },
    { href: "/calendar", label: "ปฏิทินส่งงาน", icon: Calendar },
    { href: "/statistics", label: "สถิติห้อง", icon: BarChart3 },
    { href: "/settings", label: "ตั้งค่า", icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
      {/* Top Notification / Class ticker banner */}
      <div className="bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 text-white text-xs py-1 px-4 text-center font-medium flex items-center justify-between">
        <div className="flex items-center gap-1.5 mx-auto">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
          <span>
            {settings.schoolName} • ชั้น{settings.gradeLevel}/{settings.roomNumber} ปีการศึกษา {settings.academicYear} (เทอม {settings.semester})
          </span>
        </div>
        <span className="hidden md:inline-block text-[11px] bg-white/20 px-2 py-0.5 rounded-full font-mono">
          นักเรียน {activeStudents.length} คน
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Logo / Brand */}
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <span className="text-sm font-extrabold tracking-tight">4/10</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-800 text-base sm:text-lg tracking-tight group-hover:text-blue-600 transition-colors">
                  Task Tracker
                </span>
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                  บ.จ. ๓
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                ระบบติดตามและตรวจสอบการส่งงานห้อง {settings.gradeLevel}/{settings.roomNumber}
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-blue-50 text-blue-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-1.5 py-0.2 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: Role Switcher & Student Selector */}
          <div className="flex items-center gap-2">
            {/* Mode Switcher pill button */}
            <div className="inline-flex p-0.5 bg-slate-100 rounded-xl border border-slate-200 text-xs font-medium">
              <button
                onClick={() => setRole("student")}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${
                  role === "student"
                    ? "bg-white text-blue-700 shadow-sm font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="เข้าสู่โหมดนักเรียน: ดูเฉพาะงานค้างของตนเอง"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">นักเรียน</span>
              </button>
              <button
                onClick={() => setRole("teacher")}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${
                  role === "teacher"
                    ? "bg-blue-600 text-white shadow-sm font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="เข้าสู่โหมดคุณครู / หัวหน้าห้อง: เช็คงานและทวงงานรายบุคคล"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">ครู/หัวหน้าห้อง</span>
              </button>
            </div>

            {/* Student Picker (Visible in Student mode) */}
            {role === "student" && (
              <div className="relative">
                <button
                  onClick={() => setStudentDropdownOpen(!studentDropdownOpen)}
                  className="flex items-center gap-1.5 bg-sky-50 hover:bg-sky-100/80 border border-sky-200 text-sky-900 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all max-w-[160px] sm:max-w-[210px]"
                >
                  <div className="w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                    {currentStudent?.seatNumber || 1}
                  </div>
                  <span className="truncate font-semibold text-slate-800">
                    {currentStudent?.name.split(" ")[0] || "เลือกชื่อ"}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                </button>

                {/* Dropdown Menu */}
                {studentDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setStudentDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 max-h-80 overflow-y-auto bg-white rounded-2xl shadow-xl border border-slate-200 z-50 p-2">
                      <div className="px-3 py-2 border-b border-slate-100 text-xs text-slate-500 font-semibold">
                        เลือกบัญชีนักเรียน (ม.4/10)
                      </div>
                      <div className="divide-y divide-slate-50 mt-1">
                        {students.map((student) => {
                          const isSelected = student.id === currentStudentId;
                          const isResigned = student.status === "resigned";
                          return (
                            <button
                              key={student.id}
                              disabled={isResigned}
                              onClick={() => {
                                setCurrentStudentId(student.id);
                                setStudentDropdownOpen(false);
                              }}
                              className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                                isResigned
                                  ? "opacity-40 cursor-not-allowed bg-slate-50 text-slate-400"
                                  : isSelected
                                  ? "bg-blue-50 text-blue-700 font-semibold"
                                  : "text-slate-700 hover:bg-slate-50"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                                    isResigned
                                      ? "bg-slate-200 text-slate-500"
                                      : isSelected
                                      ? "bg-blue-600 text-white"
                                      : "bg-slate-100 text-slate-600"
                                  }`}
                                >
                                  {student.seatNumber}
                                </span>
                                <span className="truncate">{student.name}</span>
                              </div>
                              {isResigned && (
                                <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">
                                  ลาออก
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Quick alert badge for student */}
            {role === "student" && studentAlerts.overdue > 0 && (
              <Link
                href="/tasks?filter=overdue"
                className="relative p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-all"
                title={`คุณมีงานเลยกำหนดส่ง ${studentAlerts.overdue} งาน!`}
              >
                <AlertTriangle className="w-4 h-4 animate-bounce" />
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {studentAlerts.overdue}
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
