"use client";

import React, { useState } from "react";
import { Student, Task } from "@/types";
import { useTaskTracker } from "@/lib/storage";
import {
  X,
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  AlertTriangle,
  Award,
  BookOpen,
  Filter,
} from "lucide-react";
import {
  formatThaiDate,
  getDaysRemainingText,
  isOverdue,
  isDueSoon,
} from "@/lib/utils";

interface StudentDetailModalProps {
  student: Student;
  onClose: () => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  onClose,
}) => {
  const {
    tasks,
    subjects,
    getStudentSubmission,
    toggleSubmission,
    getStudentStats,
    settings,
  } = useTaskTracker();

  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "submitted" | "overdue">("all");
  const stats = getStudentStats(student.id);

  const filteredTasks = tasks.filter((task) => {
    const isDone = getStudentSubmission(task.id, student.id);
    const overdue = !isDone && isOverdue(task.dueDate, task.dueTime);

    if (filterStatus === "submitted") return isDone;
    if (filterStatus === "pending") return !isDone;
    if (filterStatus === "overdue") return overdue;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-600 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md text-white font-extrabold text-lg flex items-center justify-center border border-white/30 shadow-inner">
              {student.seatNumber}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold">{student.name}</h2>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-medium">
                  {settings.gradeLevel}/{settings.roomNumber}
                </span>
              </div>
              <p className="text-xs text-blue-100 mt-0.5">
                เลขที่ {student.seatNumber} • {student.status === "resigned" ? "ลาออกแล้ว" : "สถานะ: กำลังศึกษา"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-4 gap-2 p-3 sm:p-4 bg-slate-50 border-b border-slate-100 text-center">
          <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="text-slate-500 text-[11px] font-medium">งานทั้งหมด</div>
            <div className="text-base sm:text-lg font-bold text-slate-800">{stats.total}</div>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-emerald-200/80 shadow-xs">
            <div className="text-emerald-600 text-[11px] font-medium">ส่งแล้ว</div>
            <div className="text-base sm:text-lg font-bold text-emerald-600">{stats.submitted}</div>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-amber-200/80 shadow-xs">
            <div className="text-amber-600 text-[11px] font-medium">ยังไม่ส่ง</div>
            <div className="text-base sm:text-lg font-bold text-amber-600">{stats.pending}</div>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-rose-200/80 shadow-xs">
            <div className="text-rose-600 text-[11px] font-medium">เกินกำหนด</div>
            <div className="text-base sm:text-lg font-bold text-rose-600">{stats.overdue}</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="px-4 py-2.5 bg-white border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Award className="w-4 h-4 text-amber-500" />
            <span>อัตราความสำเร็จ:</span>
          </div>
          <div className="flex-1 max-w-xs bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                stats.percentage === 100
                  ? "bg-emerald-500"
                  : stats.percentage > 60
                  ? "bg-blue-500"
                  : "bg-amber-500"
              }`}
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
          <span className="text-xs font-bold text-slate-800">{stats.percentage}%</span>
        </div>

        {/* Filter Pills */}
        <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: "all", label: `ทั้งหมด (${stats.total})` },
            { id: "pending", label: `ค้างส่ง (${stats.pending})` },
            { id: "overdue", label: `เลยกำหนด (${stats.overdue})` },
            { id: "submitted", label: `ส่งแล้ว (${stats.submitted})` },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterStatus(f.id as any)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filterStatus === f.id
                  ? "bg-blue-600 text-white font-semibold shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs sm:text-sm">
              ไม่มีรายการงานในหมวดนี้ 🎉
            </div>
          ) : (
            filteredTasks.map((task) => {
              const isDone = getStudentSubmission(task.id, student.id);
              const remaining = getDaysRemainingText(task.dueDate, task.dueTime);
              const subject = subjects.find((s) => s.id === task.subjectId);

              return (
                <div
                  key={task.id}
                  onClick={() => toggleSubmission(task.id, student.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all select-none ${
                    isDone
                      ? "bg-emerald-50/50 border-emerald-200/80 hover:bg-emerald-100/50"
                      : remaining.isUrgent
                      ? "bg-rose-50/30 border-rose-200 hover:bg-rose-50/60"
                      : "bg-white border-slate-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isDone
                          ? "bg-emerald-500 text-white"
                          : "border-2 border-slate-300 text-transparent hover:border-slate-400"
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                            subject?.bgLight || "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          {task.subjectName}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${remaining.color}`}>
                          {remaining.text}
                        </span>
                      </div>
                      <h4
                        className={`text-xs sm:text-sm font-semibold ${
                          isDone ? "line-through text-slate-400" : "text-slate-800"
                        }`}
                      >
                        {task.title}
                      </h4>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>กำหนดส่ง: {formatThaiDate(task.dueDate)}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg shrink-0 ${
                      isDone
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {isDone ? "ส่งแล้ว" : "ยังไม่ส่ง"}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            แตะที่รายการงานเพื่อสลับสถานะส่งแล้ว / ยังไม่ส่ง
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors shadow-sm"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
