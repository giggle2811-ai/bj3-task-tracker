"use client";

import React, { useState, useMemo } from "react";
import { useTaskTracker } from "@/lib/storage";
import { Student } from "@/types";
import { StudentDetailModal } from "@/components/students/StudentDetailModal";
import {
  Users,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Award,
  ChevronRight,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export default function StudentsPage() {
  const {
    students,
    activeStudents,
    settings,
    getStudentStats,
    setCurrentStudentId,
    currentStudentId,
    setRole,
  } = useTaskTracker();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Filter students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchName = s.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSeat = s.seatNumber.toString().includes(searchQuery);
      return matchName || matchSeat;
    });
  }, [students, searchQuery]);

  return (
    <div className="space-y-4 sm:space-y-5 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/90 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              รายชื่อนักเรียนชั้น {settings.gradeLevel}/{settings.roomNumber}
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {activeStudents.length} คน (30 เลขที่)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            {settings.schoolName} • คลิกที่รายชื่อนักเรียนเพื่อดูงานค้างทั้งหมดและประวัติการส่งงาน
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-subtle">
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

      {/* Student Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {filteredStudents.map((student) => {
          const isResigned = student.status === "resigned";
          const stats = !isResigned ? getStudentStats(student.id) : null;
          const isCurrent = student.id === currentStudentId;

          return (
            <div
              key={student.id}
              onClick={() => {
                if (!isResigned) {
                  setSelectedStudent(student);
                }
              }}
              className={`bg-white rounded-3xl p-4 sm:p-5 border transition-all duration-200 flex flex-col justify-between ${
                isResigned
                  ? "opacity-50 bg-slate-50/70 border-slate-200 cursor-not-allowed"
                  : "border-slate-200/90 hover:border-blue-300 card-hover cursor-pointer shadow-subtle"
              }`}
            >
              <div>
                {/* Top row */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shadow-xs ${
                        isResigned
                          ? "bg-slate-200 text-slate-500"
                          : isCurrent
                          ? "bg-blue-600 text-white shadow-blue-500/30"
                          : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {student.seatNumber}
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-1.5">
                        <span>{student.name}</span>
                        {isCurrent && (
                          <span className="text-[10px] bg-blue-100 text-blue-700 font-extrabold px-1.5 py-0.2 rounded">
                            คุณ
                          </span>
                        )}
                      </h3>
                      <div className="text-[11px] text-slate-400">
                        {isResigned ? "ลาออกแล้ว (คงเลขที่ไว้)" : `เลขที่ ${student.seatNumber}`}
                      </div>
                    </div>
                  </div>

                  {!isResigned && stats && (
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-xl ${
                        stats.percentage === 100
                          ? "bg-emerald-100 text-emerald-800"
                          : stats.percentage > 50
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {stats.percentage}%
                    </span>
                  )}
                </div>

                {/* Progress bar and metrics */}
                {!isResigned && stats && (
                  <div className="space-y-2.5">
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          stats.percentage === 100
                            ? "bg-emerald-500"
                            : stats.percentage > 50
                            ? "bg-blue-500"
                            : "bg-amber-500"
                        }`}
                        style={{ width: `${stats.percentage}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 text-center text-[11px] pt-1">
                      <div className="p-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-semibold border border-emerald-100">
                        <div>ส่งแล้ว</div>
                        <div className="text-sm font-extrabold">{stats.submitted}</div>
                      </div>
                      <div className="p-1.5 rounded-xl bg-amber-50 text-amber-700 font-semibold border border-amber-100">
                        <div>ค้างส่ง</div>
                        <div className="text-sm font-extrabold">{stats.pending}</div>
                      </div>
                      <div className="p-1.5 rounded-xl bg-rose-50 text-rose-700 font-semibold border border-rose-100">
                        <div>เลยกำหนด</div>
                        <div className="text-sm font-extrabold">{stats.overdue}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Card Action */}
              <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between text-xs">
                {!isResigned ? (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentStudentId(student.id);
                        setRole("student");
                      }}
                      className="text-blue-600 hover:text-blue-800 font-semibold hover:underline"
                    >
                      สลับเป็นคนนี้
                    </button>
                    <span className="text-slate-500 flex items-center gap-1 font-medium">
                      <span>ดูงานค้าง</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </span>
                  </>
                ) : (
                  <span className="text-slate-400 text-xs italic">
                    เลขที่ 16 ไม่ขยับเลขที่ถัดไป
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
}
