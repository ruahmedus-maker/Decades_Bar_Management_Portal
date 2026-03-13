
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://nyfvdunymeeforizgkpm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55ZnZkdW55bWVlZm9yaXpna3BtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4OTQ4NjgsImV4cCI6MjA3ODQ3MDg2OH0.ETXf1OevxLHvKQBqu_baNrRw0lm-n2YNEddjTbLXU40';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function loadAllDataSim() {
  console.log('🚀 Simulating Admin Panel Data Load...');
  
  try {
    console.log('1. Loading users...');
    const { data: allUsers, error: usersError } = await supabase
      .from('users')
      .select('*')
      .order('name');
    
    if (usersError) throw usersError;
    console.log(`✅ Loaded ${allUsers.length} users.`);

    const bartendersAndTrainees = allUsers.filter(user => 
      user.position === 'Bartender' || user.position === 'Trainee'
    );
    console.log(`Filtering for Bartenders/Trainees: ${bartendersAndTrainees.length}`);

    console.log('2. Loading progress for each user...');
    const progressData = await Promise.all(
      bartendersAndTrainees.map(async (user) => {
        console.log(`   - Fetching progress for ${user.email}...`);
        
        // Simulating getProgressBreakdown
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, position, acknowledged, acknowledgement_date, progress')
          .eq('email', user.email)
          .single();
        if (userError) throw userError;

        const { data: userProgress, error: progressError } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', userData.id);
        if (progressError) throw progressError;
        
        console.log(`     ✅ Progress records for ${user.email}: ${userProgress.length}`);
        return { user, progress: userProgress };
      })
    );
    console.log('✅ Finished loading progress data.');

    console.log('3. Loading maintenance tickets...');
    const { data: maintenanceTickets, error: mtError } = await supabase
      .from('maintenance_tickets')
      .select('status');
    if (mtError) throw mtError;
    console.log(`✅ Loaded ${maintenanceTickets.length} tickets.`);

    console.log('4. Loading tasks...');
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('completed');
    if (tasksError) throw tasksError;
    console.log(`✅ Loaded ${tasks.length} tasks.`);

    console.log('🏁 DATA LOAD SIMULATION COMPLETE');

  } catch (error) {
    console.error('💥 ERROR DURING SIMULATION:', error);
  }
}

loadAllDataSim();
