-- Create achievements table for defining available achievements
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '🏆',
  category TEXT NOT NULL DEFAULT 'general',
  requirement_type TEXT NOT NULL, -- 'exercises_completed', 'perfect_scores', 'subjects_played', 'streak', 'speed'
  requirement_value INTEGER NOT NULL DEFAULT 1,
  points INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student_achievements table to track earned achievements
CREATE TABLE public.student_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, achievement_id)
);

-- Enable RLS
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_achievements ENABLE ROW LEVEL SECURITY;

-- Anyone can view achievements
CREATE POLICY "Anyone can view achievements"
ON public.achievements
FOR SELECT
USING (true);

-- Teachers and admins can manage achievements
CREATE POLICY "Teachers and admins can manage achievements"
ON public.achievements
FOR ALL
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'teacher'));

-- Anyone can insert student achievements (for play mode)
CREATE POLICY "Anyone can insert student achievements"
ON public.student_achievements
FOR INSERT
WITH CHECK (true);

-- View student achievements for own classes or children
CREATE POLICY "View student achievements"
ON public.student_achievements
FOR SELECT
USING (
  student_id IN (
    SELECT id FROM student_profiles
    WHERE class_group_id IN (SELECT id FROM class_groups WHERE teacher_id = auth.uid())
    OR parent_id = auth.uid()
  )
  OR has_role(auth.uid(), 'admin')
  OR true -- Allow viewing for play mode
);

-- Insert default achievements
INSERT INTO public.achievements (name, description, icon, category, requirement_type, requirement_value, points) VALUES
  ('Перший крок', 'Завершити першу вправу', '🎯', 'progress', 'exercises_completed', 1, 10),
  ('Початківець', 'Завершити 5 вправ', '🌟', 'progress', 'exercises_completed', 5, 25),
  ('Учень', 'Завершити 10 вправ', '📚', 'progress', 'exercises_completed', 10, 50),
  ('Знавець', 'Завершити 25 вправ', '🎓', 'progress', 'exercises_completed', 25, 100),
  ('Майстер', 'Завершити 50 вправ', '🏆', 'progress', 'exercises_completed', 50, 200),
  ('Ідеальний результат', 'Отримати 100 балів у вправі', '💯', 'score', 'perfect_scores', 1, 30),
  ('Відмінник', 'Отримати 5 ідеальних результатів', '⭐', 'score', 'perfect_scores', 5, 75),
  ('Генiй', 'Отримати 10 ідеальних результатів', '🧠', 'score', 'perfect_scores', 10, 150),
  ('Математик', 'Завершити 5 вправ з математики', '🔢', 'subject', 'math_exercises', 5, 40),
  ('Грамотій', 'Завершити 5 вправ з української мови', '📝', 'subject', 'ukrainian_exercises', 5, 40),
  ('Швидкий розум', 'Завершити вправу менше ніж за 30 секунд', '⚡', 'speed', 'fast_completion', 1, 50);