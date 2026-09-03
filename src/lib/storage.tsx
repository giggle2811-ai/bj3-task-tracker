"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import {
  Student,
  Subject,
  Task,
  SubmissionMap,
  ClassSettings,
  UserRole,
} from "../types";
import {
  DEFAULT_CLASS_SETTINGS,
  DEFAULT_STUDENTS,
  DEFAULT_SUBJECTS,
  DEFAULT_TASKS,
  createInitialSubmissions,
} from "./defaultData";
import { triggerConfetti } from "./utils";

const STORAGE_KEYS = {
  SETTINGS: "bj3_410_settings",
  STUDENTS: "bj3_410_students",
  SUBJECTS: "bj3_410_subjects",
  TASKS: "bj3_410_tasks",
  SUBMISSIONS: "bj3_410_submissions",
  ROLE: "bj3_410_role",
  CURRENT_STUDENT: "bj3_410_current_student",
};

interface TaskTrackerContextType {
  isInitialized: boolean;
  settings: ClassSettings;
  students: Student[];
  activeStudents: Student[];
  subjects: Subject[];
  tasks: Task[];
  submissions: SubmissionMap;
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentStudentId: string;
  setCurrentStudentId: (id: string) => void;
  currentStudent: Student | undefined;

  // Task actions
  addTask: (taskData: Omit<Task, "id" | "createdAt">) => Task;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;

  // Submission actions
  toggleSubmission: (taskId: string, studentId: string) => void;
  setSubmissionStatus: (taskId: string, studentId: string, isSubmitted: boolean) => void;
  batchSetSubmissions: (taskId: string, studentIds: string[], isSubmitted: boolean) => void;

  // Helpers
  getStudentSubmission: (taskId: string, studentId: string) => boolean;
  getTaskSubmissionStats: (taskId: string) => { submitted: number; total: number; percentage: number };
  getStudentStats: (studentId: string) => { total: number; submitted: number; pending: number; overdue: number; percentage: number };

  // Management actions
  updateSettings: (newSettings: Partial<ClassSettings>) => void;
  updateStudent: (student: Student) => void;
  addSubject: (subject: Omit<Subject, "id">) => void;
  deleteSubject: (subjectId: string) => void;
  resetAllData: () => void;
  exportData: () => string;
  importData: (jsonStr: string) => boolean;
}

const TaskTrackerContext = createContext<TaskTrackerContextType | undefined>(undefined);

