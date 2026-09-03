"use client";

import React, { useState } from "react";
import { useTaskTracker } from "@/lib/storage";
import {
  Settings as SettingsIcon,
  GraduationCap,
  Download,
  Upload,
  RotateCcw,
  Plus,
  Trash2,
  Check,
  AlertTriangle,
  School,
  Sparkles,
  BookOpen,
} from "lucide-react";

export default function SettingsPage() {
  const {
    settings,
    updateSettings,
    subjects,
    addSubject,
    deleteSubject,
    resetAllData,
    exportData,
    importData,
    students,
  } = useTaskTracker();

  // Settings form state
  const [gradeLevel, setGradeLevel] = useState(settings.gradeLevel);
  const [roomNumber, setRoomNumber] = useState(settings.roomNumber);
  const [academicYear, setAcademicYear] = useState(settings.academicYear);
  const [semester, setSemester] = useState(settings.semester);
  const [schoolName, setSchoolName] = useState(settings.schoolName);
  const [announcement, setAnnouncement] = useState(settings.announcement || "");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Add subject state
  const [newSubName, setNewSubName] = useState("");
  const [newSubCode, setNewSubCode] = useState("");
  const [newSubTeacher, setNewSubTeacher] = useState("");
  const [newSubColor, setNewSubColor] = useState("blue");

  // Import state
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      gradeLevel,
      roomNumber,
      academicYear,
      semester,
      schoolName,
      announcement,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim() || !newSubCode.trim()) return;

    addSubject({
      code: newSubCode.trim(),
      name: newSubName.trim(),
      teacher: newSubTeacher.trim() || "ครูผู้สอน",
      color: newSubColor,
      bgLight: "bg-blue-50 text-blue-700 border-blue-200",
      textColor: "text-blue-600",
      borderColor: "border-blue-500",
    });

    setNewSubName("");
    setNewSubCode("");
    setNewSubTeacher("");
  };

  const handleExportJson = () => {
    const jsonStr = exportData();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `task-tracker-bj3-${settings.gradeLevel}-${settings.roomNumber}-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      const success = importData(content);
      if (success) {
        setImportStatus("นำเข้าข้อมูลสำเร็จแล้ว!");
      } else {
        setImportStatus("รูปแบบไฟล์ไม่ถูกต้อง กรุณาใช้ไฟล์ JSON ที่ Export ออกมา");
      }
      setTimeout(() => setImportStatus(null), 4000);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-5 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/90 shadow-subtle">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <SettingsIcon className="w-4 h-4" />
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">
            การตั้งค่าระบบ & การเลื่อนชั้นเรียน
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          ปรับแต่งระดับชั้นเรียน (เช่น เลื่อนจาก ม.4 เป็น ม.5), จัดการรายวิชา และสำรองข้อมูล
        </p>
      </div>

      {/* 1. Class Promotion & School Settings Form */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-subtle p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <GraduationCap className="w-5 h-5 text-blue-600" />
          <h2 className="text-base font-bold text-slate-800">
            ข้อมูลระดับชั้น & โรงเรียน
          </h2>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* School Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ชื่อโรงเรียน
              </label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            {/* Grade Level Promotion */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ระดับชั้น (เลื่อนชั้นปีได้ที่นี่)
              </label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="ม.4">มัธยมศึกษาปีที่ 4 (ม.4)</option>
                <option value="ม.5">มัธยมศึกษาปีที่ 5 (ม.5) — เลื่อนชั้นปีถัดไป</option>
                <option value="ม.6">มัธยมศึกษาปีที่ 6 (ม.6) — เลื่อนชั้นปีสุดท้าย</option>
              </select>
            </div>

            {/* Room Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ห้องเรียน
              </label>
              <input
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="10"
              />
            </div>

            {/* Academic Year */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ปีการศึกษา (พ.ศ.)
              </label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="2567"
              />
            </div>

            {/* Semester */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ภาคเรียนที่ (เทอม)
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="1">ภาคเรียนที่ 1</option>
                <option value="2">ภาคเรียนที่ 2</option>
              </select>
            </div>

            {/* Class Announcement */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ข้อความประกาศประจำห้องเรียน (แสดงบนหน้าแรก)
              </label>
              <textarea
                rows={2}
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="ข้อความประกาศ เช่น สัปดาห์หน้าสอบกลางภาค หรือแจ้งเตือนเรื่องสำคัญ..."
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {saveSuccess ? (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <Check className="w-4 h-4" /> บันทึกการตั้งค่าเรียบร้อยแล้ว!
              </span>
            ) : <span />}

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/25 transition-all"
            >
              บันทึกการตั้งค่า
            </button>
          </div>
        </form>
      </div>

      {/* 2. Manage Subjects */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-subtle p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-800">
              จัดการรายวิชา ({subjects.length} วิชา)
            </h2>
          </div>
        </div>

        {/* Existing subjects pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {subjects.map((sub) => (
            <div
              key={sub.id}
              className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 bg-slate-50/70"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white border border-slate-200">
                    {sub.code}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800">
                    {sub.name}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  ครูผู้สอน: {sub.teacher}
                </div>
              </div>

              {subjects.length > 1 && (
                <button
                  onClick={() => {
                    if (confirm(`คุณต้องการลบวิชา "${sub.name}" ใช่หรือไม่?`)) {
                      deleteSubject(sub.id);
                    }
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="ลบรายวิชา"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add new subject form */}
        <form onSubmit={handleAddSubject} className="pt-2 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-700 mb-2">เพิ่มรายวิชาใหม่:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <input
              type="text"
              placeholder="รหัสวิชา เช่น ว31102"
              value={newSubCode}
              onChange={(e) => setNewSubCode(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="ชื่อวิชา เช่น เคมี 2"
              value={newSubName}
              onChange={(e) => setNewSubName(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="ชื่อครูผู้สอน"
                value={newSubTeacher}
                onChange={(e) => setNewSubTeacher(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shrink-0 transition-colors shadow-xs"
              >
                เพิ่ม
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* 3. Data Backup, Export & Import */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-subtle p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Download className="w-5 h-5 text-blue-600" />
          <div>
            <h2 className="text-base font-bold text-slate-800">
              การสำรองและถ่ายโอนข้อมูล (Backup & Share)
            </h2>
            <p className="text-xs text-slate-500">
              Export ข้อมูลรายการงานและสถานะส่งทั้งหมดเป็นไฟล์ JSON เพื่อแชร์ให้เพื่อนในห้องนำเข้าข้อมูลได้ทันที
            </p>
          </div>
        </div>

        {importStatus && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs font-semibold text-blue-700 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>{importStatus}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Export button */}
          <button
            onClick={handleExportJson}
            className="p-4 rounded-2xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/60 text-left transition-all flex items-start gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-blue-900">
                ดาวน์โหลดข้อมูลสำรอง (Export JSON)
              </div>
              <p className="text-xs text-blue-700/80 mt-0.5">
                บันทึกงานทั้งหมด {students.length} คน {subjects.length} วิชา ลงเครื่อง
              </p>
            </div>
          </button>

          {/* Import button */}
          <label className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/60 text-left transition-all flex items-start gap-3 cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-emerald-900">
                นำเข้าข้อมูลจากเพื่อน (Import JSON)
              </div>
              <p className="text-xs text-emerald-700/80 mt-0.5">
                เลือกไฟล์ .json เพื่อซิงค์รายการงานล่าสุดจากหัวหน้าห้อง
              </p>
            </div>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJson}
              className="hidden"
            />
          </label>
        </div>

        {/* Reset Danger Zone */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-rose-700">รีเซ็ตข้อมูลทั้งหมด</div>
            <p className="text-[11px] text-slate-500">
              ล้างข้อมูลงานทั้งหมดและคืนค่าเริ่มต้นของห้อง ม.4/10 บ.จ. ๓
            </p>
          </div>
          <button
            onClick={() => {
              if (
                confirm(
                  "คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตข้อมูลทั้งหมดเป็นค่าเริ่มต้นของห้อง ม.4/10 โรงเรียนบรรหารแจ่มใสวิทยา ๓?"
                )
              ) {
                resetAllData();
                alert("รีเซ็ตข้อมูลเรียบร้อยแล้ว");
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold border border-rose-200 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>รีเซ็ตเป็นค่าเริ่มต้น</span>
          </button>
        </div>
      </div>
    </div>
  );
}
