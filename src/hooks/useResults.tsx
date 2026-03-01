import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SaveResultParams {
  studentId: string;
  exerciseId: string;
  score: number;
  maxScore: number;
  timeSpent: number;
  mistakes: number;
  assignmentId?: string;
}

export function useSaveResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: SaveResultParams) => {
      let assignmentId = params.assignmentId;
      
      if (!assignmentId) {
        // For free play: find or create a dedicated "Play Mode" lesson, 
        // then create a NEW assignment per save to avoid mixing runs
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) throw new Error('Not authenticated');

        // Find existing Play Mode lesson for this teacher
        const { data: existingLesson } = await supabase
          .from('lessons')
          .select('id')
          .eq('teacher_id', user.user.id)
          .eq('title', 'Play Mode')
          .limit(1)
          .maybeSingle();

        let playLessonId: string;

        if (existingLesson) {
          playLessonId = existingLesson.id;
        } else {
          const { data: lesson, error: lessonError } = await supabase
            .from('lessons')
            .insert({ title: 'Play Mode', teacher_id: user.user.id })
            .select('id')
            .single();
          
          if (lessonError) throw lessonError;
          playLessonId = lesson.id;
        }

        // Always create a new assignment for this play session
        const { data: newAssignment, error: assignmentError } = await supabase
          .from('assignments')
          .insert({ lesson_id: playLessonId })
          .select('id')
          .single();
        
        if (assignmentError) throw assignmentError;
        assignmentId = newAssignment.id;
      }

      const { data, error } = await supabase
        .from('assignment_results')
        .insert({
          assignment_id: assignmentId,
          student_id: params.studentId,
          exercise_id: params.exerciseId,
          score: params.score,
          max_score: params.maxScore,
          time_spent: params.timeSpent,
          mistakes: params.mistakes,
          completed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['results'] });
      queryClient.invalidateQueries({ queryKey: ['student-results'] });
    },
  });
}