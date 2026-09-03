"use client";

import React, { useState } from "react";
import { Task, Student } from "@/types";
import { useTaskTracker } from "@/lib/storage";
import {
  X,
  CheckCircle2,
  Circle,
  Search,
  CheckCheck,
  RotateCcw,
  Users,
  MessageCircle,
} from "lucide-react";
import { LineExportModal } from "../checker/LineExportModal";

interface TaskQuickCheckModalProps {
  task: Task;
  onClose: () => void;
}

export const TaskQuickCheckModal: React.FC<TaskQuickCheckModalProps> = ({
  task,
  onClose,
}) => {
  const {
    students,
    activeStudents,
    submissions,
    toggleSubmission,
    batchSetSubmissions,
    getStudentSubmission,
    getTaskSubmissionStats,
  } = useTaskTracker();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "unsubmitted" | "submitted">("all");
  const [isLineModalOpen, setIsLineModalOpen] = useState(false);

  const stats = getTaskSubmissionStats(task.id);

  // Filter students
  const filteredStudents = students.filter((student) => {
    // Search match
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.seatNumber.toString().includes(searchQuery);

    if (!matchesSearch) return false;

    // Filter by submission status
    if (student.status === "resigned") return filterType === "all";
    const isSubmitted = getStudentSubmission(task.id, student.id);
    if (filterType === "submitted") return isSubmitted;
    if (filterType === "unsubmitted") return !isSubmitted;
    return true;
  });

  const handleSelectAll = () => {
    const ids = activeStudents.map((s) => s.id);
    batchSetSubmissions(task.id, ids, true);
  };

  const handleDeselectAll = () => {
    const ids = activeStudents.map((s) => s.id);
    batchSetSubmissions(task.id, ids, false);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
          {/* Modal Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-blue-50/70 via-sky-50/50 to-white">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800">
                  {task.subjectName}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  ตรวจงานห้อง ม.4/10
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                {task.title}
              </h2>
              {/* Live Count */}
              <div className="flex items-center gap-3 mt-2 text-xs">
                <span className="text-slate-600 font-medium">
                  ส่งแล้ว: <strong className="text-emerald-600 font-bold">{stats.submitted}</strong> / {stats.total} คน ({stats.percentage}%)
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-600 font-medium">
                  ยังไม่ส่ง: <strong className="text-rose-600 font-bold">{stats.total - stats.submitted}</strong> คน
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Actions & Filter bar */}
          <div className="p-3 sm:p-4 border-b border-slate-100 bg-slate-50/70 space-y-2.5">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              {/* Filter Tabs */}
              <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 text-xs font-medium">
                <button
                  onClick={() => setFilterType("all")}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    filterType === "all" ? "bg-blue-600 text-white font-semibold" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  ทั้งหมด ({students.length})
                </button>
                <button
                  onClick={() => setFilterType("unsubmitted")}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    filterType === "unsubmitted" ? "bg-rose-600 text-white font-semibold" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  ยังไม่ส่ง ({stats.total - stats.submitted})
                </button>
                <button
                  onClick={() => setFilterType("submitted")}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    filterType === "submitted" ? "bg-emerald-600 text-white font-semibold" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  ส่งแล้ว ({stats.submitted})
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleSelectAll}
                  className="text-xs px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-medium flex items-center gap-1 transition-colors"
                  title="ติ๊กส่งทุกคน"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">ส่งทุกคน</span>
                </button>
                <button
                  onClick={handleDeselectAll}
                  className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 font-medium flex items-center gap-1 transition-colors"
                  title="ล้างสถานะ"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">ล้างทั้งหมด</span>
                </button>
                <button
                  onClick={() => setIsLineModalOpen(true)}
                  className="text-xs px-2.5 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 font-medium flex items-center gap-1 transition-colors shadow-sm"
                  title="คัดลอกข้อความทวงงานส่ง LINE"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>ทวงงาน LINE</span>
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ค้นหาตามชื่อ หรือเลขที่..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Student Checklist Grid */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 divide-y divide-slate-100">
            {filteredStudents.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm">
                ไม่พบรายชื่อนักเรียนตามเงื่อนไข
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredStudents.map((student) => {
                  const isResigned = student.status === "resigned";
                  const isSubmitted = !isResigned && getStudentSubmission(task.id, student.id);

                  return (
                    <div
                      key={student.id}
                      onClick={() => {
                        if (!isResigned) {
                          toggleSubmission(task.id, student.id);
                        }
                      }}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition-all select-none ${
                        isResigned
                          ? "bg-slate-50 border-slate-200 opacity-50 cursor-not-allowed"
                          : isSubmitted
                          ? "bg-emerald-50/70 border-emerald-200/80 cursor-pointer hover:bg-emerald-100/70"
                          : "bg-white border-slate-200 cursor-pointer hover:bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            isResigned
                              ? "bg-slate-200 text-slate-500"
                              : isSubmitted
                              ? "bg-emerald-600 text-white shadow-sm"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {student.seatNumber}
                        </span>
                        <div>
                          <div className={`text-xs sm:text-sm font-semibold ${isSubmitted ? "text-emerald-900" : "text-slate-800"}`}>
                            {student.name}
                          </div>
                          {isResigned && (
                            <span className="text-[10px] text-slate-400">
                              (ลาออกแล้ว - คงเลขที่ไว้)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Checkbox button */}
                      {!isResigned && (
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                            isSubmitted
                              ? "bg-emerald-500 text-white"
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
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-3 sm:p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              แตะที่รายชื่อเพื่อเปลี่ยนสถานะ "ส่งแล้ว" / "ยังไม่ส่ง"
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors shadow-sm"
            >
              เสร็จสิ้น
            </button>
          </div>
        </div>
      </div>

      {isLineModalOpen && (
        <LineExportModal
          task={task}
          onClose={() => setIsLineModalOpen(false)}
        />
      )}
    </>
  );
};
