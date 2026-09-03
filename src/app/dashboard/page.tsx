"use client";

import React, { useState } from "react";
import { useTaskTracker } from "@/lib/storage";
import { RoleBanner } from "@/components/dashboard/RoleBanner";
import { StatCards } from "@/components/dashboard/StatCards";
import { UrgentTasks } from "@/components/dashboard/UrgentTasks";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskFormModal } from "@/components/tasks/TaskFormModal";
import {
  BookOpen,
  Plus,
  ArrowRight,
  Sparkles,
  Award,
  Bell,
  CheckCircle2,
  Users,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Task } from "@/types";

export default function DashboardPage() {
  const {
    role,
    settings,
    tasks,
    subjects,
    activeStudents,
    currentStudent,
    getStudentSubmission,
    deleteTask,
  } = useTaskTracker();

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  // Recent tasks
  const recentTasks = React.useMemo(() => {
    return tasks.slice(0, 4);
  }, [tasks]);

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in">
      {/* 1. Top Classroom Welcome & Role Switcher Banner */}
      <RoleBanner />

      {/* 2. Announcement Ticker if set */}
      {settings.announcement && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm text-amber-900 flex items-start gap-2.5 shadow-xs">
          <Bell className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold mr-1.5">ประกาศประจำห้อง:</span>
            <span>{settings.announcement}</span>
          </div>
        </div>
      )}

      {/* 3. 4-Dimension Metric Cards */}
      <StatCards />

      {/* 4. Urgent / Due Soon Tasks */}
      <UrgentTasks />

      {/* 5. Subject Summary Strip */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-subtle">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                งานแยกตามรายวิชา
              </h2>
              <p className="text-xs text-slate-500">
                สรุปจำนวนงานของแต่ละวิชาในห้อง {settings.gradeLevel}/{settings.roomNumber}
              </p>
            </div>
          </div>
          <Link
            href="/statistics"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
          >
            <span>ดูสถิติฉบับเต็ม</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {subjects.map((sub) => {
            const subjectTasks = tasks.filter((t) => t.subjectId === sub.id);
            const myCompletedCount = currentStudent
              ? subjectTasks.filter((t) => getStudentSubmission(t.id, currentStudent.id)).length
              : 0;

            return (
              <Link
                key={sub.id}
                href={`/tasks?subject=${sub.id}`}
                className={`p-3 sm:p-4 rounded-2xl border transition-all card-hover ${
                  sub.bgLight || "bg-slate-50 text-slate-800 border-slate-200"
                }`}
              >
                <div className="text-[11px] font-mono font-bold opacity-75 mb-0.5">
                  {sub.code}
                </div>
                <div className="font-bold text-xs sm:text-sm truncate mb-2">
                  {sub.name}
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="opacity-80">มี {subjectTasks.length} งาน</span>
                  {role === "student" && subjectTasks.length > 0 && (
                    <span className="font-semibold bg-white/70 px-1.5 py-0.5 rounded text-[10px]">
                      ส่ง {myCompletedCount}/{subjectTasks.length}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 6. Recent Tasks List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              งานล่าสุดทั้งหมด ({tasks.length})
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {role === "teacher" && (
              <button
                onClick={() => {
                  setTaskToEdit(null);
                  setIsTaskModalOpen(true);
                }}
                className="text-xs px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1 transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>เพิ่มงาน</span>
              </button>
            )}
            <Link
              href="/tasks"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
            >
              <span>ดูทั้งหมด</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {recentTasks.map((task) => (
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
      </div>

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
