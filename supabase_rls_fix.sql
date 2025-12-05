-- Enable RLS on user_progress table
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to insert their own progress
CREATE POLICY "Users can insert their own progress"
ON public.user_progress
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid()::text IN (
    SELECT auth_id::text FROM public.users WHERE id::text = user_id::text
  )
);

-- Policy to allow users to view their own progress
CREATE POLICY "Users can view their own progress"
ON public.user_progress
FOR SELECT
TO authenticated
USING (
  auth.uid()::text IN (
    SELECT auth_id::text FROM public.users WHERE id::text = user_id::text
  )
);

-- Policy to allow users to update their own progress
CREATE POLICY "Users can update their own progress"
ON public.user_progress
FOR UPDATE
TO authenticated
USING (
  auth.uid()::text IN (
    SELECT auth_id::text FROM public.users WHERE id::text = user_id::text
  )
);

-- Grant access to authenticated users
GRANT ALL ON public.user_progress TO authenticated;
