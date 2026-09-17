"use client";

import React from "react";
import { useTaskTracker } from "@/lib/storage";
import {
  BookOpen,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Award,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { isOverdue, isDueSoon } from "@/lib/utils";

export const StatCards: React.FC = () => {
  const {
    role,
    currentStudent,
    currentClassLabel,
    tasks,
    getStudentSubmission,
    activeStudents,
    getStudentStats,
  } = useTaskTracker();

  // Student specific stats
  const studentMetrics = React.useMemo(() => {
    if (!currentStudent) return { total: 0, pending: 0, dueSoon: 0, overdue: 0, submitted: 0, percentage: 0 };
    return getStudentStats(currentStudent.id);
  }, [currentStudent, getStudentStats]);

  // Class wide metrics (for teacher or general stats)
  const classMetrics = React.useMemo(() => {
    const totalTasks = tasks.length;
    let totalSubmissionsRequired = totalTasks * activeStudents.length;
    let totalSubmissionsDone = 0;
    let totalOverdueCount = 0;

    tasks.forEach((t) => {
      activeStudents.forEach((s) => {
        const isDone = getStudentSubmission(t.id, s.id);
        if (isDone) totalSubmissionsDone++;
        else if (isOverdue(t.dueDate, t.dueTime)) totalOverdueCount++;
      });
    });

    const completionRate =
      totalSubmissionsRequired > 0
        ? Math.round((totalSubmissionsDone / totalSubmissionsRequired) * 100)
        : 0;

    return {
      totalTasks,
      totalSubmissionsDone,
      totalSubmissionsRequired,
      totalOverdueCount,
      completionRate,
    };
  }, [tasks, activeStudents, getStudentSubmission]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* 1. Total Tasks */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-subtle hover:shadow-card transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500">
            {role === "student" ? "งานที่ได้รับมอบหมาย" : "งานที่สั่งทั้งหมด"}
          </span>
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-800">
            {tasks.length}
          </span>
          <span className="text-xs text-slate-400 font-medium">รายการ</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
          <Zap className="w-3 h-3 text-blue-500" />
          <span>ทุกรายวิชาในภาคเรียนนี้</span>
        </div>
      </div>

      {/* 2. Pending Tasks */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200/80 shadow-subtle hover:shadow-card transition-all bg-gradient-to-b from-white to-amber-50/20">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-amber-700">
            {role === "student" ? "งานที่ยังไม่ส่ง (ค้างอยู่)" : "ยังส่งไม่ครบทั้งห้อง"}
          </span>
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-amber-600">
            {role === "student" ? studentMetrics.pending : tasks.length}
          </span>
          <span className="text-xs text-amber-700/80 font-medium">รายการ</span>
        </div>
        <div className="mt-2 text-[11px] text-amber-600/90 font-medium">
          {role === "student"
            ? tasks.length === 0
              ? "ยังไม่มีงานที่มอบหมาย"
              : studentMetrics.pending > 0
              ? "อย่าลืมรีบทำส่งนะ!"
              : "เคลียร์หมดแล้ว เยี่ยมมาก!"
            : tasks.length === 0
            ? "ยังไม่มีงานที่สั่งในห้องนี้"
            : `ติดตามนักเรียน ${activeStudents.length} คน`}
        </div>
      </div>

      {/* 3. Overdue / Due Soon */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-rose-200/80 shadow-subtle hover:shadow-card transition-all bg-gradient-to-b from-white to-rose-50/20">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-rose-700">
            {role === "student" ? "งานที่เลยกำหนดส่ง" : "ยอดค้างเลยกำหนด"}
          </span>
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-rose-600">
            {role === "student" ? studentMetrics.overdue : classMetrics.totalOverdueCount}
          </span>
          <span className="text-xs text-rose-700/80 font-medium">
            {role === "student" ? "รายการ" : "ครั้ง/คน"}
          </span>
        </div>
        <div className="mt-2 text-[11px] text-rose-600/90 font-medium">
          {role === "student" && studentMetrics.overdue > 0
            ? "⚠️ ต้องรีบเคลียร์ด่วนที่สุด"
            : "ไม่มีงานค้างเลยกำหนด"}
        </div>
      </div>

      {/* 4. Completed Rate */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-200/80 shadow-subtle hover:shadow-card transition-all bg-gradient-to-b from-white to-emerald-50/20">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-emerald-700">
            {role === "student" ? "ความสำเร็จของฉัน" : "อัตราส่งงานทั้งห้อง"}
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
            {role === "student" ? `${studentMetrics.percentage}%` : `${classMetrics.completionRate}%`}
          </span>
          <span className="text-xs text-emerald-700/80 font-medium">
            ({role === "student" ? `${studentMetrics.submitted}/${studentMetrics.total}` : `${classMetrics.totalSubmissionsDone}/${classMetrics.totalSubmissionsRequired}`})
          </span>
        </div>
        <div className="mt-2 text-[11px] text-emerald-700 font-medium flex items-center gap-1">
          <Award className="w-3 h-3 text-emerald-600" />
          <span>
            {role === "student"
              ? tasks.length === 0
                ? "ยังไม่มีงานในระบบ"
                : studentMetrics.percentage >= 80
                ? "เก่งมาก! รักษามาตรฐานไว้นะ"
                : studentMetrics.percentage >= 50
                ? "ทำได้ดี สู้ต่ออีกนิด!"
                : "มาเร่งสปีดเคลียร์งานกัน"
              : `ภาพรวมสถิติห้อง ${currentClassLabel}`}
          </span>
        </div>
      </div>
    </div>
  );
};
