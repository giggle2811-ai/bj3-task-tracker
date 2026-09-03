import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Student, Task } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

const THAI_MONTHS_SHORT = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
];

export function formatThaiDate(dateStr: string, includeYear = true): string {
  if (!dateStr) return "";
  try {
    const d = parseDate(dateStr);
    const day = d.getDate();
    const month = THAI_MONTHS_SHORT[d.getMonth()];
    const buddhistYear = d.getFullYear() + 543;
    return includeYear ? `${day} ${month} ${buddhistYear}` : `${day} ${month}`;
  } catch {
    return dateStr;
  }
}

export function isOverdue(dueDateStr: string, dueTimeStr?: string): boolean {
  if (!dueDateStr) return false;
  const now = new Date();
  const [year, month, day] = dueDateStr.split("-").map(Number);
  let [hours, minutes] = [23, 59];
  if (dueTimeStr) {
    const parts = dueTimeStr.split(":").map(Number);
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      hours = parts[0];
      minutes = parts[1];
    }
  }
  const due = new Date(year, month - 1, day, hours, minutes, 59);
  return now.getTime() > due.getTime();
}

export function isDueToday(dueDateStr: string): boolean {
  if (!dueDateStr) return false;
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  return dueDateStr === todayStr;
}

export function isDueSoon(dueDateStr: string): boolean {
  if (!dueDateStr) return false;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const due = parseDate(dueDateStr);
  due.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 3;
}

export function getDaysRemainingText(dueDateStr: string, dueTimeStr?: string): { text: string; color: string; isUrgent: boolean } {
  if (isOverdue(dueDateStr, dueTimeStr)) {
    return { text: "เลยกำหนดส่งแล้ว", color: "text-red-600 bg-red-50 border-red-200", isUrgent: true };
  }
  if (isDueToday(dueDateStr)) {
    return { text: "ส่งภายในวันนี้!", color: "text-amber-700 bg-amber-50 border-amber-300", isUrgent: true };
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const due = parseDate(dueDateStr);
  due.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return { text: "ส่งพรุ่งนี้", color: "text-amber-600 bg-amber-50 border-amber-200", isUrgent: true };
  }
  if (diffDays <= 3) {
    return { text: `เหลืออีก ${diffDays} วัน`, color: "text-blue-700 bg-blue-50 border-blue-200", isUrgent: false };
  }
  return { text: `เหลืออีก ${diffDays} วัน`, color: "text-slate-600 bg-slate-100 border-slate-200", isUrgent: false };
}

// Generate LINE reminder message
export function generateLineReminderMessage(
  task: Task,
  unsubmittedStudents: Student[],
  totalActiveCount: number
): string {
  const thaiDate = formatThaiDate(task.dueDate);
  const dueTime = task.dueTime ? ` เวลา ${task.dueTime} น.` : "";
  const unsubmittedCount = unsubmittedStudents.length;
  const submittedCount = totalActiveCount - unsubmittedCount;

  let msg = `📢 [แจ้งเตือนงานค้าง ม.4/10 บ.จ. ๓]\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `📖 วิชา: ${task.subjectName}\n`;
  msg += `📝 งาน: ${task.title}\n`;
  msg += `⏰ กำหนดส่ง: ${thaiDate}${dueTime}\n`;
  msg += `📊 ส่งแล้ว: ${submittedCount}/${totalActiveCount} คน (ยังไม่ส่ง ${unsubmittedCount} คน)\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `⚠️ รายชื่อเพื่อนที่ยังไม่ส่ง:\n`;

  if (unsubmittedStudents.length === 0) {
    msg += `🎉 ยอดเยี่ยมมาก! ทุกคนในห้องส่งงานครบ 100% แล้วครับ\n`;
  } else {
    unsubmittedStudents.forEach((student) => {
      msg += `• เลขที่ ${student.seatNumber} ${student.name}\n`;
    });
  }

  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `💬 รบกวนรีบดำเนินการและนำส่งครูผู้สอนด้วยนะคร้าบ ✌️✨`;

  return msg;
}

// Confetti trigger
export async function triggerConfetti() {
  try {
    const confetti = (await import("canvas-confetti")).default;
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ["#3b82f6", "#10b981", "#fbbf24", "#f43f5e", "#8b5cf6"],
    });
  } catch {
    // Graceful fallback if confetti fails or runs on server
  }
}
