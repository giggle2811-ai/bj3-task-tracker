"use client";

import React, { useMemo } from "react";
import { useTaskTracker } from "@/lib/storage";
import { EmptyClassroom } from "@/components/shared/EmptyClassroom";
import {
  BarChart3,
  Award,
  BookOpen,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function StatisticsPage() {
  const {
    tasks,
    students,
    activeStudents,
    currentClassLabel,
    hasStudents,
    subjects,
    getStudentStats,
    getStudentSubmission,
    settings,
    role,
  } = useTaskTracker();

  // If no students in room
  if (!hasStudents && role === "student") {
    return <EmptyClassroom />;
  }

  // Class completion stats
  const classStats = useMemo(() => {
    let totalAssignments = tasks.length * activeStudents.length;
    let totalDone = 0;
    let totalOverdue = 0;

    activeStudents.forEach((student) => {
      const stats = getStudentStats(student.id);
      totalDone += stats.submitted;
      totalOverdue += stats.overdue;
    });

    const completionRate = totalAssignments > 0 ? Math.round((totalDone / totalAssignments) * 100) : 0;

    return {
      totalAssignments,
      totalDone,
      totalPending: totalAssignments - totalDone,
      totalOverdue,
      completionRate,
    };
  }, [tasks, activeStudents, getStudentStats]);

  // Subject-wise stats
  const subjectStats = useMemo(() => {
    return subjects.map((sub) => {
      const subTasks = tasks.filter((t) => t.subjectId === sub.id);
      const totalExpected = subTasks.length * activeStudents.length;
      let totalSubmitted = 0;

      subTasks.forEach((task) => {
        activeStudents.forEach((student) => {
          if (getStudentSubmission(task.id, student.id)) {
            totalSubmitted++;
          }
        });
      });

      const percentage = totalExpected > 0 ? Math.round((totalSubmitted / totalExpected) * 100) : 0;

      return {
        ...sub,
        taskCount: subTasks.length,
        totalSubmitted,
        totalExpected,
        percentage,
      };
    });
  }, [subjects, tasks, activeStudents, getStudentSubmission]);

  // Student Leaderboard
  const rankedStudents = useMemo(() => {
    return activeStudents
      .map((student) => {
        const stats = getStudentStats(student.id);
        return {
          ...student,
          stats,
        };
      })
      .sort((a, b) => b.stats.percentage - a.stats.percentage);
  }, [activeStudents, getStudentStats]);

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/90 shadow-subtle">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <BarChart3 className="w-4 h-4" />
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">
            สถิติและความคืบหน้าการส่งงาน
          </h1>
          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
            ห้อง {currentClassLabel}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          ภาพรวมความสำเร็จและอัตราการส่งงานของห้อง {currentClassLabel} {settings.schoolName}
        </p>
      </div>

      {/* Main Overall Progress Gauge Banner */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-700 rounded-3xl p-5 sm:p-7 text-white shadow-lg shadow-blue-500/15 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>อัตราความสำเร็จรวมห้อง {currentClassLabel}</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            ส่งงานแล้ว {classStats.completionRate}%
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-md">
            รวมการส่งงาน {classStats.totalDone} จากทั้งหมด {classStats.totalAssignments} ครั้ง • นักเรียน {activeStudents.length} คน
          </p>
        </div>

        {/* Big Circular Progress Indicator */}
        <div className="flex items-center gap-5">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="46"
                stroke="currentColor"
                strokeWidth="10"
                className="text-white/20"
                fill="transparent"
              />
              <circle
                cx="56"
                cy="56"
                r="46"
                stroke="currentColor"
                strokeWidth="10"
                className="text-amber-400 transition-all duration-1000 ease-out"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 46}
                strokeDashoffset={2 * Math.PI * 46 * (1 - classStats.completionRate / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <span className="text-2xl sm:text-3xl font-black">{classStats.completionRate}%</span>
              <span className="text-[10px] text-blue-100 font-medium">สำเร็จ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Breakdown Statistics */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              สถิติแยกตามรายวิชา ({currentClassLabel})
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            ทั้งหมด {subjects.length} วิชา
          </span>
        </div>

        <div className="space-y-3">
          {subjectStats.map((sub) => (
            <div
              key={sub.id}
              className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border ${sub.bgLight}`}>
                    {sub.code}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800">
                    {sub.name}
                  </span>
                  <span className="text-xs text-slate-400 hidden sm:inline">
                    ({sub.teacher})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">
                    {sub.totalSubmitted}/{sub.totalExpected} ชิ้น ({sub.taskCount} งาน)
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-lg ${
                      sub.percentage === 100
                        ? "bg-emerald-100 text-emerald-800"
                        : sub.percentage > 60
                        ? "bg-blue-100 text-blue-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {sub.percentage}%
                  </span>
                </div>
              </div>

              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    sub.percentage === 100
                      ? "bg-emerald-500"
                      : sub.percentage > 60
                      ? "bg-blue-600"
                      : "bg-amber-500"
                  }`}
                  style={{ width: `${sub.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Students / Star Leaderboard */}
      {rankedStudents.length > 0 && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  อันดับความรับผิดชอบ (Star Students ห้อง {currentClassLabel})
                </h3>
                <p className="text-xs text-slate-500">
                  นักเรียนที่มีอัตราการส่งงานสูงสุดในห้อง {currentClassLabel}
                </p>
              </div>
            </div>
            <Link
              href="/students"
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              ดูรายชื่อทั้งหมด
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {rankedStudents.slice(0, 9).map((student, rankIdx) => {
              const isTop3 = rankIdx < 3;
              return (
                <div
                  key={student.id}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                    isTop3
                      ? "bg-gradient-to-r from-amber-50/70 to-yellow-50/40 border-amber-200 shadow-xs"
                      : "bg-slate-50/70 border-slate-200/70"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                        rankIdx === 0
                          ? "bg-amber-400 text-slate-950 shadow-sm"
                          : rankIdx === 1
                          ? "bg-slate-300 text-slate-800"
                          : rankIdx === 2
                          ? "bg-amber-700 text-white"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {rankIdx + 1}
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-slate-800">
                        {student.name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        เลขที่ {student.seatNumber} • ส่งแล้ว {student.stats.submitted}/{student.stats.total} งาน
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-xs font-extrabold px-2 py-0.5 rounded-lg ${
                        student.stats.percentage === 100
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {student.stats.percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
