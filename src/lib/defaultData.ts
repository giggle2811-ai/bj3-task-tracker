import { Student, Subject, Task, SubmissionMap, ClassSettings, TeacherProfile } from "../types";

export const DEFAULT_TEACHER_PROFILE: TeacherProfile = {
  id: "teacher-default",
  name: "ครูสมหมาย ใจดี",
  email: "sommai@bj3.ac.th",
  subject: "กลุ่มสาระการเรียนรู้คณิตศาสตร์",
  teachingClasses: ["m4-10", "m4-5"],
};

export const DEFAULT_CLASS_SETTINGS: ClassSettings = {
  schoolName: "โรงเรียนบรรหารแจ่มใสวิทยา ๓",
  shortSchoolName: "บ.จ. ๓",
  gradeLevel: "ม.4",
  roomNumber: "10",
  academicYear: "2567",
  semester: "1",
  announcement: "ยินดีต้อนรับสู่ระบบติดตามงาน บ.จ. ๓ ติดตามงานค้าง ส่งงานตรงเวลา ทุกคะแนนมีความหมาย! 🚀",
};

export const DEFAULT_STUDENTS_M410: Student[] = [
  { id: "s-1", seatNumber: 1, name: "จิรายุทธ แซ่ตัน", status: "active", gender: "male" },
  { id: "s-2", seatNumber: 2, name: "ธีรภัทร เยาวโรจน์", status: "active", gender: "male" },
  { id: "s-3", seatNumber: 3, name: "รติพงษ์ เจตนเสน", status: "active", gender: "male" },
  { id: "s-4", seatNumber: 4, name: "กฤษฎา อ่อนละออ", status: "active", gender: "male" },
  { id: "s-5", seatNumber: 5, name: "วรภพ จันทร์เสวก", status: "active", gender: "male" },
  { id: "s-6", seatNumber: 6, name: "สิรภัทร โพธิ์พจนภิญโญ", status: "active", gender: "male" },
  { id: "s-7", seatNumber: 7, name: "ธนภัทร นาโพธิ์", status: "active", gender: "male" },
  { id: "s-8", seatNumber: 8, name: "นิติธร ภูฆัง", status: "active", gender: "male" },
  { id: "s-9", seatNumber: 9, name: "อติเทพ ม่วงมูล", status: "active", gender: "male" },
  { id: "s-10", seatNumber: 10, name: "ณัฐพล จาดโห้", status: "active", gender: "male" },
  { id: "s-11", seatNumber: 11, name: "ธนกฤต เต็มหน", status: "active", gender: "male" },
  { id: "s-12", seatNumber: 12, name: "ปรเมษฐ์ ภูเวียง", status: "active", gender: "male" },
  { id: "s-13", seatNumber: 13, name: "เอกวานิช จันทร์เสวก", status: "active", gender: "male" },
  { id: "s-14", seatNumber: 14, name: "ปองคุณ กาฬภักดี", status: "active", gender: "male" },
  { id: "s-15", seatNumber: 15, name: "ธนเสฏฐ์ วงษ์จันทร์", status: "active", gender: "male" },
  { id: "s-16", seatNumber: 16, name: "— (ลาออกแล้ว)", status: "resigned", note: "ลาออกแล้ว (คงเลขที่เดิม ไม่ขยับเลขที่ถัดไป)" },
  { id: "s-17", seatNumber: 17, name: "สุชานันท์ ศิริปิมา", status: "active", gender: "female" },
  { id: "s-18", seatNumber: 18, name: "ฐิติภัทร ไตรวาศน์", status: "active", gender: "male" },
  { id: "s-19", seatNumber: 19, name: "ภูริชญา หอรดี", status: "active", gender: "female" },
  { id: "s-20", seatNumber: 20, name: "พรรณิภา กาสี", status: "active", gender: "female" },
  { id: "s-21", seatNumber: 21, name: "สุจารี สุขีวงศ์", status: "active", gender: "female" },
  { id: "s-22", seatNumber: 22, name: "ปุญญพัฒน์ ร่มโพธิ์ชี", status: "active", gender: "male" },
  { id: "s-23", seatNumber: 23, name: "พิทยาภรณ์ วรรณโต", status: "active", gender: "female" },
  { id: "s-24", seatNumber: 24, name: "ญาดา แดนดี", status: "active", gender: "female" },
  { id: "s-25", seatNumber: 25, name: "ภูริชญา แย้มไสว", status: "active", gender: "female" },
  { id: "s-26", seatNumber: 26, name: "สุมัชญา กลั่นศิริ", status: "active", gender: "female" },
  { id: "s-27", seatNumber: 27, name: "ชนิดาภา กลิ่นประทุม", status: "active", gender: "female" },
  { id: "s-28", seatNumber: 28, name: "ณภัสสร แก้วประดับ", status: "active", gender: "female" },
  { id: "s-29", seatNumber: 29, name: "มนัสวี เกลี้ยงทองคำ", status: "active", gender: "female" },
  { id: "s-30", seatNumber: 30, name: "ชนากานต์ บรรจงพินิจ", status: "active", gender: "female" },
];

