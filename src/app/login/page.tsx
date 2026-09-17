"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTaskTracker } from "@/lib/storage";
import {
  SCHOOL_LEVELS,
  getClassId,
  getClassLabel,
} from "@/lib/schoolStructure";
import {
  GraduationCap,
  UserCheck,
  Sparkles,
  BookOpen,
  ArrowRight,
  School,
  CheckCircle2,
  Users,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const {
    loginStudent,
    loginTeacher,
    teacherProfile,
    allClassesData,
  } = useTaskTracker();

  const [activeTab, setActiveTab] = useState<"student" | "teacher">("student");

  // Student form state
  const [selectedGrade, setSelectedGrade] = useState<number>(4);
  const [selectedRoom, setSelectedRoom] = useState<number>(10);

  // Teacher form state
  const [teacherName, setTeacherName] = useState(teacherProfile?.name || "");
  const [teacherEmail, setTeacherEmail] = useState(teacherProfile?.email || "");
  const [teacherSubject, setTeacherSubject] = useState(teacherProfile?.subject || "");
  const [teacherTeachingClasses, setTeacherTeachingClasses] = useState<string[]>(
    teacherProfile?.teachingClasses || ["m4-10"]
  );

  const currentGradeConfig = SCHOOL_LEVELS.find((l) => l.grade === selectedGrade) || SCHOOL_LEVELS[3];

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const classId = getClassId(selectedGrade, selectedRoom);
    loginStudent(classId);
    router.push("/dashboard");
  };

  const handleTeacherLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherName.trim()) return;

    loginTeacher(
      teacherName,
      teacherEmail,
      teacherSubject,
      teacherTeachingClasses
    );
    router.push("/teacher");
  };

  const toggleTeachingClass = (classId: string) => {
    setTeacherTeachingClasses((prev) =>
      prev.includes(classId)
        ? prev.filter((c) => c !== classId)
        : [...prev, classId]
    );
  };

  return (
    <div className="max-w-xl mx-auto py-6 sm:py-10 animate-fade-in">
      {/* Header with School Branding */}
      <div className="text-center space-y-2 mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 via-sky-500 to-indigo-600 text-white font-extrabold text-2xl shadow-lg shadow-blue-500/25 mb-2">
          บ.จ.๓
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Task tracker
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          โรงเรียนบรรหารแจ่มใสวิทยา ๓ • ตรวจสอบงานค้างและบันทึกการส่งงาน
        </p>
      </div>

      {/* Role Selection Tabs */}
      <div className="bg-white rounded-3xl p-1.5 border border-slate-200 shadow-sm grid grid-cols-2 gap-1 mb-5">
        <button
          onClick={() => setActiveTab("student")}
          className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === "student"
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>สำหรับนักเรียน</span>
        </button>

        <button
          onClick={() => setActiveTab("teacher")}
          className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === "teacher"
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>สำหรับอาจารย์ผู้สอน</span>
        </button>
      </div>

      {/* Tab 1: Student Login Portal */}
      {activeTab === "student" && (
        <form onSubmit={handleStudentLogin} className="bg-white rounded-3xl border border-slate-200 shadow-subtle p-5 sm:p-7 space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                1
              </span>
              <label className="text-xs sm:text-sm font-bold text-slate-800">
                เลือกระดับชั้นเรียน:
              </label>
            </div>

            {/* Grade Level Buttons */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-blue-700 bg-blue-50 py-1 px-2.5 rounded-lg text-center">
                  ม.ต้น (ห้อง 1 - 15)
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {[1, 2, 3].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => {
                        setSelectedGrade(g);
                        if (selectedRoom > 15) setSelectedRoom(1);
                      }}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        selectedGrade === g
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/70"
                      }`}
                    >
                      ม.{g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-indigo-700 bg-indigo-50 py-1 px-2.5 rounded-lg text-center">
                  ม.ปลาย (ห้อง 1 - 11)
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {[4, 5, 6].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => {
                        setSelectedGrade(g);
                        if (selectedRoom > 11) setSelectedRoom(1);
                      }}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        selectedGrade === g
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/70"
                      }`}
                    >
                      ม.{g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Room Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <label className="text-xs sm:text-sm font-bold text-slate-800">
                  เลือกห้องเรียน (ม.{selectedGrade}/...):
                </label>
              </div>
              <span className="text-[11px] text-slate-400">
                {currentGradeConfig.type === "junior" ? "มีห้อง 1-15" : "มีห้อง 1-11"}
              </span>
            </div>

            {/* Room Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {Array.from({ length: currentGradeConfig.totalRooms }, (_, i) => i + 1).map((r) => {
                const isSelected = selectedRoom === r;
                const classId = getClassId(selectedGrade, r);
                const hasData = (allClassesData[classId]?.students?.length || 0) > 0;

                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSelectedRoom(r)}
                    className={`py-3 px-2 rounded-2xl text-xs font-extrabold flex flex-col items-center justify-center gap-0.5 transition-all relative ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-105"
                        : hasData
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:border-emerald-300"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80"
                    }`}
                  >
                    <span>ห้อง {r}</span>
                    {hasData && (
                      <span className="text-[9px] font-normal opacity-80">
                        {allClassesData[classId].students.length} คน
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Room info preview */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <School className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-slate-700">
                ห้องที่เลือก: <strong className="text-blue-700 text-sm">ม.{selectedGrade}/{selectedRoom}</strong>
              </span>
            </div>
            {allClassesData[getClassId(selectedGrade, selectedRoom)]?.students?.length ? (
              <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full text-[11px] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> มีรายชื่อแล้ว
              </span>
            ) : (
              <span className="text-slate-400 text-[11px]">
                ยังไม่มีข้อมูลรายชื่อ
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all btn-press"
          >
            <span>เข้าสู่ห้องเรียน ม.{selectedGrade}/{selectedRoom}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* Tab 2: Teacher Login Portal */}
      {activeTab === "teacher" && (
        <form onSubmit={handleTeacherLogin} className="bg-white rounded-3xl border border-slate-200 shadow-subtle p-5 sm:p-7 space-y-4">
          <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-2xl text-xs text-amber-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>ระบบจะจดจำชื่อและอีเมลของท่านไว้โดยอัตโนมัติ ไม่ต้องกรอกใหม่ในครั้งถัดไป</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ชื่อ - นามสกุลอาจารย์ <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="เช่น ครูสมหมาย ใจดี"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              อีเมลติดต่อ (สำหรับนักเรียนส่งงาน)
            </label>
            <input
              type="email"
              placeholder="เช่น sommai@bj3.ac.th"
              value={teacherEmail}
              onChange={(e) => setTeacherEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              กลุ่มสาระฯ / วิชาที่สอน
            </label>
            <input
              type="text"
              placeholder="เช่น กลุ่มสาระการเรียนรู้คณิตศาสตร์"
              value={teacherSubject}
              onChange={(e) => setTeacherSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Teaching classes selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              เลือกห้องเรียนที่อาจารย์สอนหรือดูแล:
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
              {/* Junior rooms */}
              {[1, 2, 3].flatMap((g) =>
                Array.from({ length: 15 }, (_, i) => getClassId(g, i + 1))
              ).slice(0, 15).map((cid) => (
                <button
                  key={cid}
                  type="button"
                  onClick={() => toggleTeachingClass(cid)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                    teacherTeachingClasses.includes(cid)
                      ? "bg-blue-600 text-white"
                      : "bg-white text-slate-600 border border-slate-200"
                  }`}
                >
                  {getClassLabel(cid)}
                </button>
              ))}

              {/* Senior rooms */}
              {[4, 5, 6].flatMap((g) =>
                Array.from({ length: 11 }, (_, i) => getClassId(g, i + 1))
              ).map((cid) => (
                <button
                  key={cid}
                  type="button"
                  onClick={() => toggleTeachingClass(cid)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                    teacherTeachingClasses.includes(cid)
                      ? "bg-blue-600 text-white"
                      : "bg-white text-slate-600 border border-slate-200"
                  }`}
                >
                  {getClassLabel(cid)}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all btn-press"
          >
            <UserCheck className="w-4 h-4" />
            <span>เข้าสู่ระบบอาจารย์ & จัดการห้องเรียน</span>
          </button>
        </form>
      )}
    </div>
  );
}
