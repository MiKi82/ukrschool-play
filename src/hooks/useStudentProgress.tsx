import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface StudentResult {
  id: string;
  student_id: string;
  exercise_id: string;
  assignment_id: string;
  score: number;
  max_score: number;
  time_spent: number;
  mistakes: number;
  completed_at: string;
  exercises?: {
    id: string;
    title: string;
    thumbnail_emoji: string;
    type: string;
    difficulty: string;
    subject_id: string;
    subjects?: { name: string; icon: string; color: string } | null;
  } | null;
}

export interface StudentProgress {
  totalExercises: number;
  completedExercises: number;
  averageScore: number;
  totalTimeSpent: number;
  bySubject: Record<string, {
    subjectName: string;
    subjectIcon: string;
    subjectColor: string;
    completed: number;
    averageScore: number;
    totalTime: number;
  }>;
}

export function useStudentResults(studentId: string | null) {
  return useQuery({
    queryKey: ['student-results', studentId],
    queryFn: async () => {
      if (!studentId) return [];
      
      const { data, error } = await supabase
        .from('assignment_results')
        .select(`
          *,
          exercises (
            id,
            title,
            thumbnail_emoji,
            type,
            difficulty,
            subject_id,
            subjects (name, icon, color)
          )
        `)
        .eq('student_id', studentId)
        .order('completed_at', { ascending: false });

      if (error) throw error;
      return data as StudentResult[];
    },
    enabled: !!studentId,
  });
}

export function useStudentProgress(studentId: string | null) {
  const { data: results = [], isLoading } = useStudentResults(studentId);

  const progress: StudentProgress = {
    totalExercises: 0,
    completedExercises: results.length,
    averageScore: 0,
    totalTimeSpent: 0,
    bySubject: {},
  };

  if (results.length > 0) {
    let totalScore = 0;
    
    results.forEach((result) => {
      totalScore += result.score;
      progress.totalTimeSpent += result.time_spent;
      
      const exercise = result.exercises;
      if (exercise?.subjects) {
        const subjectId = exercise.subject_id;
        if (!progress.bySubject[subjectId]) {
          progress.bySubject[subjectId] = {
            subjectName: exercise.subjects.name,
            subjectIcon: exercise.subjects.icon,
            subjectColor: exercise.subjects.color,
            completed: 0,
            averageScore: 0,
            totalTime: 0,
          };
        }
        progress.bySubject[subjectId].completed += 1;
        progress.bySubject[subjectId].averageScore += result.score;
        progress.bySubject[subjectId].totalTime += result.time_spent;
      }
    });

    progress.averageScore = Math.round(totalScore / results.length);
    
    // Calculate average per subject
    Object.keys(progress.bySubject).forEach((subjectId) => {
      const subject = progress.bySubject[subjectId];
      subject.averageScore = Math.round(subject.averageScore / subject.completed);
    });
  }

  return { progress, results, isLoading };
}

export function useAllStudents() {
  return useQuery({
    queryKey: ['all-students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_profiles')
        .select(`
          *,
          class_groups (name, grade)
        `)
        .order('nickname', { ascending: true });

      if (error) throw error;
      return data;
    },
  });
}
