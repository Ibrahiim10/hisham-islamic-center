export type SurahOption = {
  number: number;
  name: string;
  ayahCount: number;
};

export type QuranLessonType = 'sabaq' | 'murajaah';

export type TeacherAssessment = 'excellent' | 'good' | 'needs_improvement' | 'needs_revision';

export type QuranLessonRecord = {
  id: string;
  studentId: string;
  studentName: string;
  displayId: string;
  className: string;
  date: string;
  type: QuranLessonType;
  surahNumber: number;
  surahName: string;
  fromAyah: number;
  toAyah: number;
  juz: number | null;
  pageFrom: number | null;
  pageTo: number | null;
  teacherAssessment: TeacherAssessment;
  teacherNotes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type QuranStudentSummary = {
  studentId: string;
  studentName: string;
  displayId: string;
  className: string;
  sabaqSessions: number;
  murajaahSessions: number;
  pagesRecorded: number;
  lastLessonDate: string | null;
  lastSabaqDate: string | null;
  lastMurajaahDate: string | null;
  latestAssessment: TeacherAssessment | null;
  latestTeacherNotes: string | null;
  currentSabaq: QuranLessonRecord | null;
  recentSabaq: QuranLessonRecord[];
  recentMurajaah: QuranLessonRecord[];
  history: QuranLessonRecord[];
};

export type QuranModuleStats = {
  totalLessons: number;
  sabaqCount: number;
  murajaahCount: number;
  studentsWithLessons: number;
  lessonsToday: number;
};

export type QuranLessonFormValues = {
  studentId: string;
  date: string;
  type: QuranLessonType;
  surahNumber: number | '';
  fromAyah: string;
  toAyah: string;
  juz: string;
  pageFrom: string;
  pageTo: string;
  teacherAssessment: TeacherAssessment | '';
  teacherNotes: string;
};
