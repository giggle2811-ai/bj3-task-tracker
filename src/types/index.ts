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
  title: string;
  subjectId: string;
  subjectName: string;
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

export interface ClassSettings {
  schoolName: string;
  shortSchoolName: string;
  gradeLevel: string; // e.g. "ม.4"
  roomNumber: string; // e.g. "10"
  academicYear: string; // e.g. "2567"
  semester: string; // e.g. "1"
  announcement?: string;
}

export type UserRole = "student" | "teacher";
