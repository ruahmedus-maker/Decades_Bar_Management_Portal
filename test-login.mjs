import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function testLogin() {
  console.log('Attempting login...');
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'admin@decadesbar.com',
    password: 'admin123'
  });
  console.log('Login result:', { data, error });
}
testLogin();