export const DEFAULT_SUBJECTS: Subject[] = [
  {
    id: "sub-1",
    code: "ค31101",
    name: "คณิตศาสตร์พื้นฐาน",
    teacher: "ครูสมหมาย",
    color: "blue",
    bgLight: "bg-blue-50 text-blue-700 border-blue-200",
    textColor: "text-blue-600",
    borderColor: "border-blue-500",
  },
  {
    id: "sub-2",
    code: "ท31101",
    name: "ภาษาไทย",
    teacher: "ครูวิภา",
    color: "amber",
    bgLight: "bg-amber-50 text-amber-700 border-amber-200",
    textColor: "text-amber-600",
    borderColor: "border-amber-500",
  },
  {
    id: "sub-3",
    code: "อ31101",
    name: "ภาษาอังกฤษพื้นฐาน",
    teacher: "Teacher Michael / ครูกาญจนา",
    color: "indigo",
    bgLight: "bg-indigo-50 text-indigo-700 border-indigo-200",
    textColor: "text-indigo-600",
    borderColor: "border-indigo-500",
  },
  {
    id: "sub-4",
    code: "ว31201",
    name: "ฟิสิกส์ 1",
    teacher: "ครูปรีชา",
    color: "purple",
    bgLight: "bg-purple-50 text-purple-700 border-purple-200",
    textColor: "text-purple-600",
    borderColor: "border-purple-500",
  },
  {
    id: "sub-5",
    code: "ว31221",
    name: "เคมี 1",
    teacher: "ครูสุดาพร",
    color: "teal",
    bgLight: "bg-teal-50 text-teal-700 border-teal-200",
    textColor: "text-teal-600",
    borderColor: "border-teal-500",
  },
  {
    id: "sub-6",
    code: "ส31101",
    name: "สังคมศึกษา",
    teacher: "ครูวีระ",
    color: "emerald",
    bgLight: "bg-emerald-50 text-emerald-700 border-emerald-200",
    textColor: "text-emerald-600",
    borderColor: "border-emerald-500",
  },
  {
    id: "sub-7",
    code: "ว31104",
    name: "วิทยาการคำนวณ",
    teacher: "ครูชัยวัฒน์",
    color: "cyan",
    bgLight: "bg-cyan-50 text-cyan-700 border-cyan-200",
    textColor: "text-cyan-600",
    borderColor: "border-cyan-500",
  },
  {
    id: "sub-8",
    code: "พ31101",
    name: "สุขศึกษาและพลศึกษา",
    teacher: "ครูอภิสิทธิ์",
    color: "rose",
    bgLight: "bg-rose-50 text-rose-700 border-rose-200",
    textColor: "text-rose-600",
    borderColor: "border-rose-500",
  },
];

