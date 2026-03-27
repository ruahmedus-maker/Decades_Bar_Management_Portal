-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    sender_id UUID REFERENCES auth.users(id),
    sender_name TEXT,
    recipient_role TEXT NOT NULL -- 'Admin', 'Bartender', etc.
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policies for notifications (DROP IF EXISTS to avoid errors)
DROP POLICY IF EXISTS "Admins can view all notifications" ON public.notifications;
CREATE POLICY "Admins can view all notifications"
ON public.notifications FOR SELECT
TO authenticated
USING (
  (auth.jwt() -> 'user_metadata' ->> 'position') = 'Admin'
);

DROP POLICY IF EXISTS "Anyone can insert notifications" ON public.notifications;
CREATE POLICY "Anyone can insert notifications"
ON public.notifications FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update notifications" ON public.notifications;
CREATE POLICY "Admins can update notifications"
ON public.notifications FOR UPDATE
TO authenticated
USING (
  (auth.jwt() -> 'user_metadata' ->> 'position') = 'Admin'
)
WITH CHECK (true);

-- Create test_results table if not exists
CREATE TABLE IF NOT EXISTS public.test_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    test_id TEXT NOT NULL,
    test_name TEXT NOT NULL,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    percentage INTEGER NOT NULL,
    passed BOOLEAN NOT NULL,
    answers JSONB NOT NULL,
    date TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for test_results
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;

-- Policies for test_results (DROP IF EXISTS to avoid errors)
DROP POLICY IF EXISTS "Users can view their own results" ON public.test_results;
CREATE POLICY "Users can view their own results"
ON public.test_results FOR SELECT
TO authenticated
USING (user_email = auth.jwt()->>'email');

DROP POLICY IF EXISTS "Admins can view all results" ON public.test_results;
CREATE POLICY "Admins can view all results"
ON public.test_results FOR SELECT
TO authenticated
USING (
  (auth.jwt() -> 'user_metadata' ->> 'position') = 'Admin'
);

DROP POLICY IF EXISTS "Users can insert their own results" ON public.test_results;
CREATE POLICY "Users can insert their own results"
ON public.test_results FOR INSERT
TO authenticated
WITH CHECK (user_email = auth.jwt()->>'email');
