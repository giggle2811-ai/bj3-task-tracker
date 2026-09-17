"use client";

import React from "react";
import Link from "next/link";
import { useTaskTracker } from "@/lib/storage";
import { School, UserPlus, ArrowLeft, Sparkles, BookOpen } from "lucide-react";

export const EmptyClassroom: React.FC = () => {
  const { currentClassLabel, selectedClassId } = useTaskTracker();

  return (
    <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-8 sm:p-14 text-center max-w-2xl mx-auto my-6 shadow-xs animate-fade-in">
      <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
        <School className="w-8 h-8" />
      </div>

      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 mb-3">
        ห้อง {currentClassLabel} โรงเรียนบรรหารแจ่มใสวิทยา ๓
      </span>

      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 mb-2">
        ยังไม่มีรายชื่อนักเรียนในห้องนี้
      </h2>

      <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed mb-6">
        อาจารย์ผู้สอนหรือคุณครูที่ปรึกษาของห้อง <strong>{currentClassLabel}</strong> ยังไม่ได้เปิดใช้งานหรือเพิ่มรายชื่อนักเรียนในระบบนี้
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/login"
          className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all btn-press"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>เปลี่ยนไปเลือกห้องอื่น</span>
        </Link>

        <Link
          href="/login"
          className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
        >
          <UserPlus className="w-4 h-4 text-blue-600" />
          <span>อาจารย์เข้าสู่ระบบเพื่อเพิ่มรายชื่อ</span>
        </Link>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-400">
        💡 เมื่อคุณครูประจำวิชาหรือครูที่ปรึกษาเข้ามาเพิ่มรายชื่อและสั่งงาน ข้อมูลจะปรากฏขึ้นโดยอัตโนมัติ
      </div>
    </div>
  );
};