// Helper to format dynamic date offset based on today
function getDateOffset(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const DEFAULT_TASKS_M410: Task[] = [
  {
    id: "task-1",
    classId: "m4-10",
    title: "แบบฝึกหัด 2.1 เรื่อง ฟังก์ชันกำลังสองและกราฟพาราโบลา",
    subjectId: "sub-1",
    subjectName: "คณิตศาสตร์พื้นฐาน",
    teacherName: "ครูสมหมาย",
    description: "ทำในสมุดแบบฝึกหัด หน้า 45-47 ข้อ 1 ถึง 10 แสดงวิธีทำและวาดกราฟให้เรียบร้อย ส่งที่โต๊ะครูสมหมาย ห้องพักครูคณิตศาสตร์",
    dueDate: getDateOffset(1),
    dueTime: "16:30",
    priority: "high",
    type: "homework",
    createdAt: getDateOffset(-2),
  },
  {
    id: "task-2",
    classId: "m4-10",
    title: "รายงานวิเคราะห์วรรณคดี เรื่อง มัทนะพาธา",
    subjectId: "sub-2",
    subjectName: "ภาษาไทย",
    teacherName: "ครูวิภา",
    description: "รายงานรูปเล่มความยาว 3-5 หน้า สรุปใจความสำคัญ วิเคราะห์คุณค่าทางวรรณศิลป์ พร้อมข้อคิดที่ได้ นำส่งเป็นเล่มรายงาน",
    dueDate: getDateOffset(3),
    dueTime: "15:00",
    priority: "medium",
    type: "report",
    createdAt: getDateOffset(-4),
  },
  {
    id: "task-3",
    classId: "m4-10",
    title: "Worksheet Unit 3: Present Perfect vs Past Simple",
    subjectId: "sub-3",
    subjectName: "ภาษาอังกฤษพื้นฐาน",
    teacherName: "ครูกาญจนา",
    description: "Complete all exercises on page 24-26 in the workbook and check vocabulary on Quizlet before submitting.",
    dueDate: getDateOffset(-1),
    dueTime: "23:59",
    priority: "urgent",
    type: "worksheet",
    createdAt: getDateOffset(-5),
  },
  {
    id: "task-4",
    classId: "m4-10",
    title: "ใบแล็บการทดลองที่ 3 การเคลื่อนที่แนวตรงและความเร่ง",
    subjectId: "sub-4",
    subjectName: "ฟิสิกส์ 1",
    teacherName: "ครูปรีชา",
    description: "บันทึกผลการทดลองแถบกระดาษเคาะสัญญาณเวลา พร้อมคำนวณหาความเร็วเฉลี่ยและความเร่ง ส่งรายบุคคล",
    dueDate: getDateOffset(5),
    dueTime: "16:00",
    priority: "high",
    type: "worksheet",
    createdAt: getDateOffset(-1),
  },
  {
    id: "task-5",
    classId: "m4-10",
    title: "โครงงานพัฒนาโปรแกรม Python เพื่อแก้ปัญหาในโรงเรียน",
    subjectId: "sub-7",
    subjectName: "วิทยาการคำนวณ",
    teacherName: "ครูชัยวัฒน์",
    description: "เขียนโค้ดและส่งไฟล์ .py หรือ GitHub repository พร้อมเอกสารประกอบ 2 แผ่น แนบลิงก์ส่งงานในระบบ",
    dueDate: getDateOffset(7),
    dueTime: "23:59",
    priority: "medium",
    type: "project",
    createdAt: getDateOffset(-3),
    submissionLink: "https://classroom.google.com",
  },
  {
    id: "task-6",
    classId: "m4-10",
    title: "ผังมโนทัศน์ (Mind Map) กฎหมายแพ่งและพาณิชย์เบื้องต้น",
    subjectId: "sub-6",
    subjectName: "สังคมศึกษา",
    teacherName: "ครูวีระ",
    description: "วาดลงในกระดาษ 100 ปอนด์ ขนาด A4 ระบายสีตกแต่งให้สวยงาม สรุปเรื่องนิติกรรมสัญญาและทรัพย์สิน",
    dueDate: getDateOffset(-3),
    dueTime: "12:00",
    priority: "urgent",
    type: "homework",
    createdAt: getDateOffset(-7),
  },
];

export function createInitialSubmissions(tasks: Task[], students: Student[]): SubmissionMap {
  const map: SubmissionMap = {};

  tasks.forEach((task) => {
    map[task.id] = {};
    students.forEach((student) => {
      if (student.status === "resigned") return;

      const seed = (student.seatNumber * 7 + task.id.charCodeAt(5)) % 10;
      let isSubmitted = false;

      if (task.id === "task-1") {
        isSubmitted = seed > 2;
      } else if (task.id === "task-2") {
        isSubmitted = seed > 5;
      } else if (task.id === "task-3") {
        isSubmitted = seed > 3;
      } else if (task.id === "task-4") {
        isSubmitted = seed > 6;
      } else if (task.id === "task-5") {
        isSubmitted = seed > 7;
      } else if (task.id === "task-6") {
        isSubmitted = seed > 4;
      }

      map[task.id][student.id] = {
        isSubmitted,
        submittedAt: isSubmitted ? new Date().toISOString() : undefined,
      };
    });
  });

  return map;
}
