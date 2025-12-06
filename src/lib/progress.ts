// lib/progress.ts - COMPLETELY REWRITTEN FOR SUPABASE
import { User } from '@/types';
import { supabaseProgress } from './supabase-progress';

// Define the actual sections in your application (excluding admin and non-training sections)
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

// Sections that should NOT be tracked for progress
const EXCLUDED_SECTIONS = [
  'admin-panel',
  'employee-counselings',
  'schedule-report',
  'special-events'
];

// Positions that should have progress tracking
const TRACKED_POSITIONS = ['Bartender', 'Trainee'];

// Positions that should NOT have progress tracking
const NON_TRACKED_POSITIONS = ['Admin', 'Manager', 'Owner'];

// Minimum time required in each section (in seconds)
const MINIMUM_SECTION_TIME = 30;

// Helper function to check if user should have progress tracked
export const shouldTrackUserProgress = (user: User): boolean => {
  return TRACKED_POSITIONS.includes(user.position);
};

// NEW: Calculate progress from Supabase data
export const calculateProgress = async (userEmail: string): Promise<number> => {
  try {
    const progressData = await supabaseProgress.getProgressBreakdown(userEmail);
    return progressData.progress || 0;
  } catch (error) {
    console.error('Error calculating progress:', error);
    return 0;
  }
};

// NEW: Track section visit using Supabase
export const trackSectionVisit = async (userEmail: string, sectionId: string, timeSpent: number = 0): Promise<void> => {
  try {
    await supabaseProgress.trackSectionVisit(userEmail, sectionId, timeSpent);
  } catch (error) {
    console.error('Error tracking section visit:', error);
    throw error;
  }
};

// NEW: Get progress breakdown from Supabase
export const getProgressBreakdown = async (userEmail: string): Promise<{
  progress: number;
  canAcknowledge: boolean;
  sectionDetails: Array<{
    id: string;
    label: string;
    completed: boolean;
    timeSpent: number;
    timeRequired: number;
    progress: number;
  }>;
  sectionsVisited: number;
  totalSections: number;
  isTracked?: boolean;
  acknowledged?: boolean;
  acknowledgementDate?: string | null;
}> => {
  try {
    return await supabaseProgress.getProgressBreakdown(userEmail);
  } catch (error) {
    console.error('Error getting progress breakdown:', error);
    return {
      progress: 0,
      canAcknowledge: false,
      sectionDetails: [],
      sectionsVisited: 0,
      totalSections: ALL_SECTIONS.length,
      isTracked: false
    };
  }
};

// NEW: Submit acknowledgement using Supabase
export const submitAcknowledgement = async (userEmail: string): Promise<void> => {
  try {
    await supabaseProgress.submitAcknowledgement(userEmail);
  } catch (error) {
    console.error('Error submitting acknowledgement:', error);
    throw error;
  }
};

// NEW: Get section completion details
export const getSectionCompletionDetails = async (userEmail: string, sectionId: string): Promise<{
  completed: boolean;
  timeSpent: number;
  timeRequired: number;
  progress: number;
}> => {
  try {
    const progress = await getProgressBreakdown(userEmail);
    const sectionDetail = progress.sectionDetails.find(s => s.id === sectionId);

    if (sectionDetail) {
      return {
        completed: sectionDetail.completed,
        timeSpent: sectionDetail.timeSpent,
        timeRequired: MINIMUM_SECTION_TIME,
        progress: sectionDetail.progress
      };
    }

    return {
      completed: false,
      timeSpent: 0,
      timeRequired: MINIMUM_SECTION_TIME,
      progress: 0
    };
  } catch (error) {
    console.error('Error getting section completion details:', error);
    return {
      completed: false,
      timeSpent: 0,
      timeRequired: MINIMUM_SECTION_TIME,
      progress: 0
    };
  }
};

// NEW: Simple quiz submission
export const submitSectionQuiz = async (userEmail: string, sectionId: string, score: number): Promise<boolean> => {
  try {
    // For now, we'll just mark the section as completed if quiz is passed
    // You can enhance this later with proper quiz tracking in Supabase
    if (score >= 0.7) {
      await trackSectionVisit(userEmail, sectionId, MINIMUM_SECTION_TIME);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error submitting section quiz:', error);
    return false;
  }
};

// NEW: Check if a section should be tracked for progress
export const shouldTrackSection = (sectionId: string): boolean => {
  return ALL_SECTIONS.includes(sectionId) && !EXCLUDED_SECTIONS.includes(sectionId);
};

// NEW: Check if a user should have progress tracking
export const shouldTrackUser = (user: User): boolean => {
  return shouldTrackUserProgress(user);
};

// NEW: Export the non-tracked positions for use in other files
export const getNonTrackedPositions = (): string[] => {
  return [...NON_TRACKED_POSITIONS];
};

// NEW: Export the tracked positions for use in other files
export const getTrackedPositions = (): string[] => {
  return [...TRACKED_POSITIONS];
};

// NEW: Get all completed sections for a user
export const getCompletedSections = async (userEmail: string): Promise<string[]> => {
  try {
    const progress = await getProgressBreakdown(userEmail);
    return progress.sectionDetails
      .filter(section => section.completed)
      .map(section => section.id);
  } catch (error) {
    console.error('Error getting completed sections:', error);
    return [];
  }
};

// NEW: Check if a specific section is completed
export const isSectionCompleted = async (userEmail: string, sectionId: string): Promise<boolean> => {
  try {
    const progress = await getProgressBreakdown(userEmail);
    const section = progress.sectionDetails.find(s => s.id === sectionId);
    return section?.completed || false;
  } catch (error) {
    console.error('Error checking section completion:', error);
    return false;
  }
};

// NEW: Reset user progress (for testing)
export const resetUserProgress = async (userEmail: string): Promise<void> => {
  try {
    // This would require a more complex implementation in Supabase
    // For now, we'll just log it
    console.log(`Progress reset requested for ${userEmail}`);
  } catch (error) {
    console.error('Error resetting user progress:', error);
    throw error;
  }
};

// NEW: Real-time subscription for progress updates
export const subscribeToProgress = (userEmail: string, callback: (progress: any) => void) => {
  return supabaseProgress.subscribeToUserProgress(userEmail, callback);
};

// Export constants for use in other files
export {
  ALL_SECTIONS,
  EXCLUDED_SECTIONS,
  TRACKED_POSITIONS,
  NON_TRACKED_POSITIONS,
  MINIMUM_SECTION_TIME
};