"use client";

import React, { useState } from "react";
import { useTaskTracker } from "@/lib/storage";
import {
  Sparkles,
  GraduationCap,
  UserCheck,
  Plus,
  Calendar,
  AlertCircle,
  Award,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { TaskFormModal } from "../tasks/TaskFormModal";

export const RoleBanner: React.FC = () => {
  const {
    settings,
    role,
    setRole,
    currentStudent,
    getStudentStats,
    tasks,
    activeStudents,
  } = useTaskTracker();

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const studentStats = currentStudent ? getStudentStats(currentStudent.id) : null;

  // Calculate classroom average completion
  const classAvgPercentage = React.useMemo(() => {
    if (activeStudents.length === 0 || tasks.length === 0) return 0;
    let totalScore = 0;
    activeStudents.forEach((s) => {
      const stats = getStudentStats(s.id);
      totalScore += stats.percentage;
    });
    return Math.round(totalScore / activeStudents.length);
  }, [activeStudents, tasks, getStudentStats]);

  return (
    <>
      <div className="bg-gradient-to-br from-blue-600 via-sky-600 to-indigo-700 rounded-3xl p-5 sm:p-7 text-white shadow-lg shadow-blue-500/15 relative overflow-hidden">
        {/* Background decorative circles */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-sky-400/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Left: Greeting and Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md border border-white/25">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>{settings.schoolName}</span>
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 shadow-sm">
                ชั้น {settings.gradeLevel}/{settings.roomNumber}
              </span>
              <span className="text-xs text-blue-100 font-medium">
                ภาคเรียนที่ {settings.semester}/{settings.academicYear}
              </span>
            </div>

            {role === "student" && currentStudent ? (
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
                  สวัสดี, เลขที่ {currentStudent.seatNumber} {currentStudent.name} 👋
                </h1>
                <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-xl leading-relaxed">
                  {studentStats?.pending === 0
                    ? "สุดยอดมาก! 🎉 คุณเคลียร์งานครบทุกชิ้นแล้ว พร้อมรับคะแนนเต็ม!"
                    : studentStats?.overdue && studentStats.overdue > 0
                    ? `คุณมีงานค้างส่ง ${studentStats.pending} งาน (เกินกำหนด ${studentStats.overdue} งาน) รีบเคลียร์ส่งครูนะ!`
                    : `คุณมีงานที่ต้องส่ง ${studentStats?.pending} งาน สู้ๆ นะครับ! 🚀`}
                </p>
              </div>
            ) : (
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
                  โหมดจัดการงาน • คุณครูและหัวหน้าห้อง 👨‍🏫
                </h1>
                <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-xl leading-relaxed">
                  ติดตามการส่งงานของนักเรียน ม.{settings.roomNumber ? `${settings.gradeLevel}/${settings.roomNumber}` : settings.gradeLevel} ทั้งหมด {activeStudents.length} คน • อัตราการส่งงานเฉลี่ยทั้งห้อง {classAvgPercentage}%
                </p>
              </div>
            )}
          </div>

          {/* Right: Quick CTA Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            {role === "teacher" ? (
              <>
                <button
                  onClick={() => setIsTaskModalOpen(true)}
                  className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all btn-press"
                >
                  <Plus className="w-4 h-4" />
                  <span>สั่งงานใหม่</span>
                </button>
                <Link
                  href="/checker"
                  className="px-4 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 border border-white/20 transition-all"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>ตารางเช็คงาน</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/tasks"
                  className="px-4 py-2.5 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-black/10 transition-all btn-press"
                >
                  <span>ดูงานค้างของฉัน</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/calendar"
                  className="px-4 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 border border-white/20 transition-all"
                >
                  <Calendar className="w-4 h-4" />
                  <span>ปฏิทินส่งงาน</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {isTaskModalOpen && (
        <TaskFormModal onClose={() => setIsTaskModalOpen(false)} />
      )}
    </>
  );
};
