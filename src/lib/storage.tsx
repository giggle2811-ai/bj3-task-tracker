"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import {
  Student,
  Subject,
  Task,
  SubmissionMap,
  ClassSettings,
  UserRole,
  TeacherProfile,
  AuthState,
} from "../types";
import {
  DEFAULT_CLASS_SETTINGS,
  DEFAULT_STUDENTS_M410,
  DEFAULT_SUBJECTS,
  DEFAULT_TASKS_M410,
  DEFAULT_TEACHER_PROFILE,
  createInitialSubmissions,
} from "./defaultData";
import { parseClassId, getClassLabel } from "./schoolStructure";
import { triggerConfetti } from "./utils";

const STORAGE_KEYS = {
  AUTH: "bj3_auth_session",
  TEACHER_PROFILE: "bj3_teacher_profile",
  CLASSES_DATA: "bj3_classes_store",
  SUBJECTS: "bj3_subjects_store",
  SUBMISSIONS: "bj3_submissions_store",
  SETTINGS: "bj3_settings_store",
};

interface ClassStoreItem {
  students: Student[];
  tasks: Task[];
  announcement?: string;
}

type ClassesStore = Record<string, ClassStoreItem>;

interface TaskTrackerContextType {
  isInitialized: boolean;
  settings: ClassSettings;

  // Auth State
  role: UserRole | null;
  teacherProfile: TeacherProfile | null;
  selectedClassId: string;
  selectedStudentId: string | null;
  currentStudentId: string | null;
  currentStudent: Student | undefined;

  // Current Class Data
  currentClassLabel: string;
  students: Student[];
  activeStudents: Student[];
  tasks: Task[];
  hasStudents: boolean;
  allClassesData: ClassesStore;

  // Subjects
  subjects: Subject[];
  submissions: SubmissionMap;

  // Auth Actions
  loginTeacher: (name: string, email: string, subject: string, teachingClasses: string[]) => void;
  loginStudent: (classId: string, studentId?: string) => void;
  switchClass: (classId: string) => void;
  switchStudent: (studentId: string) => void;
  logout: () => void;

  // Teacher Classroom Management
  saveClassStudents: (classId: string, students: Student[]) => void;
  batchImportStudents: (classId: string, namesListText: string) => void;
  updateTeacherClasses: (teachingClasses: string[]) => void;

  // Task Actions
  addTask: (taskData: Omit<Task, "id" | "createdAt">, targetClassId?: string) => Task;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;

  // Submission Actions
  toggleSubmission: (taskId: string, studentId: string) => void;
  setSubmissionStatus: (taskId: string, studentId: string, isSubmitted: boolean) => void;
  batchSetSubmissions: (taskId: string, studentIds: string[], isSubmitted: boolean) => void;

  // Helper Stats
  getStudentSubmission: (taskId: string, studentId: string) => boolean;
  getTaskSubmissionStats: (taskId: string) => { submitted: number; total: number; percentage: number };
  getStudentStats: (studentId: string) => { total: number; submitted: number; pending: number; overdue: number; percentage: number };

  // Settings & Subjects
  updateSettings: (newSettings: Partial<ClassSettings>) => void;
  addSubject: (subject: Omit<Subject, "id">) => void;
  deleteSubject: (subjectId: string) => void;
  resetAllData: () => void;
  exportData: () => string;
  importData: (jsonStr: string) => boolean;
}

const TaskTrackerContext = createContext<TaskTrackerContextType | undefined>(undefined);

