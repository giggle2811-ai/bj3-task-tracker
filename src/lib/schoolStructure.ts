export interface GradeLevelConfig {
  grade: number; // 1 to 6
  name: string; // "มัธยมศึกษาปีที่ 1"
  shortName: string; // "ม.1"
  type: "junior" | "senior"; // junior = ม.ต้น (1-15), senior = ม.ปลาย (1-11)
  totalRooms: number;
}

export const SCHOOL_LEVELS: GradeLevelConfig[] = [
  { grade: 1, name: "มัธยมศึกษาปีที่ 1", shortName: "ม.1", type: "junior", totalRooms: 15 },
  { grade: 2, name: "มัธยมศึกษาปีที่ 2", shortName: "ม.2", type: "junior", totalRooms: 15 },
  { grade: 3, name: "มัธยมศึกษาปีที่ 3", shortName: "ม.3", type: "junior", totalRooms: 15 },
  { grade: 4, name: "มัธยมศึกษาปีที่ 4", shortName: "ม.4", type: "senior", totalRooms: 11 },
  { grade: 5, name: "มัธยมศึกษาปีที่ 5", shortName: "ม.5", type: "senior", totalRooms: 11 },
  { grade: 6, name: "มัธยมศึกษาปีที่ 6", shortName: "ม.6", type: "senior", totalRooms: 11 },
];

export function getClassId(grade: number, room: number): string {
  return `m${grade}-${room}`;
}

export function parseClassId(classId: string): { grade: number; room: number; label: string } {
  if (!classId) return { grade: 4, room: 10, label: "ม.4/10" };
  const match = classId.match(/^m(\d+)-(\d+)$/);
  if (!match) return { grade: 4, room: 10, label: "ม.4/10" };
  const grade = parseInt(match[1], 10);
  const room = parseInt(match[2], 10);
  return {
    grade,
    room,
    label: `ม.${grade}/${room}`,
  };
}

export function getClassLabel(classId: string): string {
  return parseClassId(classId).label;
}

export interface ClassItem {
  id: string;
  grade: number;
  room: number;
  label: string;
  type: "junior" | "senior";
}

export function getAllClasses(): ClassItem[] {
  const list: ClassItem[] = [];
  SCHOOL_LEVELS.forEach((level) => {
    for (let r = 1; r <= level.totalRooms; r++) {
      list.push({
        id: getClassId(level.grade, r),
        grade: level.grade,
        room: r,
        label: `${level.shortName}/${r}`,
        type: level.type,
      });
    }
  });
  return list;
}
