import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a single supabase client for both client and server
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', // Provide a fallback URL
  supabaseAnonKey || 'placeholder-anon-key' // Provide a fallback key
);

// Optional: Add error handling for missing env vars in development
if (typeof window !== 'undefined' && (!supabaseUrl || !supabaseAnonKey)) {
  console.warn('Supabase environment variables are not properly set');
}