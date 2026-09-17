"use client";

import React, { useState } from "react";
import { useTaskTracker } from "@/lib/storage";
import {
  Clock,
  AlertTriangle,
  ChevronRight,
  CheckCircle2,
  Circle,
  Calendar,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import {
  formatThaiDate,
  getDaysRemainingText,
  isOverdue,
  isDueSoon,
} from "@/lib/utils";
import { TaskQuickCheckModal } from "../tasks/TaskQuickCheckModal";
import { Task } from "@/types";

export const UrgentTasks: React.FC = () => {
  const {
    role,
    tasks,
    subjects,
    currentStudent,
    getStudentSubmission,
    toggleSubmission,
    getTaskSubmissionStats,
  } = useTaskTracker();

  const [selectedTaskForCheck, setSelectedTaskForCheck] = useState<Task | null>(null);

  // Filter tasks that are overdue or due soon (within 3 days)
  const urgentTasks = React.useMemo(() => {
    return tasks
      .filter((task) => {
        if (role === "student" && currentStudent) {
          const isDone = getStudentSubmission(task.id, currentStudent.id);
          if (isDone) return false; // Hide submitted tasks from urgent list
        }
        return isOverdue(task.dueDate, task.dueTime) || isDueSoon(task.dueDate);
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 4);
  }, [tasks, role, currentStudent, getStudentSubmission]);

  return (
    <>
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-subtle">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {role === "student" ? "งานด่วนที่ต้องส่งเร็วๆ นี้" : "งานที่ใกล้กำหนดส่ง / เลยกำหนด"}
              </h2>
              <p className="text-xs text-slate-500">
                {role === "student"
                  ? "งานค้างที่ต้องรีบทำส่งครูก่อนกำหนด"
                  : "งานที่มีนักเรียนยังส่งไม่ครบตามกำหนดเวลา"}
              </p>
            </div>
          </div>

          <Link
            href="/tasks"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
          >
            <span>ดูงานทั้งหมด</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">ยังไม่มีงานที่มอบหมายในขณะนี้</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {role === "teacher"
                ? "คุณครูสามารถกดปุ่มสั่งงานเพื่อมอบหมายงานใหม่ได้"
                : "เมื่อคุณครูสั่งงาน รายการงานด่วนจะปรากฏที่นี่"}
            </p>
          </div>
        ) : urgentTasks.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-2 animate-bounce" />
            <p className="text-sm font-semibold text-slate-700">ไม่มีงานด่วนค้างส่งในตอนนี้ 🎉</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {role === "student"
                ? "คุณจัดการงานได้ยอดเยี่ยมมาก พักผ่อนได้อย่างสบายใจ!"
                : "ไม่มีงานที่ใกล้กำหนดส่งในช่วงนี้"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {urgentTasks.map((task) => {
              const remaining = getDaysRemainingText(task.dueDate, task.dueTime);
              const subject = subjects.find((s) => s.id === task.subjectId);
              const isDone = currentStudent
                ? getStudentSubmission(task.id, currentStudent.id)
                : false;
              const stats = getTaskSubmissionStats(task.id);

              return (
                <div
                  key={task.id}
                  className="p-4 rounded-2xl border border-slate-200/90 hover:border-amber-300 bg-white hover:bg-amber-50/10 transition-all flex flex-col justify-between shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg border ${
                          subject?.bgLight || "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {task.subjectName}
                      </span>
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-full border flex items-center gap-1 ${remaining.color}`}
                      >
                        <Clock className="w-3 h-3" />
                        <span>{remaining.text}</span>
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-800 leading-snug mb-1">
                      {task.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-2">
                      {task.description || "ไม่มีรายละเอียดเพิ่มเติม"}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>ส่ง: {formatThaiDate(task.dueDate)}</span>
                    </div>

                    {role === "student" ? (
                      <button
                        onClick={() =>
                          currentStudent && toggleSubmission(task.id, currentStudent.id)
                        }
                        className={`text-xs px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all btn-press ${
                          isDone
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                        }`}
                      >
                        {isDone ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>ส่งแล้ว</span>
                          </>
                        ) : (
                          <>
                            <Circle className="w-3.5 h-3.5" />
                            <span>ติ๊กส่งงาน</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedTaskForCheck(task)}
                        className="text-xs px-3 py-1.5 rounded-xl font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 flex items-center gap-1 transition-colors"
                      >
                        <span>ตรวจ ({stats.submitted}/{stats.total})</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedTaskForCheck && (
        <TaskQuickCheckModal
          task={selectedTaskForCheck}
          onClose={() => setSelectedTaskForCheck(null)}
        />
      )}
    </>
  );
};