export const TaskTrackerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  // Settings
  const [settings, setSettings] = useState<ClassSettings>(DEFAULT_CLASS_SETTINGS);

  // Auth
  const [role, setRole] = useState<UserRole | null>("student");
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(DEFAULT_TEACHER_PROFILE);
  const [selectedClassId, setSelectedClassId] = useState<string>("m4-10");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>("s-1");

  // Classes Store
  const [classesStore, setClassesStore] = useState<ClassesStore>({
    "m4-10": {
      students: DEFAULT_STUDENTS_M410,
      tasks: DEFAULT_TASKS_M410,
    },
  });

  // Subjects & Submissions
  const [subjects, setSubjects] = useState<Subject[]>(DEFAULT_SUBJECTS);
  const [submissions, setSubmissions] = useState<SubmissionMap>({});

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      // 1. Saved Teacher Profile
      const savedTeacher = localStorage.getItem(STORAGE_KEYS.TEACHER_PROFILE);
      if (savedTeacher) {
        setTeacherProfile(JSON.parse(savedTeacher));
      } else {
        localStorage.setItem(STORAGE_KEYS.TEACHER_PROFILE, JSON.stringify(DEFAULT_TEACHER_PROFILE));
      }

      // 2. Saved Classes Store
      const savedClasses = localStorage.getItem(STORAGE_KEYS.CLASSES_DATA);
      let initialClasses: ClassesStore = {
        "m4-10": {
          students: DEFAULT_STUDENTS_M410,
          tasks: DEFAULT_TASKS_M410,
        },
      };
      if (savedClasses) {
        try {
          const parsed = JSON.parse(savedClasses);
          // Ensure m4-10 exists with data if empty
          if (!parsed["m4-10"] || !parsed["m4-10"].students || parsed["m4-10"].students.length === 0) {
            parsed["m4-10"] = {
              students: DEFAULT_STUDENTS_M410,
              tasks: DEFAULT_TASKS_M410,
            };
          }
          initialClasses = parsed;
        } catch {
          // fallback to initialClasses
        }
      }
      setClassesStore(initialClasses);
      localStorage.setItem(STORAGE_KEYS.CLASSES_DATA, JSON.stringify(initialClasses));

      // 3. Saved Auth Session
      const savedAuth = localStorage.getItem(STORAGE_KEYS.AUTH);
      if (savedAuth) {
        const parsedAuth: AuthState = JSON.parse(savedAuth);
        setRole(parsedAuth.role || "student");
        setSelectedClassId(parsedAuth.selectedClassId || "m4-10");
        setSelectedStudentId(parsedAuth.selectedStudentId || "s-1");
      }

      // 4. Saved Subjects
      const savedSubjects = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      if (savedSubjects) setSubjects(JSON.parse(savedSubjects));

      // 5. Saved Submissions
      const savedSubs = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
      if (savedSubs) {
        setSubmissions(JSON.parse(savedSubs));
      } else {
        const initialSubs = createInitialSubmissions(
          initialClasses["m4-10"].tasks,
          initialClasses["m4-10"].students
        );
        setSubmissions(initialSubs);
        localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(initialSubs));
      }

      // 6. Settings
      const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (savedSettings) setSettings(JSON.parse(savedSettings));
    } catch (e) {
      console.error("Failed to initialize storage", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEYS.CLASSES_DATA, JSON.stringify(classesStore));
    } catch (e) {
      console.error(e);
    }
  }, [classesStore, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      const authState: AuthState = {
        role,
        teacherProfile,
        selectedClassId,
        selectedStudentId,
      };
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(authState));
    } catch (e) {
      console.error(e);
    }
  }, [role, teacherProfile, selectedClassId, selectedStudentId, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
    } catch (e) {
      console.error(e);
    }
  }, [submissions, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
    } catch (e) {
      console.error(e);
    }
  }, [subjects, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings, isInitialized]);

  // Derived current class data
  const currentClassData = useMemo<ClassStoreItem>(() => {
    return classesStore[selectedClassId] || { students: [], tasks: [] };
  }, [classesStore, selectedClassId]);

  const students = useMemo(() => currentClassData.students || [], [currentClassData]);
  const tasks = useMemo(() => currentClassData.tasks || [], [currentClassData]);
  const hasStudents = students.length > 0;

  const activeStudents = useMemo(() => {
    return students.filter((s) => s.status === "active");
  }, [students]);

  const currentStudent = useMemo(() => {
    return students.find((s) => s.id === selectedStudentId) || activeStudents[0];
  }, [students, selectedStudentId, activeStudents]);

  const currentClassLabel = useMemo(() => {
    return getClassLabel(selectedClassId);
  }, [selectedClassId]);

  // Auth actions
  const loginTeacher = (
    name: string,
    email: string,
    subject: string,
    teachingClasses: string[]
  ) => {
    const profile: TeacherProfile = {
      id: `teacher-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      teachingClasses: teachingClasses.length > 0 ? teachingClasses : ["m4-10"],
    };

    setTeacherProfile(profile);
    setRole("teacher");
    setSelectedClassId(profile.teachingClasses[0] || "m4-10");

    localStorage.setItem(STORAGE_KEYS.TEACHER_PROFILE, JSON.stringify(profile));
  };

  const loginStudent = (classId: string, studentId?: string) => {
    setRole("student");
    setSelectedClassId(classId);

    const targetStudents = classesStore[classId]?.students || [];
    const active = targetStudents.filter((s) => s.status === "active");

    if (studentId && targetStudents.some((s) => s.id === studentId)) {
      setSelectedStudentId(studentId);
    } else if (active.length > 0) {
      setSelectedStudentId(active[0].id);
    } else {
      setSelectedStudentId(null);
    }
  };

  const switchClass = (classId: string) => {
    setSelectedClassId(classId);
    const targetStudents = classesStore[classId]?.students || [];
    const active = targetStudents.filter((s) => s.status === "active");
    if (active.length > 0) {
      setSelectedStudentId(active[0].id);
    } else {
      setSelectedStudentId(null);
    }
  };

  const switchStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
  };

  const logout = () => {
    setRole(null);
    setSelectedStudentId(null);
  };

  // Classroom Management by Teacher
  const saveClassStudents = (classId: string, newStudents: Student[]) => {
    setClassesStore((prev) => {
      const existing = prev[classId] || { students: [], tasks: [] };
      return {
        ...prev,
        [classId]: {
          ...existing,
          students: newStudents,
        },
      };
    });
  };

  // Batch paste/import student names (e.g. 1 per line)
  const batchImportStudents = (classId: string, namesListText: string) => {
    const lines = namesListText
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    let seat = 1;
    const imported: Student[] = lines.map((line) => {
      // Strip leading number if user pasted "1. นาย..." or "1 นาย..."
      const cleaned = line.replace(/^\d+[\.\s\-\)]+\s*/, "").trim();
      const currentSeat = seat++;
      return {
        id: `s-${classId}-${currentSeat}-${Date.now()}`,
        seatNumber: currentSeat,
        name: cleaned,
        status: "active",
      };
    });

    saveClassStudents(classId, imported);
  };

  const updateTeacherClasses = (teachingClasses: string[]) => {
    if (!teacherProfile) return;
    const updated: TeacherProfile = {
      ...teacherProfile,
      teachingClasses,
    };
    setTeacherProfile(updated);
    localStorage.setItem(STORAGE_KEYS.TEACHER_PROFILE, JSON.stringify(updated));
  };

  // Task Actions
  const addTask = (
    taskData: Omit<Task, "id" | "createdAt">,
    targetClassId?: string
  ): Task => {
    const target = targetClassId || selectedClassId;
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      classId: target,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setClassesStore((prev) => {
      const room = prev[target] || { students: [], tasks: [] };
      return {
        ...prev,
        [target]: {
          ...room,
          tasks: [newTask, ...room.tasks],
        },
      };
    });

    // Initialize submission map for this task
    setSubmissions((prev) => {
      const roomStudents = classesStore[target]?.students || [];
      const taskSubs: Record<string, { isSubmitted: boolean }> = {};
      roomStudents.forEach((s) => {
        if (s.status === "active") taskSubs[s.id] = { isSubmitted: false };
      });
      return { ...prev, [newTask.id]: taskSubs };
    });

    return newTask;
  };

  const updateTask = (updatedTask: Task) => {
    setClassesStore((prev) => {
      const target = updatedTask.classId || selectedClassId;
      const room = prev[target] || { students: [], tasks: [] };
      return {
        ...prev,
        [target]: {
          ...room,
          tasks: room.tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
        },
      };
    });
  };

  const deleteTask = (taskId: string) => {
    setClassesStore((prev) => {
      const target = selectedClassId;
      const room = prev[target] || { students: [], tasks: [] };
      return {
        ...prev,
        [target]: {
          ...room,
          tasks: room.tasks.filter((t) => t.id !== taskId),
        },
      };
    });

    setSubmissions((prev) => {
      const next = { ...prev };
      delete next[taskId];
      return next;
    });
  };

  // Submission actions
  const getStudentSubmission = (taskId: string, studentId: string): boolean => {
    return !!submissions[taskId]?.[studentId]?.isSubmitted;
  };

  const setSubmissionStatus = (taskId: string, studentId: string, isSubmitted: boolean) => {
    setSubmissions((prev) => {
      const taskSubs = prev[taskId] ? { ...prev[taskId] } : {};
      taskSubs[studentId] = {
        isSubmitted,
        submittedAt: isSubmitted ? new Date().toISOString() : undefined,
      };
      return { ...prev, [taskId]: taskSubs };
    });

    if (isSubmitted) {
      triggerConfetti();
    }
  };

  const toggleSubmission = (taskId: string, studentId: string) => {
    const current = getStudentSubmission(taskId, studentId);
    setSubmissionStatus(taskId, studentId, !current);
  };

  const batchSetSubmissions = (taskId: string, studentIds: string[], isSubmitted: boolean) => {
    setSubmissions((prev) => {
      const taskSubs = prev[taskId] ? { ...prev[taskId] } : {};
      studentIds.forEach((sid) => {
        taskSubs[sid] = {
          isSubmitted,
          submittedAt: isSubmitted ? new Date().toISOString() : undefined,
        };
      });
      return { ...prev, [taskId]: taskSubs };
    });

    if (isSubmitted && studentIds.length > 0) {
      triggerConfetti();
    }
  };

  const getTaskSubmissionStats = (taskId: string) => {
    const total = activeStudents.length;
    let submitted = 0;
    activeStudents.forEach((s) => {
      if (submissions[taskId]?.[s.id]?.isSubmitted) submitted++;
    });
    const percentage = total > 0 ? Math.round((submitted / total) * 100) : 0;
    return { submitted, total, percentage };
  };

  const getStudentStats = (studentId: string) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    let submitted = 0;
    let overdue = 0;
    let pending = 0;

    tasks.forEach((task) => {
      const isDone = !!submissions[task.id]?.[studentId]?.isSubmitted;
      if (isDone) {
        submitted++;
      } else {
        pending++;
        const [y, m, d] = task.dueDate.split("-").map(Number);
        const due = new Date(y, m - 1, d);
        if (now.getTime() > due.getTime()) overdue++;
      }
    });

    const total = tasks.length;
    const percentage = total > 0 ? Math.round((submitted / total) * 100) : 0;
    return { total, submitted, pending, overdue, percentage };
  };

  const updateSettings = (newSettings: Partial<ClassSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const addSubject = (subjectData: Omit<Subject, "id">) => {
    const newSubject: Subject = {
      ...subjectData,
      id: `sub-${Date.now()}`,
    };
    setSubjects((prev) => [...prev, newSubject]);
  };

  const deleteSubject = (subjectId: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== subjectId));
  };

  const resetAllData = () => {
    const initialClasses: ClassesStore = {
      "m4-10": {
        students: DEFAULT_STUDENTS_M410,
        tasks: DEFAULT_TASKS_M410,
      },
    };
    setClassesStore(initialClasses);
    setTeacherProfile(DEFAULT_TEACHER_PROFILE);
    setSubjects(DEFAULT_SUBJECTS);
    setSettings(DEFAULT_CLASS_SETTINGS);
    const initialSubs = createInitialSubmissions(DEFAULT_TASKS_M410, DEFAULT_STUDENTS_M410);
    setSubmissions(initialSubs);
    setRole("student");
    setSelectedClassId("m4-10");
    setSelectedStudentId("s-1");

    localStorage.clear();
  };

  const exportData = (): string => {
    const exportObj = {
      version: "2.0",
      exportDate: new Date().toISOString(),
      classesStore,
      teacherProfile,
      subjects,
      submissions,
      settings,
    };
    return JSON.stringify(exportObj, null, 2);
  };

  const importData = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.classesStore || data.students) {
        if (data.classesStore) setClassesStore(data.classesStore);
        if (data.teacherProfile) setTeacherProfile(data.teacherProfile);
        if (data.subjects) setSubjects(data.subjects);
        if (data.submissions) setSubmissions(data.submissions);
        if (data.settings) setSettings(data.settings);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <TaskTrackerContext.Provider
      value={{
        isInitialized,
        settings,
        role,
        teacherProfile,
        selectedClassId,
        selectedStudentId,
        currentStudentId: selectedStudentId,
        currentStudent,
        currentClassLabel,
        students,
        activeStudents,
        tasks,
        hasStudents,
        allClassesData: classesStore,
        subjects,
        submissions,
        loginTeacher,
        loginStudent,
        switchClass,
        switchStudent,
        logout,
        saveClassStudents,
        batchImportStudents,
        updateTeacherClasses,
        addTask,
        updateTask,
        deleteTask,
        toggleSubmission,
        setSubmissionStatus,
        batchSetSubmissions,
        getStudentSubmission,
        getTaskSubmissionStats,
        getStudentStats,
        updateSettings,
        addSubject,
        deleteSubject,
        resetAllData,
        exportData,
        importData,
      }}
    >
      {children}
    </TaskTrackerContext.Provider>
  );
};

export const useTaskTracker = () => {
  const context = useContext(TaskTrackerContext);
  if (!context) {
    throw new Error("useTaskTracker must be used within a TaskTrackerProvider");
  }
  return context;
};
