-- Drop existing policies to ensure a clean slate
DROP POLICY IF EXISTS "Users can insert their own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can view their own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can manage their own progress" ON public.user_progress;

-- Enable RLS
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Create a unified policy for all operations (SELECT, INSERT, UPDATE, DELETE)
-- This policy allows access if the user_id in the progress record matches a user record
-- that has the same auth_id as the currently authenticated user.
-- We cast everything to text to avoid "operator does not exist: text = uuid" errors.
CREATE POLICY "Users can manage their own progress"
ON public.user_progress
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE public.users.id::text = public.user_progress.user_id::text
    AND public.users.auth_id::text = auth.uid()::text
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE public.users.id::text = public.user_progress.user_id::text
    AND public.users.auth_id::text = auth.uid()::text
  )
);

-- Ensure users can read their own user record (required for the policy above to work)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
CREATE POLICY "Users can view their own profile"
ON public.users
FOR SELECT
TO authenticated
USING (
  auth_id::text = auth.uid()::text
);

-- Grant access
GRANT ALL ON public.user_progress TO authenticated;
GRANT SELECT ON public.users TO authenticated;
