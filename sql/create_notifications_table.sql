-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL, -- e.g., 'checkout_request'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  sender_id UUID REFERENCES users(id),
  sender_name TEXT, -- Denormalized for display
  recipient_role TEXT, -- e.g., 'Admin', 'Manager', or specific user_id
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON TABLE notifications TO authenticated;
GRANT ALL ON TABLE notifications TO service_role;

-- Policies

-- 1. Anyone can insert a notification (e.g. Bartenders requesting checkout)
CREATE POLICY "Anyone can create notifications"
ON notifications
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 2. Admins can view all notifications intended for them or 'Admin' role
CREATE POLICY "Admins can view notifications"
ON notifications
FOR SELECT
TO authenticated
USING (
  is_admin() OR 
  recipient_role = 'Admin' OR -- If we target role
  recipient_role = 'Manager'
);

-- 3. Admins can update (mark as read)
CREATE POLICY "Admins can update notifications"
ON notifications
FOR UPDATE
TO authenticated
USING ( is_admin() );

-- Enable Realtime for this table
-- Note: This usually requires enabling replication in the dashboard, 
-- but we can try to set the replica identity here if supported, 
-- or rely on the user enabling it in the Supabase UI "Database > Replication".
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
