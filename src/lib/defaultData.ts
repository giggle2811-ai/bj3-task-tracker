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

export const DEFAULT_TASKS_M410: Task[] = [];

export function createInitialSubmissions(tasks: Task[], students: Student[]): SubmissionMap {
  const map: SubmissionMap = {};

  tasks.forEach((task) => {
    map[task.id] = {};
    students.forEach((student) => {
      if (student.status === "resigned") return;
      map[task.id][student.id] = {
        isSubmitted: false,
      };
    });
  });

  return map;
}
