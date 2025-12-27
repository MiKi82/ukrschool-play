-- Add policy to allow inserting play-mode assignments (where class_group_id is null)
CREATE POLICY "Anyone can create play mode assignments"
ON public.assignments
FOR INSERT
WITH CHECK (class_group_id IS NULL AND student_profile_id IS NULL);