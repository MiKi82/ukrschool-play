import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  requirement_type: string;
  requirement_value: number;
  points: number;
}

export interface StudentAchievement {
  id: string;
  student_id: string;
  achievement_id: string;
  earned_at: string;
  achievements?: Achievement;
}

export function useAchievements() {
  return useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('points', { ascending: true });

      if (error) throw error;
      return data as Achievement[];
    },
  });
}

export function useStudentAchievements(studentId: string | null) {
  return useQuery({
    queryKey: ['student-achievements', studentId],
    queryFn: async () => {
      if (!studentId) return [];

      const { data, error } = await supabase
        .from('student_achievements')
        .select(`
          *,
          achievements (*)
        `)
        .eq('student_id', studentId)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      return data as StudentAchievement[];
    },
    enabled: !!studentId,
  });
}

export function useCheckAndAwardAchievements() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      studentId, 
      score, 
      timeSpent 
    }: { 
      studentId: string; 
      score: number; 
      timeSpent: number;
    }) => {
      // Get all achievements
      const { data: achievements } = await supabase
        .from('achievements')
        .select('*');

      if (!achievements) return [];

      // Get student's current achievements
      const { data: earnedAchievements } = await supabase
        .from('student_achievements')
        .select('achievement_id')
        .eq('student_id', studentId);

      const earnedIds = new Set(earnedAchievements?.map(a => a.achievement_id) || []);

      // Get student's exercise count
      const { count: exerciseCount } = await supabase
        .from('assignment_results')
        .select('*', { count: 'exact', head: true })
        .eq('student_id', studentId);

      // Get perfect score count
      const { count: perfectCount } = await supabase
        .from('assignment_results')
        .select('*', { count: 'exact', head: true })
        .eq('student_id', studentId)
        .eq('score', 100);

      const newAchievements: Achievement[] = [];

      for (const achievement of achievements) {
        if (earnedIds.has(achievement.id)) continue;

        let earned = false;

        switch (achievement.requirement_type) {
          case 'exercises_completed':
            earned = (exerciseCount || 0) >= achievement.requirement_value;
            break;
          case 'perfect_scores':
            if (score === 100) {
              earned = ((perfectCount || 0) + 1) >= achievement.requirement_value;
            } else {
              earned = (perfectCount || 0) >= achievement.requirement_value;
            }
            break;
          case 'fast_completion':
            earned = timeSpent <= 30 && timeSpent > 0;
            break;
        }

        if (earned) {
          const { error } = await supabase
            .from('student_achievements')
            .insert({
              student_id: studentId,
              achievement_id: achievement.id,
            });

          if (!error) {
            newAchievements.push(achievement as Achievement);
          }
        }
      }

      return newAchievements;
    },
    onSuccess: (newAchievements, variables) => {
      if (newAchievements.length > 0) {
        queryClient.invalidateQueries({ queryKey: ['student-achievements', variables.studentId] });
      }
    },
  });
}
