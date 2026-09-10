"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  LogOut,
  School,
  Edit3,
} from "lucide-react";
import { getClassLabel } from "@/lib/schoolStructure";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const {
    settings,
    role,
    teacherProfile,
    currentClassLabel,
    selectedClassId,
    switchClass,
    students,
    activeStudents,
    currentStudentId,
    switchStudent,
    currentStudent,
    logout,
  } = useTaskTracker();

  const [studentDropdownOpen, setStudentDropdownOpen] = useState(false);
  const [classDropdownOpen, setClassDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navLinks = [
    { href: "/dashboard", label: "ภาพรวม", icon: LayoutDashboard },
    { href: "/tasks", label: "รายการงาน", icon: BookOpen },
    { href: "/checker", label: "เช็คงานรายคน", icon: CheckCircle2, teacherOnly: true },
    { href: "/students", label: "รายชื่อห้อง", icon: Users },
    { href: "/calendar", label: "ปฏิทิน", icon: Calendar },
    { href: "/statistics", label: "สถิติ", icon: BarChart3 },
    ...(role === "teacher"
      ? [{ href: "/teacher", label: "จัดการห้องเรียน", icon: Edit3, highlight: true }]
      : []),
    { href: "/settings", label: "ตั้งค่า", icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
      {/* Top Notification / Class ticker banner */}
      <div className="bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 text-white text-xs py-1 px-4 text-center font-medium flex items-center justify-between">
        <div className="flex items-center gap-1.5 mx-auto">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
          <span>
            {settings.schoolName} • ห้อง {currentClassLabel} ปีการศึกษา {settings.academicYear} (เทอม {settings.semester})
          </span>
        </div>
        <div className="hidden md:flex items-center gap-2 text-[11px]">
          <span className="bg-white/20 px-2 py-0.5 rounded-full font-mono">
            นักเรียน {activeStudents.length} คน
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Logo / Brand */}
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <span className="text-sm font-extrabold tracking-tight">บ.จ.๓</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-800 text-base sm:text-lg tracking-tight group-hover:text-blue-600 transition-colors">
                  Task Tracker
                </span>
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                  {currentClassLabel}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                ระบบติดตามและตรวจสอบการส่งงาน
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
                      ? "bg-blue-50 text-blue-600 shadow-sm font-bold"
                      : link.highlight
                      ? "bg-amber-50 text-amber-800 hover:bg-amber-100 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right: Auth Profile / Role / Room Switcher */}
          <div className="flex items-center gap-2">
            {/* Teacher View Header */}
            {role === "teacher" ? (
              <div className="flex items-center gap-1.5">
                <Link
                  href="/teacher"
                  className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-800 px-2.5 py-1.5 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors"
                >
                  <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span className="truncate max-w-[120px]">{teacherProfile?.name?.split(" ")[0] || "ครูผู้สอน"}</span>
                  <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.2 rounded-md">
                    {currentClassLabel}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="ออกจากระบบ / สลับบทบาท"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Student View Header */
              <div className="flex items-center gap-1.5">
                {/* Switch Room Button */}
                <Link
                  href="/login"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                  title="เปลี่ยนห้องเรียน"
                >
                  <School className="w-3.5 h-3.5 text-slate-500" />
                  <span>ห้อง {currentClassLabel}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </Link>

                {/* Student Picker dropdown (if class has students) */}
                {students.length > 0 && (
                  <div className="relative">
                    <button
                      onClick={() => setStudentDropdownOpen(!studentDropdownOpen)}
                      className="flex items-center gap-1.5 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-900 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all max-w-[150px] sm:max-w-[190px]"
                    >
                      <div className="w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                        {currentStudent?.seatNumber || 1}
                      </div>
                      <span className="truncate font-semibold text-slate-800">
                        {currentStudent?.name.split(" ")[0] || "เลือกชื่อฉัน"}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    </button>

                    {studentDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setStudentDropdownOpen(false)}
                        />
                        <div className="absolute right-0 mt-2 w-64 max-h-80 overflow-y-auto bg-white rounded-2xl shadow-xl border border-slate-200 z-50 p-2">
                          <div className="px-3 py-2 border-b border-slate-100 text-xs text-slate-500 font-semibold">
                            เลือกชื่อของฉัน (ห้อง {currentClassLabel})
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
                                    switchStudent(student.id);
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

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="สลับเป็นอาจารย์ / ออกจากระบบ"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
