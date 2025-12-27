// User roles
export type UserRole = 'TEACHER' | 'PARENT' | 'ADMIN' | 'STUDENT';

// Exercise types
export type ExerciseType = 'MATCHING' | 'DRAG_DROP' | 'CROSSWORD' | 'REBUS' | 'QUIZ' | 'FILL_IN' | 'EXTERNAL_LINK';

// Difficulty levels
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

// Interfaces
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface StudentProfile {
  id: string;
  nickname: string;
  avatarEmoji: string;
  classGroupId: string;
  parentId?: string;
}

export interface ClassGroup {
  id: string;
  name: string;
  teacherId: string;
  grade: number;
  studentCount: number;
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Grade {
  id: string;
  number: number;
  subjectId: string;
}

export interface Topic {
  id: string;
  name: string;
  gradeId: string;
  icon: string;
}

export interface Subtopic {
  id: string;
  name: string;
  topicId: string;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  type: ExerciseType;
  difficulty: Difficulty;
  subjectId: string;
  gradeNumber: number;
  topicId: string;
  contentJson: Record<string, unknown>;
  externalUrl?: string;
  thumbnailEmoji: string;
  estimatedTime: number; // in minutes
}

export interface Lesson {
  id: string;
  title: string;
  exercises: Exercise[];
  teacherId: string;
  createdAt: Date;
}

export interface Assignment {
  id: string;
  lessonId: string;
  lesson: Lesson;
  classGroupId?: string;
  studentProfileId?: string;
  dueDate: Date;
  createdAt: Date;
}

export interface AssignmentResult {
  id: string;
  assignmentId: string;
  studentId: string;
  exerciseId: string;
  score: number;
  maxScore: number;
  timeSpent: number; // in seconds
  mistakes: number;
  completedAt: Date;
}

// Game-specific types
export interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface DragDropItem {
  id: string;
  content: string;
  targetZone: string;
}

export interface DragDropZone {
  id: string;
  label: string;
}

export interface FillInBlank {
  id: string;
  text: string;
  blanks: {
    index: number;
    answer: string;
  }[];
}
