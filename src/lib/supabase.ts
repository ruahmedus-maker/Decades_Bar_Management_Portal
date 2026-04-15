// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Custom fetch with timeout and logging to prevent silent hangs
const customFetch = async (url: RequestInfo | URL, options?: RequestInit) => {
  const urlString = url.toString();
  console.log(`📡 [Supabase Fetch] -> ${urlString}`);
  
  // Create an AbortController for adding a strict timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout
  
  try {
    // Merge the abort signal (if options.signal exists, this won't perfectly merge, 
    // but typically Supabase doesn't pass one on standard auth requests)
    const fetchOptions: RequestInit = {
      ...options,
      signal: options?.signal || controller.signal,
      headers: {
        ...options?.headers,
        // Optional: Force no-cache to bypass stuck caches temporarily
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    };
    
    // Attempt the fetch
    const response = await fetch(url, fetchOptions);
    console.log(`✅ [Supabase Fetch] <- [${response.status}] ${urlString}`);
    
    return response;
  } catch (error: any) {
    console.error(`❌ [Supabase Fetch] FAILED ${urlString} - ${error.name}: ${error.message}`);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

// Regular client for client-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: customFetch
  },
  auth: {
    storageKey: 'decades-bar-auth-v2', // Change key to bypass corrupted storage
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})