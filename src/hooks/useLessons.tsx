import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface LessonExercise {
  id: string;
  lesson_id: string;
  exercise_id: string;
  order_index: number;
  exercise?: {
    id: string;
    title: string;
    thumbnail_emoji: string;
    type: string;
    difficulty: string;
    estimated_time: number;
  } | null;
}

export interface Assignment {
  id: string;
  lesson_id: string;
  class_group_id: string | null;
  student_profile_id: string | null;
  due_date: string | null;
  created_at: string;
  class_group?: {
    id: string;
    name: string;
    grade: number;
  } | null;
}

export interface Lesson {
  id: string;
  title: string;
  teacher_id: string;
  created_at: string;
  updated_at: string;
  lesson_exercises: LessonExercise[];
  assignments: Assignment[];
}

export function useLessons() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['lessons', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('lessons')
        .select(`
          *,
          lesson_exercises (
            id,
            lesson_id,
            exercise_id,
            order_index,
            exercise:exercises (
              id,
              title,
              thumbnail_emoji,
              type,
              difficulty,
              estimated_time
            )
          ),
          assignments (
            id,
            lesson_id,
            class_group_id,
            student_profile_id,
            due_date,
            created_at,
            class_group:class_groups (
              id,
              name,
              grade
            )
          )
        `)
        .eq('teacher_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our types
      return (data || []).map(lesson => ({
        ...lesson,
        lesson_exercises: lesson.lesson_exercises || [],
        assignments: lesson.assignments || [],
      })) as Lesson[];
    },
    enabled: !!user?.id,
  });
}

export function useDeleteLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lessonId: string) => {
      // Delete lesson exercises first
      await supabase.from('lesson_exercises').delete().eq('lesson_id', lessonId);
      
      // Delete assignments
      await supabase.from('assignments').delete().eq('lesson_id', lessonId);
      
      // Delete lesson
      const { error } = await supabase.from('lessons').delete().eq('id', lessonId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
  });
}
