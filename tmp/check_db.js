const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim();
    }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
    console.log('Signing in as admin...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'admin@decadesbar.com',
        password: 'admin123'
    });
    
    if (authError) {
        console.error('Auth Error:', authError);
        return;
    }
    
    console.log('Querying notifications...');
    const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(5);
    
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Recent Notifications:', JSON.stringify(data, null, 2));
    }
}

run();

