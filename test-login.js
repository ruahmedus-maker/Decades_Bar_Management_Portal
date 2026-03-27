const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const envStr = fs.readFileSync('.env.local', 'utf8');
const env = {};
envStr.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length) env[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '');
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testLogin() {
  console.log('Attempting login with Supabase for admin@decadesbar.com ...');
  try {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: 'admin@decadesbar.com',
      password: 'admin123'
    });
    console.log('Login result:', { user: authData?.user?.email, error });

    if (authData?.user) {
      console.log('Fetching user profile from "users" table...');
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', authData.user.id)
        .maybeSingle();
      
      console.log('Profile result:', profileData);
      console.log('Profile error:', profileError);
    }
    process.exit(0);
  } catch (err) {
    console.error('Exception thrown:', err);
    process.exit(1);
  }
}

testLogin();
