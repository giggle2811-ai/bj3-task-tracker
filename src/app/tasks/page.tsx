"use client";

import React, { useState, useMemo } from "react";
import { useTaskTracker } from "@/lib/storage";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskFormModal } from "@/components/tasks/TaskFormModal";
import { EmptyClassroom } from "@/components/shared/EmptyClassroom";
import { Task } from "@/types";
import {
  Search,
  Plus,
  ArrowUpDown,
  BookOpen,
  Clock,
  Sparkles,
  School,
} from "lucide-react";
import { isOverdue, isDueSoon } from "@/lib/utils";

export default function TasksPage() {
  const {
    role,
    tasks,
    subjects,
    currentStudent,
    currentClassLabel,
    hasStudents,
    getStudentSubmission,
    deleteTask,
    getTaskSubmissionStats,
  } = useTaskTracker();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "pending" | "submitted" | "overdue" | "dueSoon"
  >("all");
  const [sortBy, setSortBy] = useState<"dueAsc" | "dueDesc" | "newest">("dueAsc");

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  // If the room has no students, show EmptyClassroom component
  if (!hasStudents && role === "student") {
    return <EmptyClassroom />;
  }

  // Filter and sort tasks
  const filteredTasks = tasks
    .filter((task) => {
      // Search query
      const matchQuery =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchQuery) return false;

      // Subject filter
      if (selectedSubject !== "all" && task.subjectId !== selectedSubject) {
        return false;
      }

      // Status filter
      if (role === "student" && currentStudent) {
        const isDone = getStudentSubmission(task.id, currentStudent.id);
        const overdue = !isDone && isOverdue(task.dueDate, task.dueTime);
        const dueSoon = !isDone && isDueSoon(task.dueDate);

        if (selectedStatus === "pending") return !isDone;
        if (selectedStatus === "submitted") return isDone;
        if (selectedStatus === "overdue") return overdue;
        if (selectedStatus === "dueSoon") return dueSoon;
      } else {
        // Teacher mode
        const stats = getTaskSubmissionStats(task.id);
        const overdue = stats.submitted < stats.total && isOverdue(task.dueDate, task.dueTime);
        const isAllDone = stats.submitted === stats.total && stats.total > 0;

        if (selectedStatus === "pending") return !isAllDone;
        if (selectedStatus === "submitted") return isAllDone;
        if (selectedStatus === "overdue") return overdue;
        if (selectedStatus === "dueSoon") return isDueSoon(task.dueDate);
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "dueAsc") {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (sortBy === "dueDesc") {
        return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="space-y-4 sm:space-y-5 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/90 shadow-subtle">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              {role === "student" ? `รายการงานห้อง ${currentClassLabel}` : `จัดการงานห้อง ${currentClassLabel}`}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            {role === "student" && currentStudent
              ? `ติดตามงานค้างสำหรับ เลขที่ ${currentStudent.seatNumber} ${currentStudent.name}`
              : `งานทั้งหมดที่อาจารย์สั่งเข้ามาในห้อง ${currentClassLabel}`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {role === "teacher" && (
            <button
              onClick={() => {
                setTaskToEdit(null);
                setIsTaskModalOpen(true);
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/25 transition-all btn-press"
            >
              <Plus className="w-4 h-4" />
              <span>สั่งงานใหม่ให้ห้องนี้</span>
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-subtle space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {/* Keyword Search */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาตามชื่องาน, รายวิชา, หรือคำอธิบาย..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Subject Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-700"
            >
              <option value="all">ทุกรายวิชา ({tasks.length})</option>
              {subjects.map((sub) => {
                const count = tasks.filter((t) => t.subjectId === sub.id).length;
                return (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} ({count})
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Filter Pills & Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-slate-100">
          {/* Status Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
            {[
              { id: "all", label: "ทั้งหมด" },
              { id: "pending", label: "ยังไม่ส่ง (ค้างอยู่)" },
              { id: "dueSoon", label: "ใกล้ถึงกำหนด (3 วัน)" },
              { id: "overdue", label: "เลยกำหนดส่ง 🔥" },
              { id: "submitted", label: "ส่งแล้ว ✅" },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStatus(st.id as any)}
                className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                  selectedStatus === st.id
                    ? "bg-blue-600 text-white shadow-xs font-semibold"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/70"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Sort selection */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 self-end sm:self-auto shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent border-0 font-medium text-slate-700 focus:ring-0 cursor-pointer text-xs"
            >
              <option value="dueAsc">กำหนดส่ง: ใกล้สุดก่อน</option>
              <option value="dueDesc">กำหนดส่ง: ไกลสุดก่อน</option>
              <option value="newest">สั่งล่าสุด</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>พบ {filteredTasks.length} รายการงาน</span>
        {selectedSubject !== "all" || selectedStatus !== "all" || searchQuery ? (
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedSubject("all");
              setSelectedStatus("all");
            }}
            className="text-blue-600 hover:underline font-medium"
          >
            ล้างตัวกรองทั้งหมด
          </button>
        ) : null}
      </div>

      {/* Task Cards Grid */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200 shadow-xs">
          <Sparkles className="w-10 h-10 text-amber-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1">
            ไม่พบงานที่ตรงกับเงื่อนไขการค้นหา
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            ลองปรับเปลี่ยนคำค้นหา หรือเลือกตัวกรองสถานะอื่น
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedSubject("all");
              setSelectedStatus("all");
            }}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
          >
            ล้างตัวกรองทั้งหมด
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={(t) => {
                setTaskToEdit(t);
                setIsTaskModalOpen(true);
              }}
              onDelete={deleteTask}
            />
          ))}
        </div>
      )}

      {/* Task Form Modal */}
      {isTaskModalOpen && (
        <TaskFormModal
          taskToEdit={taskToEdit}
          onClose={() => {
            setIsTaskModalOpen(false);
            setTaskToEdit(null);
          }}
        />
      )}
    </div>
  );
}
