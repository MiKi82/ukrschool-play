import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface ClassGroup {
  id: string;
  name: string;
  grade: number;
  teacher_id: string;
  created_at: string;
  updated_at: string;
}

export interface StudentProfile {
  id: string;
  nickname: string;
  avatar_emoji: string;
  photo_url: string | null;
  class_group_id: string | null;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
}

export const useClasses = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['classes', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('class_groups')
        .select('*')
        .eq('teacher_id', user.id)
        .order('grade', { ascending: true });
      
      if (error) throw error;
      return data as ClassGroup[];
    },
    enabled: !!user,
  });
};

export const useStudentsByClass = (classGroupId: string | null) => {
  return useQuery({
    queryKey: ['students', classGroupId],
    queryFn: async () => {
      if (!classGroupId) return [];
      const { data, error } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('class_group_id', classGroupId)
        .order('nickname', { ascending: true });
      
      if (error) throw error;
      return data as StudentProfile[];
    },
    enabled: !!classGroupId,
  });
};

export const useCreateClass = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ name, grade }: { name: string; grade: number }) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('class_groups')
        .insert({ name, grade, teacher_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });
};

export const useUpdateClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name, grade }: { id: string; name: string; grade: number }) => {
      const { data, error } = await supabase
        .from('class_groups')
        .update({ name, grade })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });
};

export const useDeleteClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('class_groups')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ nickname, avatarEmoji, classGroupId, photoUrl }: { nickname: string; avatarEmoji: string; classGroupId: string; photoUrl?: string }) => {
      const { data, error } = await supabase
        .from('student_profiles')
        .insert({ nickname, avatar_emoji: avatarEmoji, class_group_id: classGroupId, photo_url: photoUrl || null })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['students', variables.classGroupId] });
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      queryClient.invalidateQueries({ queryKey: ['allStudents'] });
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, nickname, avatarEmoji, classGroupId, photoUrl }: { id: string; nickname: string; avatarEmoji: string; classGroupId: string; photoUrl?: string | null }) => {
      const updateData: { nickname: string; avatar_emoji: string; photo_url?: string | null } = { 
        nickname, 
        avatar_emoji: avatarEmoji 
      };
      
      if (photoUrl !== undefined) {
        updateData.photo_url = photoUrl;
      }
      
      const { data, error } = await supabase
        .from('student_profiles')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['students', variables.classGroupId] });
      queryClient.invalidateQueries({ queryKey: ['allStudents'] });
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, classGroupId }: { id: string; classGroupId: string }) => {
      const { error } = await supabase
        .from('student_profiles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return classGroupId;
    },
    onSuccess: (classGroupId) => {
      queryClient.invalidateQueries({ queryKey: ['students', classGroupId] });
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });
};