export const TaskTrackerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [settings, setSettings] = useState<ClassSettings>(DEFAULT_CLASS_SETTINGS);
  const [students, setStudents] = useState<Student[]>(DEFAULT_STUDENTS);
  const [subjects, setSubjects] = useState<Subject[]>(DEFAULT_SUBJECTS);
  const [tasks, setTasks] = useState<Task[]>(DEFAULT_TASKS);
  const [submissions, setSubmissions] = useState<SubmissionMap>({});
  const [role, setRoleState] = useState<UserRole>("student");
  const [currentStudentId, setCurrentStudentIdState] = useState<string>("s-1");

  // Load initial data from localStorage
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (savedSettings) setSettings(JSON.parse(savedSettings));

      const savedStudents = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      const loadedStudents: Student[] = savedStudents ? JSON.parse(savedStudents) : DEFAULT_STUDENTS;
      setStudents(loadedStudents);

      const savedSubjects = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      if (savedSubjects) setSubjects(JSON.parse(savedSubjects));

      const savedTasks = localStorage.getItem(STORAGE_KEYS.TASKS);
      const loadedTasks: Task[] = savedTasks ? JSON.parse(savedTasks) : DEFAULT_TASKS;
      setTasks(loadedTasks);

      const savedSubmissions = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
      if (savedSubmissions) {
        setSubmissions(JSON.parse(savedSubmissions));
      } else {
        const initialSubs = createInitialSubmissions(loadedTasks, loadedStudents);
        setSubmissions(initialSubs);
        localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(initialSubs));
      }

      const savedRole = localStorage.getItem(STORAGE_KEYS.ROLE);
      if (savedRole === "teacher" || savedRole === "student") {
        setRoleState(savedRole);
      }

      const savedStudentId = localStorage.getItem(STORAGE_KEYS.CURRENT_STUDENT);
      if (savedStudentId && loadedStudents.some(s => s.id === savedStudentId)) {
        setCurrentStudentIdState(savedStudentId);
      } else {
        // Find first active student
        const firstActive = loadedStudents.find(s => s.status === "active");
        if (firstActive) setCurrentStudentIdState(firstActive.id);
      }
    } catch (err) {
      console.error("Failed to load task tracker data from storage", err);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error("Failed to save settings", e);
    }
  }, [settings, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    } catch (e) {
      console.error("Failed to save students", e);
    }
  }, [students, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
    } catch (e) {
      console.error("Failed to save subjects", e);
    }
  }, [subjects, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error("Failed to save tasks", e);
    }
  }, [tasks, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
    } catch (e) {
      console.error("Failed to save submissions", e);
    }
  }, [submissions, isInitialized]);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    try {
      localStorage.setItem(STORAGE_KEYS.ROLE, newRole);
    } catch (e) {
      console.error(e);
    }
  };

  const setCurrentStudentId = (id: string) => {
    setCurrentStudentIdState(id);
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_STUDENT, id);
    } catch (e) {
      console.error(e);
    }
  };

  const activeStudents = useMemo(() => {
    return students.filter(s => s.status === "active");
  }, [students]);

  const currentStudent = useMemo(() => {
    return students.find(s => s.id === currentStudentId) || activeStudents[0];
  }, [students, currentStudentId, activeStudents]);

  // Actions
  const addTask = (taskData: Omit<Task, "id" | "createdAt">): Task => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setTasks(prev => [newTask, ...prev]);

    // Initialize submissions map for this new task
    setSubmissions(prev => {
      const taskSubs: Record<string, { isSubmitted: boolean }> = {};
      students.forEach(s => {
        if (s.status === "active") {
          taskSubs[s.id] = { isSubmitted: false };
        }
      });
      return { ...prev, [newTask.id]: taskSubs };
    });

    return newTask;
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    setSubmissions(prev => {
      const next = { ...prev };
      delete next[taskId];
      return next;
    });
  };

  const getStudentSubmission = (taskId: string, studentId: string): boolean => {
    return !!submissions[taskId]?.[studentId]?.isSubmitted;
  };

  const setSubmissionStatus = (taskId: string, studentId: string, isSubmitted: boolean) => {
    setSubmissions(prev => {
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
    setSubmissions(prev => {
      const taskSubs = prev[taskId] ? { ...prev[taskId] } : {};
      studentIds.forEach(sid => {
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
    activeStudents.forEach(s => {
      if (submissions[taskId]?.[s.id]?.isSubmitted) {
        submitted++;
      }
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

    tasks.forEach(task => {
      const isDone = !!submissions[task.id]?.[studentId]?.isSubmitted;
      if (isDone) {
        submitted++;
      } else {
        pending++;
        const [y, m, d] = task.dueDate.split("-").map(Number);
        const due = new Date(y, m - 1, d);
        if (now.getTime() > due.getTime()) {
          overdue++;
        }
      }
    });

    const total = tasks.length;
    const percentage = total > 0 ? Math.round((submitted / total) * 100) : 0;
    return { total, submitted, pending, overdue, percentage };
  };

  const updateSettings = (newSettings: Partial<ClassSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const updateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
  };

  const addSubject = (subjectData: Omit<Subject, "id">) => {
    const newSubject: Subject = {
      ...subjectData,
      id: `sub-${Date.now()}`,
    };
    setSubjects(prev => [...prev, newSubject]);
  };

  const deleteSubject = (subjectId: string) => {
    setSubjects(prev => prev.filter(s => s.id !== subjectId));
  };

  const resetAllData = () => {
    setSettings(DEFAULT_CLASS_SETTINGS);
    setStudents(DEFAULT_STUDENTS);
    setSubjects(DEFAULT_SUBJECTS);
    setTasks(DEFAULT_TASKS);
    const initialSubs = createInitialSubmissions(DEFAULT_TASKS, DEFAULT_STUDENTS);
    setSubmissions(initialSubs);
    setRoleState("student");
    setCurrentStudentIdState("s-1");

    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.SUBJECTS);
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.SUBMISSIONS);
    localStorage.removeItem(STORAGE_KEYS.ROLE);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_STUDENT);
  };

  const exportData = (): string => {
    const exportObj = {
      version: "1.0",
      exportDate: new Date().toISOString(),
      settings,
      students,
      subjects,
      tasks,
      submissions,
    };
    return JSON.stringify(exportObj, null, 2);
  };

  const importData = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.settings && data.students && data.tasks) {
        setSettings(data.settings);
        setStudents(data.students);
        if (data.subjects) setSubjects(data.subjects);
        setTasks(data.tasks);
        if (data.submissions) setSubmissions(data.submissions);
        return true;
      }
      return false;
    } catch (e) {
      console.error("Failed to import data", e);
      return false;
    }
  };

  return (
    <TaskTrackerContext.Provider
      value={{
        isInitialized,
        settings,
        students,
        activeStudents,
        subjects,
        tasks,
        submissions,
        role,
        setRole,
        currentStudentId,
        setCurrentStudentId,
        currentStudent,
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
        updateStudent,
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
