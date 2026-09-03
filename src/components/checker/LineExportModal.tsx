"use client";

import React, { useState } from "react";
import { Task, Student } from "@/types";
import { useTaskTracker } from "@/lib/storage";
import { generateLineReminderMessage } from "@/lib/utils";
import {
  X,
  Copy,
  Check,
  Share2,
  MessageCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

interface LineExportModalProps {
  task: Task;
  onClose: () => void;
}

export const LineExportModal: React.FC<LineExportModalProps> = ({ task, onClose }) => {
  const { activeStudents, getStudentSubmission } = useTaskTracker();
  const [copied, setCopied] = useState(false);

  // Find all students who haven't submitted
  const unsubmittedStudents = activeStudents.filter(
    (student) => !getStudentSubmission(task.id, student.id)
  );

  const messageText = generateLineReminderMessage(
    task,
    unsubmittedStudents,
    activeStudents.length
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(messageText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = messageText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleOpenLine = () => {
    const encoded = encodeURIComponent(messageText);
    window.open(`https://line.me/R/msg/text/?${encoded}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-emerald-50 via-teal-50/40 to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/30">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                ส่งแจ้งเตือนงานค้างลง LINE กลุ่ม
              </h3>
              <p className="text-xs text-slate-500">
                คัดลอกรายชื่อเพื่อนที่ยังไม่ส่งเพื่อทวงงานใน LINE กลุ่มห้อง ม.4/10
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>ตัวอย่างข้อความที่จะส่ง:</span>
            <span className="font-semibold text-emerald-700">
              ค้างส่ง {unsubmittedStudents.length} คน
            </span>
          </div>

          {/* Text preview box */}
          <div className="relative">
            <pre className="w-full h-64 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 whitespace-pre-wrap overflow-y-auto leading-relaxed select-all">
              {messageText}
            </pre>
            {copied && (
              <div className="absolute inset-0 bg-emerald-900/10 backdrop-blur-[1px] rounded-xl flex items-center justify-center">
                <div className="bg-emerald-600 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg flex items-center gap-1.5 animate-bounce">
                  <Check className="w-4 h-4" />
                  <span>คัดลอกข้อความสำเร็จแล้ว! พร้อมวางใน LINE</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
          <button
            onClick={handleCopy}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>คัดลอกแล้ว</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>คัดลอกข้อความ</span>
              </>
            )}
          </button>

          <button
            onClick={handleOpenLine}
            className="px-4 py-2.5 rounded-xl bg-[#06C755] hover:bg-[#05b34c] text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-sm shadow-[#06c755]/25"
          >
            <Share2 className="w-4 h-4" />
            <span>เปิดแอป LINE เพื่อแชร์</span>
          </button>
        </div>
      </div>
    </div>
  );
};
