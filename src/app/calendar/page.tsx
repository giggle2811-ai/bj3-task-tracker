"use client";

import React, { useState, useMemo } from "react";
import { useTaskTracker } from "@/lib/storage";
import { Task } from "@/types";
import { EmptyClassroom } from "@/components/shared/EmptyClassroom";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import {
  formatThaiDate,
  getDaysRemainingText,
} from "@/lib/utils";
import { TaskFormModal } from "@/components/tasks/TaskFormModal";
import { TaskQuickCheckModal } from "@/components/tasks/TaskQuickCheckModal";

const THAI_MONTH_NAMES = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];

const WEEK_DAYS = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];

export default function CalendarPage() {
  const {
    tasks,
    subjects,
    role,
    currentStudent,
    currentClassLabel,
    hasStudents,
    getStudentSubmission,
    toggleSubmission,
    getTaskSubmissionStats,
  } = useTaskTracker();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTaskForCheck, setSelectedTaskForCheck] = useState<Task | null>(null);

  // If no students in room
  if (!hasStudents && role === "student") {
    return <EmptyClassroom />;
  }

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Calendar math
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const days = [];

    // Days from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      days.push({ dayNumber: d, dateStr, isCurrentMonth: false });
    }

    // Days from current month
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      days.push({ dayNumber: d, dateStr, isCurrentMonth: true });
    }

    // Days from next month
    const remainingCells = 42 - days.length;
    for (let d = 1; d <= remainingCells; d++) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      days.push({ dayNumber: d, dateStr, isCurrentMonth: false });
    }

    return days;
  }, [year, month]);

  // Tasks mapped by dateStr
  const tasksByDate = useMemo(() => {
    const map: Record<string, Task[]> = {};
    tasks.forEach((task) => {
      if (!map[task.dueDate]) map[task.dueDate] = [];
      map[task.dueDate].push(task);
    });
    return map;
  }, [tasks]);

  const tasksForSelectedDay = tasksByDate[selectedDay] || [];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDay(today.toISOString().split("T")[0]);
  };

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-4 sm:space-y-5 animate-fade-in">
      {/* Top Header */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/90 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              ปฏิทินกำหนดส่งงาน (ห้อง {currentClassLabel})
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            ดูภาพรวมกำหนดส่งงานในแต่ละวันของห้อง {currentClassLabel}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToday}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
          >
            วันนี้
          </button>
          {role === "teacher" && (
            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>สั่งงานใหม่</span>
            </button>
          )}
        </div>
      </div>

      {/* Calendar Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-subtle p-4 sm:p-6 space-y-4">
        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-800">
            {THAI_MONTH_NAMES[month]} {year + 543}
          </h2>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
              title="เดือนก่อนหน้า"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
              title="เดือนถัดไป"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Weekday Labels */}
        <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400 py-1 border-b border-slate-100">
          {WEEK_DAYS.map((w, idx) => (
            <div
              key={w}
              className={idx === 0 ? "text-rose-500" : idx === 6 ? "text-blue-500" : ""}
            >
              {w}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {calendarDays.map((item, idx) => {
            const isToday = item.dateStr === todayStr;
            const isSelected = item.dateStr === selectedDay;
            const dayTasks = tasksByDate[item.dateStr] || [];

            return (
              <div
                key={idx}
                onClick={() => setSelectedDay(item.dateStr)}
                className={`min-h-[56px] sm:min-h-[85px] p-1.5 sm:p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/50 shadow-xs"
                    : isToday
                    ? "border-blue-300 bg-blue-50/20"
                    : item.isCurrentMonth
                    ? "border-slate-100 hover:border-slate-300 bg-white"
                    : "border-transparent text-slate-300 bg-slate-50/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isToday
                        ? "bg-blue-600 text-white"
                        : isSelected
                        ? "bg-blue-100 text-blue-700"
                        : item.isCurrentMonth
                        ? "text-slate-700"
                        : "text-slate-300"
                    }`}
                  >
                    {item.dayNumber}
                  </span>

                  {dayTasks.length > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800">
                      {dayTasks.length} งาน
                    </span>
                  )}
                </div>

                <div className="mt-1 space-y-1 overflow-hidden">
                  {dayTasks.slice(0, 2).map((t) => (
                    <div
                      key={t.id}
                      className="text-[10px] font-medium truncate px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 hidden sm:block"
                      title={t.title}
                    >
                      {t.title}
                    </div>
                  ))}
                  {dayTasks.length > 2 && (
                    <div className="text-[9px] text-slate-400 font-bold px-1 hidden sm:block">
                      +{dayTasks.length - 2} อื่นๆ
                    </div>
                  )}

                  {dayTasks.length > 0 && (
                    <div className="flex items-center gap-1 justify-center sm:hidden">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Task Details List */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-subtle p-4 sm:p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">
              งานที่ต้องส่งวันที่: {formatThaiDate(selectedDay)}
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            มี {tasksForSelectedDay.length} รายการ
          </span>
        </div>

        {tasksForSelectedDay.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Sparkles className="w-7 h-7 text-amber-400 mx-auto mb-1.5" />
            <p className="text-sm font-semibold text-slate-700">ไม่มีงานที่ต้องส่งในวันนี้</p>
            <p className="text-xs text-slate-400 mt-0.5">เลือกวันอื่นในปฏิทินเพื่อดูรายการงาน</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {tasksForSelectedDay.map((task) => {
              const remaining = getDaysRemainingText(task.dueDate, task.dueTime);
              const subject = subjects.find((s) => s.id === task.subjectId);
              const isDone = currentStudent
                ? getStudentSubmission(task.id, currentStudent.id)
                : false;
              const stats = getTaskSubmissionStats(task.id);

              return (
                <div
                  key={task.id}
                  className="p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white hover:border-blue-300 transition-all shadow-xs"
                >
                  <div className="flex items-start gap-3">
                    {role === "student" && currentStudent && (
                      <button
                        onClick={() => toggleSubmission(task.id, currentStudent.id)}
                        className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          isDone
                            ? "bg-emerald-500 text-white"
                            : "border-2 border-slate-300 text-transparent hover:border-slate-400"
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                    <div>
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                            subject?.bgLight || "bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          {task.subjectName}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${remaining.color}`}>
                          {remaining.text}
                        </span>
                        {task.dueTime && (
                          <span className="text-xs text-slate-400">
                            เวลา {task.dueTime} น.
                          </span>
                        )}
                      </div>
                      <h4
                        className={`text-sm font-bold ${
                          isDone && role === "student" ? "line-through text-slate-400" : "text-slate-800"
                        }`}
                      >
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {role === "teacher" && (
                    <button
                      onClick={() => setSelectedTaskForCheck(task)}
                      className="text-xs px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold border border-blue-200 shrink-0 flex items-center gap-1.5 transition-colors"
                    >
                      <span>เช็คงาน ({stats.submitted}/{stats.total})</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isTaskModalOpen && (
        <TaskFormModal onClose={() => setIsTaskModalOpen(false)} />
      )}

      {selectedTaskForCheck && (
        <TaskQuickCheckModal
          task={selectedTaskForCheck}
          onClose={() => setSelectedTaskForCheck(null)}
        />
      )}
    </div>
  );
}
