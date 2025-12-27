-- First, let's check and fix the restrictive policies by recreating them as permissive
-- Drop restrictive policies and recreate as permissive

-- Drop existing restrictive policies on assignments
DROP POLICY IF EXISTS "Teachers can manage assignments" ON public.assignments;
DROP POLICY IF EXISTS "View assignments for own classes or students" ON public.assignments;
DROP POLICY IF EXISTS "Authenticated users can create play mode assignments" ON public.assignments;
DROP POLICY IF EXISTS "Anyone can view play mode assignments" ON public.assignments;

-- Recreate as PERMISSIVE policies (default)
-- Teachers can manage their class assignments
CREATE POLICY "Teachers can manage class assignments"
ON public.assignments
FOR ALL
USING (
  (class_group_id IN (SELECT id FROM class_groups WHERE teacher_id = auth.uid()))
  OR has_role(auth.uid(), 'admin')
);

-- View assignments policy for parents
CREATE POLICY "Parents can view student assignments"
ON public.assignments
FOR SELECT
USING (
  student_profile_id IN (SELECT id FROM student_profiles WHERE parent_id = auth.uid())
);

-- Play mode assignments (null class_group_id and student_profile_id)
CREATE POLICY "Users can create play mode assignments"
ON public.assignments
FOR INSERT
WITH CHECK (class_group_id IS NULL AND student_profile_id IS NULL);

CREATE POLICY "Users can view play mode assignments"
ON public.assignments
FOR SELECT
USING (class_group_id IS NULL AND student_profile_id IS NULL);