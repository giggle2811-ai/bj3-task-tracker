"use client";

import React, { useState, useMemo } from "react";
import { useTaskTracker } from "@/lib/storage";
import { Task, Student } from "@/types";
import { EmptyClassroom } from "@/components/shared/EmptyClassroom";
import {
  CheckCircle2,
  Circle,
  Users,
  Search,
  CheckCheck,
  RotateCcw,
  MessageCircle,
  Calendar,
  Clock,
  BookOpen,
  School,
  ChevronRight,
} from "lucide-react";
import {
  formatThaiDate,
  getDaysRemainingText,
} from "@/lib/utils";
import { LineExportModal } from "@/components/checker/LineExportModal";
import Link from "next/link";

export default function CheckerPage() {
  const {
    tasks,
    students,
    activeStudents,
    currentClassLabel,
    hasStudents,
    subjects,
    toggleSubmission,
    batchSetSubmissions,
    getStudentSubmission,
    getTaskSubmissionStats,
    role,
  } = useTaskTracker();

  // If no students in room
  if (!hasStudents) {
    return <EmptyClassroom />;
  }

  // Selected task to check
  const [selectedTaskId, setSelectedTaskId] = useState<string>(
    tasks.length > 0 ? tasks[0].id : ""
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "unsubmitted" | "submitted">("all");
  const [isLineModalOpen, setIsLineModalOpen] = useState(false);

  const selectedTask = useMemo(() => {
    return tasks.find((t) => t.id === selectedTaskId) || tasks[0];
  }, [tasks, selectedTaskId]);

  const stats = selectedTask ? getTaskSubmissionStats(selectedTask.id) : { submitted: 0, total: 0, percentage: 0 };
  const subject = selectedTask ? subjects.find((s) => s.id === selectedTask.subjectId) : null;
  const remaining = selectedTask ? getDaysRemainingText(selectedTask.dueDate, selectedTask.dueTime) : null;

  // Filter students
  const filteredStudents = useMemo(() => {
    if (!selectedTask) return [];

    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.seatNumber.toString().includes(searchQuery);

      if (!matchesSearch) return false;

      if (student.status === "resigned") return filterType === "all";
      const isSubmitted = getStudentSubmission(selectedTask.id, student.id);
      if (filterType === "submitted") return isSubmitted;
      if (filterType === "unsubmitted") return !isSubmitted;
      return true;
    });
  }, [students, selectedTask, searchQuery, filterType, getStudentSubmission]);

  const handleSelectAll = () => {
    if (!selectedTask) return;
    const ids = activeStudents.map((s) => s.id);
    batchSetSubmissions(selectedTask.id, ids, true);
  };

  const handleDeselectAll = () => {
    if (!selectedTask) return;
    const ids = activeStudents.map((s) => s.id);
    batchSetSubmissions(selectedTask.id, ids, false);
  };

  return (
    <div className="space-y-4 sm:space-y-5 animate-fade-in">
      {/* Top Header */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/90 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              ตารางเช็คงานห้อง {currentClassLabel}
            </h1>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
              สำหรับอาจารย์
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            เลือกงานเพื่อตรวจเช็คการส่งงานของนักเรียนห้อง {currentClassLabel} แต่ละคน หรือสร้างข้อความทวงงานส่งเข้า LINE กลุ่ม
          </p>
        </div>

        {/* LINE button */}
        {selectedTask && (
          <button
            onClick={() => setIsLineModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#06C755] hover:bg-[#05b34c] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-[#06c755]/20 transition-all btn-press"
          >
            <MessageCircle className="w-4 h-4" />
            <span>คัดลอกรายชื่อส่งเข้า LINE</span>
          </button>
        )}
      </div>

      {tasks.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700">ยังไม่มีงานที่มอบหมายในห้อง {currentClassLabel}</p>
          <p className="text-xs text-slate-400 mt-0.5 mb-4">เมื่อคุณครูสั่งงาน จะสามารถเข้ามาเช็คชื่อและบันทึกการส่งงานที่นี่ได้</p>
          <Link
            href="/tasks"
            className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors inline-flex items-center gap-1.5 shadow-xs"
          >
            <span>ไปที่หน้ารายการงาน</span>
          </Link>
        </div>
      ) : (
        <>
          {/* Task Selector & Selected Task Summary */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-subtle space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                <span>เลือกงานที่ต้องการตรวจ:</span>
              </label>
              <select
                value={selectedTaskId}
                onChange={(e) => setSelectedTaskId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {tasks.map((t) => {
                  const taskStats = getTaskSubmissionStats(t.id);
                  return (
                    <option key={t.id} value={t.id}>
                      [{t.subjectName}] {t.title} — ส่งแล้ว {taskStats.submitted}/{taskStats.total} คน ({taskStats.percentage}%)
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Selected Task Details Banner */}
            {selectedTask && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-200/80 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-lg border ${
                        subject?.bgLight || "bg-blue-50 text-blue-700 border-blue-200"
                      }`}
                    >
                      {selectedTask.subjectName}
                    </span>
                    {remaining && (
                      <span
                        className={`text-xs font-medium px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${remaining.color}`}
                      >
                        <Clock className="w-3 h-3" />
                        <span>{remaining.text}</span>
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>กำหนดส่ง: {formatThaiDate(selectedTask.dueDate)} {selectedTask.dueTime ? `${selectedTask.dueTime} น.` : ""}</span>
                  </div>
                </div>

                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  {selectedTask.title}
                </h2>

                {selectedTask.description && (
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {selectedTask.description}
                  </p>
                )}

                {/* Live Progress Bar */}
                <div className="pt-2 border-t border-slate-200/60">
                  <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                    <span className="text-slate-700">
                      ส่งแล้ว <strong className="text-emerald-600 font-bold text-sm">{stats.submitted}</strong> / {stats.total} คน
                      <span className="text-rose-600 ml-2">(ยังไม่ส่ง {stats.total - stats.submitted} คน)</span>
                    </span>
                    <span className="text-xs font-extrabold text-blue-700">{stats.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-200/70 h-3 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        stats.percentage === 100
                          ? "bg-emerald-500"
                          : stats.percentage > 50
                          ? "bg-blue-600"
                          : "bg-amber-500"
                      }`}
                      style={{ width: `${stats.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Checklist Filter and Search Controls */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-subtle space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Status Tabs */}
              <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-medium self-start">
                <button
                  onClick={() => setFilterType("all")}
                  className={`px-3.5 py-1.5 rounded-xl transition-all ${
                    filterType === "all"
                      ? "bg-white text-blue-700 shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  ทั้งหมด ({students.length})
                </button>
                <button
                  onClick={() => setFilterType("unsubmitted")}
                  className={`px-3.5 py-1.5 rounded-xl transition-all ${
                    filterType === "unsubmitted"
                      ? "bg-rose-600 text-white shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  ยังไม่ส่ง ({stats.total - stats.submitted})
                </button>
                <button
                  onClick={() => setFilterType("submitted")}
                  className={`px-3.5 py-1.5 rounded-xl transition-all ${
                    filterType === "submitted"
                      ? "bg-emerald-600 text-white shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  ส่งแล้ว ({stats.submitted})
                </button>
              </div>

              {/* Batch Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSelectAll}
                  className="text-xs px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>ติ๊กส่งทุกคน</span>
                </button>
                <button
                  onClick={handleDeselectAll}
                  className="text-xs px-3 py-2 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>ล้างทั้งหมด</span>
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ค้นหาตามชื่อนักเรียน หรือเลขที่..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Student Checklist Matrix */}
          <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/90 shadow-subtle">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-500">
                แสดงรายชื่อนักเรียน {filteredStudents.length} คน • แตะที่กล่องเพื่อเปลี่ยนสถานะ
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {filteredStudents.map((student) => {
                const isResigned = student.status === "resigned";
                const isSubmitted = selectedTask && !isResigned
                  ? getStudentSubmission(selectedTask.id, student.id)
                  : false;

                return (
                  <div
                    key={student.id}
                    onClick={() => {
                      if (selectedTask && !isResigned) {
                        toggleSubmission(selectedTask.id, student.id);
                      }
                    }}
                    className={`p-3 rounded-2xl border transition-all select-none flex items-center justify-between gap-2.5 ${
                      isResigned
                        ? "bg-slate-50 border-slate-200 opacity-50 cursor-not-allowed"
                        : isSubmitted
                        ? "bg-emerald-50/80 border-emerald-200 hover:bg-emerald-100/80 cursor-pointer shadow-xs"
                        : "bg-white border-slate-200 hover:border-blue-400 hover:bg-slate-50 cursor-pointer"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                          isResigned
                            ? "bg-slate-200 text-slate-500"
                            : isSubmitted
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {student.seatNumber}
                      </div>
                      <div>
                        <div
                          className={`text-xs sm:text-sm font-bold ${
                            isSubmitted ? "text-emerald-900" : "text-slate-800"
                          }`}
                        >
                          {student.name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {isResigned
                            ? "ลาออกแล้ว"
                            : isSubmitted
                            ? "ส่งงานเรียบร้อยแล้ว"
                            : "ยังไม่ส่งงาน"}
                        </div>
                      </div>
                    </div>

                    {!isResigned && (
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                          isSubmitted
                            ? "bg-emerald-500 text-white shadow-sm"
                            : "border-2 border-slate-300 text-transparent hover:border-slate-400"
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* LINE Export Modal */}
      {isLineModalOpen && selectedTask && (
        <LineExportModal
          task={selectedTask}
          onClose={() => setIsLineModalOpen(false)}
        />
      )}
    </div>
  );
}
