
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://nyfvdunymeeforizgkpm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55ZnZkdW55bWVlZm9yaXpna3BtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4OTQ4NjgsImV4cCI6MjA3ODQ3MDg2OH0.ETXf1OevxLHvKQBqu_baNrRw0lm-n2YNEddjTbLXU40';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('Testing Supabase Connection...');
  
  const tables = ['users', 'special_events', 'tasks', 'maintenance_tickets', 'user_progress'];
  
  for (const table of tables) {
    try {
      console.log(`\nChecking table: ${table}...`);
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error(`❌ Error querying ${table}:`, error.message);
      } else {
        console.log(`✅ Table ${table} exists. Count: ${count}`);
      }
    } catch (e) {
      console.error(`💥 Fatal error querying ${table}:`, e.message);
    }
  }
}

testConnection();
