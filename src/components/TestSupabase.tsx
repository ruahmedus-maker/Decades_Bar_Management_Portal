// components/TestSupabase.tsx
'use client';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestSupabase() {
  useEffect(() => {
    const testConnection = async () => {
      try {
        const { data, error } = await supabase
          .from('maintenance_tickets')
          .select('*')
          .limit(1);
        
        if (error) {
          console.error('Supabase error:', error);
        } else {
          console.log('Supabase connected successfully, data:', data);
        }
      } catch (err) {
        console.error('Connection test failed:', err);
      }
    };

    testConnection();
  }, []);

  return null;
}