import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SaveResultParams {
  assignmentId?: string;
  studentId: string;
  exerciseId: string;
  score: number;
  maxScore: number;
  timeSpent: number;
  mistakes: number;
}

export function useSaveResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: SaveResultParams) => {
      // For now, we'll insert results without assignment_id since we don't have assignments set up yet
      // This allows tracking progress even in demo/play mode
      const { data, error } = await supabase
        .from('assignment_results')
        .upsert({
          assignment_id: params.assignmentId || '00000000-0000-0000-0000-000000000000',
          student_id: params.studentId,
          exercise_id: params.exerciseId,
          score: params.score,
          max_score: params.maxScore,
          time_spent: params.timeSpent,
          mistakes: params.mistakes,
          completed_at: new Date().toISOString(),
        }, {
          onConflict: 'assignment_id,student_id,exercise_id'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['results'] });
    },
  });
}
