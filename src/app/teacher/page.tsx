"use client";

import React, { useState } from "react";
import { useTaskTracker } from "@/lib/storage";
import { getClassLabel, getAllClasses } from "@/lib/schoolStructure";
import {
  UserCheck,
  Users,
  Plus,
  BookOpen,
  ClipboardList,
  CheckCircle2,
  Trash2,
  Edit2,
  Sparkles,
  ArrowRight,
  School,
  FileSpreadsheet,
  AlertCircle,
  Save,
} from "lucide-react";
import Link from "next/link";
import { Student } from "@/types";
import { TaskFormModal } from "@/components/tasks/TaskFormModal";

export default function TeacherDashboardPage() {
  const {
    teacherProfile,
    allClassesData,
    selectedClassId,
    switchClass,
    saveClassStudents,
    batchImportStudents,
    updateTeacherClasses,
    students,
    tasks,
    deleteTask,
  } = useTaskTracker();

  const [activeTab, setActiveTab] = useState<"roster" | "tasks">("roster");

  // Single student form
  const [newSeat, setNewSeat] = useState<number>(students.length + 1);
  const [newName, setNewName] = useState("");

  // Batch import
  const [batchText, setBatchText] = useState("");
  const [batchSuccess, setBatchSuccess] = useState(false);

  // Add teaching class modal
  const [isClassPickerOpen, setIsClassPickerOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const currentLabel = getClassLabel(selectedClassId);
  const allClasses = getAllClasses();

  // Add single student
  const handleAddSingleStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newStudent: Student = {
      id: `s-${selectedClassId}-${newSeat}-${Date.now()}`,
      seatNumber: newSeat,
      name: newName.trim(),
      status: "active",
    };

    const updated = [...students, newStudent].sort((a, b) => a.seatNumber - b.seatNumber);
    saveClassStudents(selectedClassId, updated);
    setNewName("");
    setNewSeat(updated.length + 1);
  };

  // Handle batch import
  const handleBatchImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchText.trim()) return;

    batchImportStudents(selectedClassId, batchText);
    setBatchText("");
    setBatchSuccess(true);
    setTimeout(() => setBatchSuccess(false), 3000);
  };

  // Remove student
  const handleDeleteStudent = (id: string) => {
    const updated = students.filter((s) => s.id !== id);
    saveClassStudents(selectedClassId, updated);
  };

  return (
    <div className="space-y-5 animate-fade-in max-w-5xl mx-auto">
      {/* Teacher Profile Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-600 rounded-3xl p-5 sm:p-7 text-white shadow-lg shadow-blue-500/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md">
              👨‍🏫 แดชบอร์ดอาจารย์ผู้สอน
            </span>
            <span className="text-xs text-blue-100 font-medium">
              โรงเรียนบรรหารแจ่มใสวิทยา ๓
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            สวัสดี, {teacherProfile?.name || "อาจารย์ผู้สอน"}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 mt-0.5">
            {teacherProfile?.email} • {teacherProfile?.subject}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/checker"
            className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all btn-press"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>ไปหน้าเช็คงานนักเรียน</span>
          </Link>
        </div>
      </div>

      {/* Teaching Classes Selector bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-subtle space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
            <School className="w-4 h-4 text-blue-600" />
            <span>ห้องเรียนที่ท่านสอน / เลือกเพื่อจัดการรายชื่อ:</span>
          </label>
          <button
            onClick={() => setIsClassPickerOpen(!isClassPickerOpen)}
            className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>เพิ่มห้องที่สอน</span>
          </button>
        </div>

        {/* List of teacher's classes */}
        <div className="flex flex-wrap gap-2">
          {(teacherProfile?.teachingClasses || ["m4-10"]).map((cid) => {
            const isSelected = selectedClassId === cid;
            const classData = allClassesData[cid];
            const count = classData?.students?.length || 0;

            return (
              <button
                key={cid}
                onClick={() => switchClass(cid)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-105"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <span>{getClassLabel(cid)}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? "bg-white/25 text-white" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {count} คน
                </span>
              </button>
            );
          })}
        </div>

        {/* Add Class Picker Dropdown */}
        {isClassPickerOpen && (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 animate-fade-in">
            <div className="text-xs font-bold text-slate-700">
              เลือกห้องเรียนที่ต้องการเพิ่มลงในรายชื่อห้องที่สอน:
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-1 bg-white rounded-xl border border-slate-200">
              {allClasses.map((item) => {
                const isAdded = teacherProfile?.teachingClasses?.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      const current = teacherProfile?.teachingClasses || [];
                      const next = isAdded
                        ? current.filter((c) => c !== item.id)
                        : [...current, item.id];
                      updateTeacherClasses(next);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                      isAdded
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {item.label} {isAdded ? "✓" : ""}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Main Tabs: Student Roster vs Room Tasks */}
      <div className="bg-white rounded-3xl p-1.5 border border-slate-200 grid grid-cols-2 gap-1 shadow-sm">
        <button
          onClick={() => setActiveTab("roster")}
          className={`py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "roster"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>จัดการรายชื่อนักเรียนห้อง {currentLabel} ({students.length} คน)</span>
        </button>

        <button
          onClick={() => setActiveTab("tasks")}
          className={`py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === "tasks"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>งานที่สั่งในห้อง {currentLabel} ({tasks.length} งาน)</span>
        </button>
      </div>

      {/* Tab Content 1: Roster Editor */}
      {activeTab === "roster" && (
        <div className="space-y-5">
          {/* Quick Notice */}
          <div className="p-3.5 bg-blue-50 border border-blue-200/80 rounded-2xl text-xs text-blue-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              รายชื่อนักเรียนห้อง <strong>{currentLabel}</strong> ที่ท่านเพิ่มไว้จะถูกบันทึกเป็นประวัติถาวร ไม่ต้องพิมพ์ใหม่ทุกรอบ และนักเรียนห้องนี้จะสามารถเข้ามาเลือกชื่อตัวเองเพื่อดูงานได้ทันที
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left: Add Single & Batch Import Forms */}
            <div className="space-y-4">
              {/* Batch Import (Paste Multiple Names) */}
              <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-subtle space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800">
                    วางรายชื่อทีละหลายคน (แบบเร็ว)
                  </h3>
                </div>

                <form onSubmit={handleBatchImport} className="space-y-2.5">
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    คัดลอกรายชื่อจาก Word/Excel มาวางทีเดียว 1 บรรทัดต่อ 1 คน (มีเลขที่นำหน้าหรือไม่มีก็ได้ ระบบตัดให้อัตโนมัติ)
                  </p>
                  <textarea
                    rows={6}
                    placeholder={`1. สมชาย รักเรียน\n2. สมหญิง ขยันดี\n3. กิตติพงษ์ เก่งมาก`}
                    value={batchText}
                    onChange={(e) => setBatchText(e.target.value)}
                    className="w-full p-3 rounded-2xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  {batchSuccess && (
                    <div className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> บันทึกรายชื่อเรียบร้อยแล้ว!
                    </div>
                  )}
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>บันทึกรายชื่อเป็นชุด</span>
                  </button>
                </form>
              </div>

              {/* Single Student Add */}
              <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-subtle space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Plus className="w-4 h-4 text-blue-600" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800">
                    เพิ่มรายชื่อทีละคน
                  </h3>
                </div>

                <form onSubmit={handleAddSingleStudent} className="space-y-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      เลขที่:
                    </label>
                    <input
                      type="number"
                      required
                      value={newSeat}
                      onChange={(e) => setNewSeat(parseInt(e.target.value, 10))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      ชื่อ - นามสกุล:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น เด็กชายรักดี สุขใจ"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>เพิ่มนักเรียน</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Right: Roster Table */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-subtle space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800">
                    รายชื่อนักเรียนห้อง {currentLabel} ({students.length} คน)
                  </h3>
                </div>
                {students.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm(`คุณต้องการล้างรายชื่อนักเรียนห้อง ${currentLabel} ทั้งหมดใช่หรือไม่?`)) {
                        saveClassStudents(selectedClassId, []);
                      }
                    }}
                    className="text-xs text-rose-600 hover:underline font-medium"
                  >
                    ล้างรายชื่อทั้งหมด
                  </button>
                )}
              </div>

              {students.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs sm:text-sm space-y-2">
                  <Users className="w-10 h-10 mx-auto text-slate-300 animate-pulse" />
                  <p className="font-bold text-slate-600">ยังไม่มีรายชื่อนักเรียนในห้อง {currentLabel}</p>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    ใช้วิธีวางรายชื่อแบบเร็วทางซ้ายมือ หรือเพิ่มทีละคนเพื่อเริ่มต้นใช้งาน
                  </p>
                </div>
              ) : (
                <div className="max-h-[500px] overflow-y-auto divide-y divide-slate-100 pr-1">
                  {students.map((student) => (
                    <div
                      key={student.id}
                      className="py-2 px-2 flex items-center justify-between gap-3 hover:bg-slate-50 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {student.seatNumber}
                        </span>
                        <div>
                          <span className="text-xs sm:text-sm font-bold text-slate-800">
                            {student.name}
                          </span>
                          {student.status === "resigned" && (
                            <span className="ml-2 text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">
                              ลาออก
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteStudent(student.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="ลบนักเรียนคนนี้"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: Tasks in this room */}
      {activeTab === "tasks" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">
              งานที่สั่งในห้อง {currentLabel} ({tasks.length} งาน)
            </h3>
            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>สั่งงานใหม่ให้ห้องนี้</span>
            </button>
          </div>

          {tasks.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">ยังไม่มีงานที่สั่งในห้อง {currentLabel}</p>
              <p className="text-xs text-slate-400 mt-0.5">กดปุ่ม "สั่งงานใหม่ให้ห้องนี้" เพื่อเพิ่มงาน</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        {task.subjectName}
                      </span>
                      <span className="text-xs text-slate-400">
                        ส่ง: {task.dueDate}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1">{task.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">{task.description}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 mt-2 flex items-center justify-between">
                    <Link
                      href={`/checker`}
                      className="text-xs text-blue-600 hover:underline font-bold"
                    >
                      เช็คชื่อคนส่งงาน ➔
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm(`คุณต้องการลบงาน "${task.title}" ใช่หรือไม่?`)) {
                          deleteTask(task.id);
                        }
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="ลบงาน"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {isTaskModalOpen && (
        <TaskFormModal onClose={() => setIsTaskModalOpen(false)} />
      )}
    </div>
  );
}
