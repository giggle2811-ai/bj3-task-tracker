"use client";

import React, { useState } from "react";
import { Task, Student } from "@/types";
import { useTaskTracker } from "@/lib/storage";
import {
  formatThaiDate,
  getDaysRemainingText,
  isOverdue,
  cn,
} from "@/lib/utils";
import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  ExternalLink,
  Edit2,
  Trash2,
  Users,
  MessageCircle,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { TaskQuickCheckModal } from "./TaskQuickCheckModal";
import { LineExportModal } from "../checker/LineExportModal";

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  homework: { label: "การบ้าน", color: "bg-blue-100 text-blue-800" },
  worksheet: { label: "ใบงาน", color: "bg-emerald-100 text-emerald-800" },
  project: { label: "โครงงาน/ชิ้นงาน", color: "bg-purple-100 text-purple-800" },
  report: { label: "รายงาน", color: "bg-amber-100 text-amber-800" },
  quiz: { label: "เก็บคะแนน/สอบย่อย", color: "bg-rose-100 text-rose-800" },
  other: { label: "อื่นๆ", color: "bg-slate-100 text-slate-800" },
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const {
    role,
    currentStudent,
    getStudentSubmission,
    toggleSubmission,
    getTaskSubmissionStats,
    subjects,
    activeStudents,
  } = useTaskTracker();

  const [isCheckModalOpen, setIsCheckModalOpen] = useState(false);
  const [isLineModalOpen, setIsLineModalOpen] = useState(false);

  // Subject info
  const subject = subjects.find((s) => s.id === task.subjectId);

  // Status for student
  const isStudentDone = currentStudent ? getStudentSubmission(task.id, currentStudent.id) : false;

  // Stats for teacher
  const stats = getTaskSubmissionStats(task.id);
  const remainingDays = getDaysRemainingText(task.dueDate, task.dueTime);
  const typeInfo = TYPE_LABELS[task.type] || TYPE_LABELS.other;

  return (
    <>
      <div
        className={cn(
          "bg-white rounded-2xl border transition-all duration-200 card-hover p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden",
          isStudentDone && role === "student"
            ? "border-emerald-200 bg-emerald-50/20 shadow-sm"
            : remainingDays.isUrgent
            ? "border-amber-200 shadow-sm"
            : "border-slate-200/90 shadow-sm hover:border-blue-300"
        )}
      >
        {/* Top bar accent line by subject */}
        <div
          className={cn(
            "absolute top-0 left-0 right-0 h-1.5",
            isStudentDone && role === "student"
              ? "bg-emerald-500"
              : remainingDays.isUrgent
              ? "bg-amber-400"
              : "bg-blue-500"
          )}
        />

        <div>
          {/* Header badges */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Subject Tag */}
              <span
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1",
                  subject?.bgLight || "bg-slate-100 text-slate-700 border-slate-200"
                )}
              >
                {task.subjectName}
              </span>

              {/* Task Type Tag */}
              <span
                className={cn(
                  "px-2 py-0.5 rounded-md text-[11px] font-medium",
                  typeInfo.color
                )}
              >
                {typeInfo.label}
              </span>
            </div>

            {/* Remaining time / Overdue pill */}
            <span
              className={cn(
                "px-2.5 py-1 rounded-full text-[11px] font-medium border flex items-center gap-1",
                remainingDays.color
              )}
            >
              <Clock className="w-3 h-3 shrink-0" />
              <span>{remainingDays.text}</span>
            </span>
          </div>

          {/* Title */}
          <h3
            className={cn(
              "text-base sm:text-lg font-bold text-slate-800 leading-snug mb-1.5",
              isStudentDone && role === "student" && "line-through text-slate-400"
            )}
          >
            {task.title}
          </h3>

          {/* Description */}
          {task.description && (
            <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 mb-3 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Submission link if any */}
          {task.submissionLink && (
            <div className="mb-3">
              <a
                href={task.submissionLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>ลิงก์ส่งงาน / เอกสารแนบ</span>
              </a>
            </div>
          )}

          {/* Due date info */}
          <div className="flex items-center gap-4 text-xs text-slate-500 mb-3 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>กำหนดส่ง: {formatThaiDate(task.dueDate)}</span>
            </div>
            {task.dueTime && (
              <div className="flex items-center gap-1">
                <span>{task.dueTime} น.</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Area: Student vs Teacher */}
        <div className="pt-3 border-t border-slate-100 mt-1">
          {role === "student" ? (
            /* Student Mode: Single click submission toggle */
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => currentStudent && toggleSubmission(task.id, currentStudent.id)}
                className={cn(
                  "w-full py-2.5 px-4 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all btn-press shadow-sm",
                  isStudentDone
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25"
                )}
              >
                {isStudentDone ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    <span>ส่งงานแล้ว (แตะเพื่อเปลี่ยนสถานะ)</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4" />
                    <span>ทำเครื่องหมายว่า "ส่งงานแล้ว"</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Teacher Mode: Progress bar, check list modal, line export modal */
            <div className="space-y-2.5">
              {/* Submission progress */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    ส่งแล้ว {stats.submitted}/{stats.total} คน
                  </span>
                  <span
                    className={cn(
                      "font-bold text-xs",
                      stats.percentage === 100
                        ? "text-emerald-600"
                        : stats.percentage > 50
                        ? "text-blue-600"
                        : "text-amber-600"
                    )}
                  >
                    {stats.percentage}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all duration-500 rounded-full",
                      stats.percentage === 100
                        ? "bg-emerald-500"
                        : stats.percentage > 50
                        ? "bg-blue-500"
                        : "bg-amber-500"
                    )}
                    style={{ width: `${stats.percentage}%` }}
                  />
                </div>
              </div>

              {/* Action buttons for Teacher */}
              <div className="flex items-center gap-1.5 pt-1">
                <button
                  onClick={() => setIsCheckModalOpen(true)}
                  className="flex-1 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100/80 text-blue-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-blue-200/70"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>ตรวจรายคน</span>
                </button>

                <button
                  onClick={() => setIsLineModalOpen(true)}
                  className="py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-emerald-200/70"
                  title="ทวงงานทาง LINE กลุ่ม"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">ส่งไลน์</span>
                </button>

                {onEdit && (
                  <button
                    onClick={() => onEdit(task)}
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                    title="แก้ไขงาน"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                )}

                {onDelete && (
                  <button
                    onClick={() => {
                      if (confirm(`คุณต้องการลบงาน "${task.title}" ใช่หรือไม่?`)) {
                        onDelete(task.id);
                      }
                    }}
                    className="p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                    title="ลบงาน"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Roster Checker Modal */}
      {isCheckModalOpen && (
        <TaskQuickCheckModal
          task={task}
          onClose={() => setIsCheckModalOpen(false)}
        />
      )}

      {/* LINE Reminder Text Modal */}
      {isLineModalOpen && (
        <LineExportModal
          task={task}
          onClose={() => setIsLineModalOpen(false)}
        />
      )}
    </>
  );
};
