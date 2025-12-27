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
      // First, check if we have a dummy assignment for play mode, or create one
      let assignmentId = params.assignmentId;
      
      if (!assignmentId) {
        // Check for existing play-mode assignment
        const { data: existingAssignment } = await supabase
          .from('assignments')
          .select('id')
          .is('class_group_id', null)
          .is('student_profile_id', null)
          .limit(1)
          .maybeSingle();
        
        if (existingAssignment) {
          assignmentId = existingAssignment.id;
        } else {
          // Create a lesson first for play-mode results
          const { data: user } = await supabase.auth.getUser();
          if (!user.user) throw new Error('Not authenticated');
          
          const { data: lesson, error: lessonError } = await supabase
            .from('lessons')
            .insert({ title: 'Play Mode', teacher_id: user.user.id })
            .select('id')
            .single();
          
          if (lessonError) throw lessonError;
          
          // Create a play-mode assignment
          const { data: newAssignment, error: assignmentError } = await supabase
            .from('assignments')
            .insert({ lesson_id: lesson.id })
            .select('id')
            .single();
          
          if (assignmentError) throw assignmentError;
          assignmentId = newAssignment.id;
        }
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
