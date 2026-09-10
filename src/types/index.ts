export type StudentStatus = "active" | "resigned";

export interface Student {
  id: string;
  seatNumber: number;
  name: string;
  status: StudentStatus;
  gender?: "male" | "female";
  note?: string;
}

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export type TaskType =
  | "homework"
  | "worksheet"
  | "project"
  | "report"
  | "quiz"
  | "other";

export interface Subject {
  id: string;
  code: string;
  name: string;
  teacher: string;
  color: string;
  bgLight: string;
  textColor: string;
  borderColor: string;
  iconName?: string;
}

export interface Task {
  id: string;
  classId: string; // e.g. "m4-10"
  title: string;
  subjectId: string;
  subjectName: string;
  teacherName?: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  priority: TaskPriority;
  type: TaskType;
  createdAt: string;
  submissionLink?: string;
}

export interface StudentSubmission {
  isSubmitted: boolean;
  submittedAt?: string;
  note?: string;
}

// taskId -> studentId -> StudentSubmission
export type SubmissionMap = Record<string, Record<string, StudentSubmission>>;

export interface TeacherProfile {
  id: string;
  name: string;
  email: string;
  subject: string;
  teachingClasses: string[]; // e.g. ["m4-10", "m4-5"]
}

export interface ClassroomData {
  id: string; // e.g. "m4-10"
  grade: number; // 1 to 6
  room: number; // 1 to 15 (m.1-3) or 1 to 11 (m.4-6)
  gradeLabel: string; // e.g. "ม.4"
  roomLabel: string; // e.g. "10"
  fullLabel: string; // e.g. "ม.4/10"
  students: Student[];
  tasks: Task[];
  announcement?: string;
}

export interface ClassSettings {
  schoolName: string;
  shortSchoolName: string;
  gradeLevel: string;
  roomNumber: string;
  academicYear: string;
  semester: string;
  announcement?: string;
}

export type UserRole = "student" | "teacher";

export interface AuthState {
  role: UserRole | null;
  teacherProfile: TeacherProfile | null;
  selectedClassId: string; // default "m4-10"
  selectedStudentId: string | null;
}
