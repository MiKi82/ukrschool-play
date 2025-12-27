import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DbExercise {
  id: string;
  title: string;
  description: string | null;
  type: 'MATCHING' | 'DRAG_DROP' | 'CROSSWORD' | 'REBUS' | 'QUIZ' | 'FILL_IN' | 'EXTERNAL_LINK';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  subject_id: string;
  topic_id: string | null;
  grade_number: number;
  content_json: Record<string, unknown>;
  external_url: string | null;
  thumbnail_emoji: string;
  estimated_time: number;
  created_at: string;
  updated_at: string;
  subjects?: { name: string; icon: string; color: string } | null;
  topics?: { name: string; icon: string } | null;
}

export function useExercises(filters?: { subjectId?: string; gradeNumber?: number; topicId?: string }) {
  return useQuery({
    queryKey: ['exercises', filters],
    queryFn: async () => {
      let query = supabase
        .from('exercises')
        .select(`
          *,
          subjects (name, icon, color),
          topics (name, icon)
        `)
        .order('created_at', { ascending: false });

      if (filters?.subjectId) {
        query = query.eq('subject_id', filters.subjectId);
      }
      if (filters?.gradeNumber) {
        query = query.eq('grade_number', filters.gradeNumber);
      }
      if (filters?.topicId) {
        query = query.eq('topic_id', filters.topicId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as DbExercise[];
    },
  });
}

export function useExercise(id: string) {
  return useQuery({
    queryKey: ['exercise', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('exercises')
        .select(`
          *,
          subjects (name, icon, color),
          topics (name, icon)
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as DbExercise | null;
    },
    enabled: !!id,
  });
}

export function useSubjects() {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name');

      if (error) throw error;
      return data;
    },
  });
}

export function useTopics(subjectId?: string, gradeNumber?: number) {
  return useQuery({
    queryKey: ['topics', subjectId, gradeNumber],
    queryFn: async () => {
      let query = supabase.from('topics').select('*').order('name');

      if (subjectId) {
        query = query.eq('subject_id', subjectId);
      }
      if (gradeNumber) {
        query = query.eq('grade_number', gradeNumber);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}
