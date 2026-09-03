"use client";

import React, { useState, useEffect } from "react";
import { Task, TaskPriority, TaskType } from "@/types";
import { useTaskTracker } from "@/lib/storage";
import { X, Calendar, Clock, BookOpen, AlertCircle, Link2, Plus } from "lucide-react";

interface TaskFormModalProps {
  taskToEdit?: Task | null;
  onClose: () => void;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  taskToEdit,
  onClose,
}) => {
  const { subjects, addTask, updateTask } = useTaskTracker();

  const [title, setTitle] = useState(taskToEdit?.title || "");
  const [subjectId, setSubjectId] = useState(
    taskToEdit?.subjectId || (subjects.length > 0 ? subjects[0].id : "")
  );
  const [type, setType] = useState<TaskType>(taskToEdit?.type || "homework");
  const [dueDate, setDueDate] = useState(
    taskToEdit?.dueDate ||
      new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [dueTime, setDueTime] = useState(taskToEdit?.dueTime || "16:30");
  const [priority, setPriority] = useState<TaskPriority>(taskToEdit?.priority || "medium");
  const [description, setDescription] = useState(taskToEdit?.description || "");
  const [submissionLink, setSubmissionLink] = useState(taskToEdit?.submissionLink || "");

  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("กรุณากรอกชื่องาน");
      return;
    }
    if (!dueDate) {
      setError("กรุณากำหนดวันส่งงาน");
      return;
    }

    const selectedSubject = subjects.find((s) => s.id === subjectId);
    const subjectName = selectedSubject ? selectedSubject.name : "ทั่วไป";

    if (taskToEdit) {
      updateTask({
        ...taskToEdit,
        title: title.trim(),
        subjectId,
        subjectName,
        type,
        dueDate,
        dueTime: dueTime.trim() || undefined,
        priority,
        description: description.trim(),
        submissionLink: submissionLink.trim() || undefined,
      });
    } else {
      addTask({
        title: title.trim(),
        subjectId,
        subjectName,
        type,
        dueDate,
        dueTime: dueTime.trim() || undefined,
        priority,
        description: description.trim(),
        submissionLink: submissionLink.trim() || undefined,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/60 to-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <BookOpen className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {taskToEdit ? "แก้ไขงาน" : "สั่งงานใหม่ (เพิ่มงาน)"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ชื่องาน / รายละเอียดหัวข้อ <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="เช่น แบบฝึกหัดที่ 2.3 เรื่อง กราฟพาราโบลา"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError("");
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Subject and Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                รายวิชา <span className="text-rose-500">*</span>
              </label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} ({sub.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ประเภทงาน
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as TaskType)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="homework">การบ้าน</option>
                <option value="worksheet">ใบงาน / แบบฝึกหัด</option>
                <option value="project">โครงงาน / ชิ้นงาน</option>
                <option value="report">รายงานรูปเล่ม</option>
                <option value="quiz">เก็บคะแนน / สอบย่อย</option>
                <option value="other">อื่นๆ</option>
              </select>
            </div>
          </div>

          {/* Due Date and Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                วันกำหนดส่ง <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                เวลาส่ง (ไม่บังคับ)
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              ความสำคัญ
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "low", label: "ทั่วไป", color: "hover:border-slate-400" },
                { id: "medium", label: "ปานกลาง", color: "hover:border-blue-400" },
                { id: "urgent", label: "ด่วนมาก 🔥", color: "hover:border-rose-400" },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPriority(p.id as TaskPriority)}
                  className={`py-2 rounded-xl text-xs font-medium border text-center transition-all ${
                    priority === p.id
                      ? "bg-blue-50 border-blue-500 text-blue-700 font-semibold shadow-sm"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              คำอธิบายเพิ่มเติม / คำสั่งในการทำ
            </label>
            <textarea
              rows={3}
              placeholder="เช่น ทำใส่สมุด ส่งที่โต๊ะครูห้องพักครู หรืออธิบายขั้นตอนการทำงาน"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Submission Link */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Link2 className="w-3.5 h-3.5 text-slate-500" />
              <span>ลิงก์ส่งงาน / ลิงก์ไฟล์เอกสาร (ถ้ามี)</span>
            </label>
            <input
              type="url"
              placeholder="https://classroom.google.com/..."
              value={submissionLink}
              onChange={(e) => setSubmissionLink(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs sm:text-sm font-semibold transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-colors shadow-md shadow-blue-500/25"
            >
              {taskToEdit ? "บันทึกการแก้ไข" : "บันทึกและสั่งงาน"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
