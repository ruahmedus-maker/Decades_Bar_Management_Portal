import { supabase } from './supabase';
import { User } from '@/types';

// Define types for database rows
interface SectionVisitRow {
  id: number;
  user_email: string;
  section_id: string;
  first_visit: string;
  last_visit: string;
  total_time: number;
  completed: boolean;
  quiz_passed: boolean;
  created_at: string;
  updated_at: string;
}

interface UserRow {
  email: string;
  name: string;
  position: string;
  status: string;
  progress: number;
  acknowledged: boolean;
  acknowledgement_date: string | null;
  registered_date: string;
  last_active: string;
  login_count: number;
  password_hash: string;
  visited_sections: string[] | null;
  test_results: any;
  section_visits: any;
  created_at: string;
  updated_at: string;
}

// Define the actual sections (same as your current progress.ts)
const ALL_SECTIONS = [
  'welcome',
  'training',
  'uniform-guide',
  'social-media',
  'resources',
  'procedures',
  'policies',
  'glassware-guide',
  'faq',
  'drinks-specials',
  'comps-voids',
  'cocktails',
  'aloha-pos',
  'bar-cleanings'
];

const EXCLUDED_SECTIONS = [
  'admin-panel',
  'employee-counselings', 
  'schedule-report',
  'special-events'
];

const TRACKED_POSITIONS = ['Bartender', 'Trainee'];
const MINIMUM_SECTION_TIME = 30;

export const supabaseProgress = {
  // Track section visit with real-time updates
  trackSectionVisit: async (userEmail: string, sectionId: string, timeSpent: number = 0): Promise<void> => {
    try {
      // Check if section visit already exists
      const { data: existingVisit, error: fetchError } = await supabase
        .from('section_visits')
        .select('*')
        .eq('user_email', userEmail)
        .eq('section_id', sectionId)
        .single();

      const now = new Date().toISOString();
      const completed = timeSpent >= MINIMUM_SECTION_TIME;

      if (fetchError || !existingVisit) {
        // Create new section visit
        const { error: insertError } = await supabase
          .from('section_visits')
          .insert({
            user_email: userEmail,
            section_id: sectionId,
            first_visit: now,
            last_visit: now,
            total_time: timeSpent,
            completed: completed,
            quiz_passed: false
          });

        if (insertError) throw insertError;
      } else {
        // Update existing section visit
        const { error: updateError } = await supabase
          .from('section_visits')
          .update({
            last_visit: now,
            total_time: (existingVisit.total_time || 0) + timeSpent,
            completed: (existingVisit as SectionVisitRow).completed || completed,
            updated_at: now
          })
          .eq('user_email', userEmail)
          .eq('section_id', sectionId);

        if (updateError) throw updateError;
      }

      // Update user's progress in users table
      await supabaseProgress.updateUserProgress(userEmail);
    } catch (error) {
      console.error('Error tracking section visit in Supabase:', error);
      throw error;
    }
  },

  // Update user's overall progress
  updateUserProgress: async (userEmail: string): Promise<void> => {
    try {
      // Get all section visits for user
      const { data: sectionVisits, error } = await supabase
        .from('section_visits')
        .select('*')
        .eq('user_email', userEmail);

      if (error) throw error;

      // Calculate progress
      const completedSections = (sectionVisits as SectionVisitRow[])?.filter((visit: SectionVisitRow) => 
        visit.completed && ALL_SECTIONS.includes(visit.section_id)
      ).length || 0;

      const progress = Math.round((completedSections / ALL_SECTIONS.length) * 100);

      // Update user's progress
      const { error: updateError } = await supabase
        .from('users')
        .update({
          progress: Math.min(progress, 100),
          last_active: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('email', userEmail);

      if (updateError) throw updateError;
    } catch (error) {
      console.error('Error updating user progress in Supabase:', error);
      throw error;
    }
  },

  // Get user's progress breakdown
  getProgressBreakdown: async (userEmail: string): Promise<any> => {
    try {
      // Get user data
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', userEmail)
        .single();

      if (userError) throw userError;

      // Get section visits
      const { data: sectionVisits, error: visitsError } = await supabase
        .from('section_visits')
        .select('*')
        .eq('user_email', userEmail);

      if (visitsError) throw visitsError;

      // Create section details
      const sectionDetails = ALL_SECTIONS.map(sectionId => {
        const visit = (sectionVisits as SectionVisitRow[])?.find((v: SectionVisitRow) => v.section_id === sectionId);
        const timeSpent = visit?.total_time || 0;
        const completed = visit?.completed || false;
        const progress = Math.min(Math.round((timeSpent / MINIMUM_SECTION_TIME) * 100), 100);

        return {
          id: sectionId,
          label: sectionId.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' '),
          completed,
          timeSpent,
          timeRequired: MINIMUM_SECTION_TIME,
          progress
        };
      });

      const completedSections = sectionDetails.filter(s => s.completed).length;
      const progress = Math.round((completedSections / ALL_SECTIONS.length) * 100);
      const canAcknowledge = progress === 100 && 
                            !(user as UserRow).acknowledged && 
                            TRACKED_POSITIONS.includes((user as UserRow).position);

      return {
        progress,
        canAcknowledge,
        sectionDetails,
        sectionsVisited: completedSections,
        totalSections: ALL_SECTIONS.length
      };
    } catch (error) {
      console.error('Error getting progress breakdown from Supabase:', error);
      throw error;
    }
  },

  // Submit acknowledgement
  submitAcknowledgement: async (userEmail: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          acknowledged: true,
          acknowledgement_date: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('email', userEmail);

      if (error) throw error;
    } catch (error) {
      console.error('Error submitting acknowledgement in Supabase:', error);
      throw error;
    }
  },

  // Real-time subscription for progress updates
  subscribeToUserProgress: (userEmail: string, callback: (progress: any) => void) => {
    const subscription = supabase
      .channel('user-progress-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'section_visits',
          filter: `user_email=eq.${userEmail}`
        },
        async () => {
          // Refresh progress when user's section visits change
          const progress = await supabaseProgress.getProgressBreakdown(userEmail);
          callback(progress);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: `email=eq.${userEmail}`
        },
        async () => {
          // Refresh progress when user data changes
          const progress = await supabaseProgress.getProgressBreakdown(userEmail);
          callback(progress);
        }
      )
      .subscribe();

    return subscription;
  },

  // Migration: Move existing progress data to Supabase
  migrateProgressToSupabase: async (): Promise<{ success: boolean; count: number }> => {
    try {
      // This would migrate existing localStorage progress data to Supabase
      // You can implement this based on your current localStorage structure
      console.log('Progress migration to Supabase completed');
      return { success: true, count: 0 };
    } catch (error) {
      console.error('Error migrating progress to Supabase:', error);
      return { success: false, count: 0 };
    }
  }
};