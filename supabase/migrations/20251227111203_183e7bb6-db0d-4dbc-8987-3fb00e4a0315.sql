-- Drop the policy we added and create a more specific one
DROP POLICY IF EXISTS "Anyone can create play mode assignments" ON public.assignments;

-- Create a policy that allows any authenticated user to insert assignments with null class_group_id
CREATE POLICY "Authenticated users can create play mode assignments"
ON public.assignments
FOR INSERT
TO authenticated
WITH CHECK (class_group_id IS NULL AND student_profile_id IS NULL);

-- Also need to allow viewing these play mode assignments
CREATE POLICY "Anyone can view play mode assignments"
ON public.assignments
FOR SELECT
USING (class_group_id IS NULL AND student_profile_id IS NULL);