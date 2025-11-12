import { createClient } from '@supabase/supabase-js'

// Safe initialization that works during build
let supabase: any = null;

if (typeof window !== 'undefined') {
  // Client-side: Initialize normally
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } else {
    console.warn('Supabase environment variables are not set');
  }
} else {
  // Server-side: Create a mock client that won't break the build
  supabase = {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') })
        }),
        insert: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        update: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        upsert: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') })
      })
    })
  };
}

export { supabase };