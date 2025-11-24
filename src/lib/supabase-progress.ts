// lib/supabase-progress.ts - UPDATED FOR NEW TABLE STRUCTURE
import { supabase } from './supabase';

// Define the actual sections that match your training content
const SECTION_CONFIG = [
  { id: 'welcome', label: 'Welcome & Introduction', timeRequired: 60 },
  { id: 'training', label: 'Training Program', timeRequired: 60 },
  { id: 'uniform-guide', label: 'Uniform Guide', timeRequired: 60 },
  { id: 'social-media', label: 'Social Media Policy', timeRequired: 60 },
  { id: 'resources', label: 'Resources', timeRequired: 60 },
  { id: 'procedures', label: 'Procedures', timeRequired: 60 },
  { id: 'policies', label: 'Policies', timeRequired: 60 },
  { id: 'glassware-guide', label: 'Glassware Guide', timeRequired: 60 },
  { id: 'faq', label: 'FAQ', timeRequired: 60 },
  { id: 'drinks-specials', label: 'Drinks & Specials', timeRequired: 60 },
  { id: 'comps-voids', label: 'Comps & Voids', timeRequired: 60 },
  { id: 'cocktails', label: 'Cocktails', timeRequired: 60 },
  { id: 'aloha-pos', label: 'Aloha POS System', timeRequired: 60 },
  { id: 'bar-cleanings', label: 'Bar Cleaning Procedures', timeRequired: 60 }
];

const TRACKED_POSITIONS = ['Bartender', 'Trainee'];

export const supabaseProgress = {
  // Track when user visits a section - USES user_progress TABLE
  async trackSectionVisit(userEmail: string, sectionId: string, timeSpent: number = 30): Promise<void> {
    try {
      // First get the user ID from email
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, auth_id')
        .eq('email', userEmail)
        .single();

      if (userError) throw userError;
      if (!userData) throw new Error('User not found');

      // Get existing progress for this section from user_progress table
      const { data: existingProgress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userData.id)
        .eq('section_id', sectionId)
        .single();

      const newTimeSpent = (existingProgress?.time_spent || 0) + timeSpent;
      
      // Get time required from SECTION_CONFIG
      const sectionConfig = SECTION_CONFIG.find(s => s.id === sectionId);
      const timeRequired = sectionConfig?.timeRequired || 60;
      const completed = newTimeSpent >= timeRequired;

      // Upsert the progress into user_progress table
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userData.id,
          section_id: sectionId,
          time_spent: newTimeSpent,
          completed: completed,
          last_visit: new Date().toISOString(),
          first_visit: existingProgress?.first_visit || new Date().toISOString()
        });

      if (error) throw error;
      
      console.log(`📊 Progress tracked: ${sectionId} - ${newTimeSpent}s/${timeRequired}s`);
    } catch (error) {
      console.error('Error tracking section visit:', error);
      throw error;
    }
  },

  // Get progress breakdown for a user - USES user_progress TABLE
  async getProgressBreakdown(userEmail: string) {
    try {
      // Get user's data including position
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, position, acknowledged')
        .eq('email', userEmail)
        .single();

      if (userError) throw userError;

      // Get user's progress from user_progress table
      const { data: userProgress, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userData.id);

      if (progressError) throw progressError;

      // Calculate progress details based on SECTION_CONFIG
      const sectionDetails = SECTION_CONFIG.map(section => {
        const userSection = userProgress?.find(p => p.section_id === section.id);
        const timeSpent = userSection?.time_spent || 0;
        const completed = timeSpent >= section.timeRequired;
        const progress = Math.min(100, Math.round((timeSpent / section.timeRequired) * 100));
        
        return {
          id: section.id,
          label: section.label,
          completed,
          timeSpent,
          timeRequired: section.timeRequired,
          progress
        };
      });

      const completedSections = sectionDetails.filter(s => s.completed).length;
      const totalSections = sectionDetails.length;
      const overallProgress = totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0;
      
      // User can acknowledge if all sections are completed AND they haven't already acknowledged
      const canAcknowledge = overallProgress === 100 && !userData.acknowledged;

      console.log(`📈 Progress calculated: ${overallProgress}% - ${completedSections}/${totalSections} sections`);

      return {
        progress: overallProgress,
        canAcknowledge,
        sectionDetails,
        sectionsVisited: userProgress?.length || 0,
        totalSections: SECTION_CONFIG.length,
        isTracked: TRACKED_POSITIONS.includes(userData.position)
      };
    } catch (error) {
      console.error('Error getting progress breakdown:', error);
      // Return empty progress on error
      return {
        progress: 0,
        canAcknowledge: false,
        sectionDetails: [],
        sectionsVisited: 0,
        totalSections: SECTION_CONFIG.length,
        isTracked: false
      };
    }
  },

  // Submit acknowledgement - USES users TABLE
  async submitAcknowledgement(userEmail: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          acknowledged: true,
          acknowledgement_date: new Date().toISOString()
        })
        .eq('email', userEmail);

      if (error) throw error;
      
      console.log(`✅ Acknowledgement submitted for: ${userEmail}`);
    } catch (error) {
      console.error('Error submitting acknowledgement:', error);
      throw error;
    }
  },

  // Real-time subscription for progress updates - USES user_progress TABLE
  // lib/supabase-progress.ts - CORRECTED real-time subscription
subscribeToUserProgress(userEmail: string, callback: (progress: any) => void) {
  console.log(`🔔 Setting up real-time subscription for: ${userEmail}`);
  
  const subscription = supabase
    .channel('progress-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'user_progress'
      },
      async (payload) => {
        try {
          // Safe access to payload.new with type checking
          if (payload.new && typeof payload.new === 'object' && 'id' in payload.new) {
            const progressRecord = payload.new as { id: string; user_id: string };
            
            const { data: user } = await supabase
              .from('users')
              .select('email')
              .eq('id', progressRecord.user_id)
              .single();

            if (user && user.email === userEmail) {
              console.log('🔄 Real-time progress update for current user');
              const progress = await this.getProgressBreakdown(userEmail);
              callback(progress);
            }
          }
        } catch (error) {
          console.error('Error processing real-time update:', error);
        }
      }
    )
    .subscribe();

  return {
    unsubscribe: () => {
      console.log('🔕 Unsubscribing from progress updates');
      supabase.removeChannel(subscription);
    }
  };
},

  // Force complete a section (for debugging) - USES user_progress TABLE
  async forceCompleteSection(userEmail: string, sectionId: string): Promise<void> {
    try {
      // First get user ID
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('email', userEmail)
        .single();

      if (!userData) throw new Error('User not found');

      const sectionConfig = SECTION_CONFIG.find(s => s.id === sectionId);
      const timeRequired = sectionConfig?.timeRequired || 60;

      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userData.id,
          section_id: sectionId,
          time_spent: timeRequired,
          completed: true,
          last_visit: new Date().toISOString()
        });

      if (error) throw error;
      
      console.log(`⚡ Section force completed: ${sectionId}`);
    } catch (error) {
      console.error('Error forcing section completion:', error);
      throw error;
    }
  }
};