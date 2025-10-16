import { User } from '@/types';
import { storage } from './storage';

// Define the actual sections in your application (excluding admin and non-training sections)
const ALL_SECTIONS = [
  'welcome',
  'training',
  'uniform-guide',
  'videos',
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

// Helper function to check if user should have progress tracked
const shouldTrackUserProgress = (user: User): boolean => {
  return TRACKED_POSITIONS.includes(user.position);
};

// Helper function to get unique valid sections
const getUniqueValidSections = (visitedSections: string[]): string[] => {
  const uniqueSections: string[] = [];
  visitedSections.forEach(section => {
    const isValid = ALL_SECTIONS.includes(section);
    const isExcluded = EXCLUDED_SECTIONS.includes(section);
    const isUnique = !uniqueSections.includes(section);
    
    if (isValid && !isExcluded && isUnique) {
      uniqueSections.push(section);
    }
  });
  return uniqueSections;
};

export const calculateProgress = (user: User): number => {
  // If user shouldn't be tracked, return 0
  if (!shouldTrackUserProgress(user)) {
    return 0;
  }

  const visitedSections = user.visitedSections || [];
  const uniqueSections = getUniqueValidSections(visitedSections);
  
  const uniqueVisitedCount = uniqueSections.length;
  const totalSections = ALL_SECTIONS.length;
  
  // Simple calculation: (visited / total) * 100
  const progress = Math.round((uniqueVisitedCount / totalSections) * 100);
  
  // Cap at 100%
  return Math.min(progress, 100);
};

export const trackSectionVisit = (userEmail: string, sectionId: string): void => {
  const users = storage.getUsers();
  const user = users[userEmail];

  if (!user) return;

  // Only track progress for Bartenders and Trainees
  if (!shouldTrackUserProgress(user)) {
    console.log(`Skipping progress tracking for ${user.position}: ${userEmail}`);
    user.lastActive = new Date().toISOString();
    storage.saveUsers(users);
    return;
  }

  if (!user.visitedSections) {
    user.visitedSections = [];
  }

  // Only track if it's a valid section and not excluded
  const isValid = ALL_SECTIONS.includes(sectionId);
  const isExcluded = EXCLUDED_SECTIONS.includes(sectionId);
  const notVisited = !user.visitedSections.includes(sectionId);
  
  if (isValid && !isExcluded && notVisited) {
    user.visitedSections.push(sectionId);
    console.log(`Added section: ${sectionId} to visited sections`);
  } else if (!isValid || isExcluded) {
    // If it's an excluded section, don't track but still update lastActive
    user.lastActive = new Date().toISOString();
    storage.saveUsers(users);
    return;
  }

  // Recalculate progress
  user.progress = calculateProgress(user);
  
  // AUTO-RESET: If user was acknowledged but no longer has 100% progress, reset acknowledgement
  if (user.acknowledged && user.progress < 100) {
    user.acknowledged = false;
    user.acknowledgementDate = undefined;
    console.log(`Auto-reset acknowledgement for ${userEmail} - progress dropped to ${user.progress}%`);
  }

  user.lastActive = new Date().toISOString();
  storage.saveUsers(users);
};

export const submitAcknowledgement = (userEmail: string): void => {
  const users = storage.getUsers();
  const user = users[userEmail];

  if (user) {
    // Only allow acknowledgement if progress is 100% and user is tracked
    if (user.progress === 100 && shouldTrackUserProgress(user)) {
      user.acknowledged = true;
      user.acknowledgementDate = new Date().toISOString();
      storage.saveUsers(users);
      console.log(`Acknowledgement submitted for ${userEmail}`);
    } else {
      console.warn(`Cannot acknowledge - progress is ${user.progress}% and user position is ${user.position}`);
    }
  }
};

// Helper function to get progress breakdown
export const getProgressBreakdown = (user: User) => {
  // Return empty progress for non-tracked positions
  if (!shouldTrackUserProgress(user)) {
    return {
      sectionsVisited: 0,
      totalSections: 0,
      progress: 0,
      canAcknowledge: false,
      missingSections: []
    };
  }

  const visitedSections = user.visitedSections || [];
  const uniqueSections = getUniqueValidSections(visitedSections);
  
  const uniqueVisitedCount = uniqueSections.length;
  const totalSections = ALL_SECTIONS.length;
  const progress = calculateProgress(user);
  
  // Can only acknowledge if progress is 100% AND not already acknowledged AND user is tracked
  const canAcknowledge = progress === 100 && !user.acknowledged && shouldTrackUserProgress(user);
  const missingSections = ALL_SECTIONS.filter(section => !uniqueSections.includes(section));
  
  return {
    sectionsVisited: uniqueVisitedCount,
    totalSections: totalSections,
    progress: progress,
    canAcknowledge: canAcknowledge,
    missingSections: missingSections
  };
};

// Force visit all sections for a user (for testing)
export const visitAllSections = (userEmail: string): void => {
  const users = storage.getUsers();
  const user = users[userEmail];

  if (user) {
    // Only set visited sections for tracked positions
    if (shouldTrackUserProgress(user)) {
      user.visitedSections = [...ALL_SECTIONS];
      user.progress = calculateProgress(user);
      
      // Reset acknowledgement to allow user to submit
      if (user.progress === 100) {
        user.acknowledged = false;
        user.acknowledgementDate = undefined;
      }
      
      storage.saveUsers(users);
      console.log(`Force visited all sections for ${userEmail}, progress: ${user.progress}%`);
    } else {
      console.log(`Skipping force visit for ${user.position}: ${userEmail}`);
    }
  }
};

// Reset acknowledgement for testing
export const resetAcknowledgement = (userEmail: string): void => {
  const users = storage.getUsers();
  const user = users[userEmail];

  if (user) {
    user.acknowledged = false;
    user.acknowledgementDate = undefined;
    storage.saveUsers(users);
    console.log(`Acknowledgement reset for ${userEmail}`);
  }
};

// Fix all users progress without logging them out
export const fixAllUsersProgress = (): void => {
  const users = storage.getUsers();
  Object.keys(users).forEach(email => {
    const user = users[email];
    const oldProgress = user.progress;
    user.progress = calculateProgress(user);
    
    // Auto-reset acknowledgement if progress dropped (only for tracked users)
    if (user.acknowledged && user.progress < 100 && shouldTrackUserProgress(user)) {
      user.acknowledged = false;
      user.acknowledgementDate = undefined;
      console.log(`Auto-reset acknowledgement for ${email} during fix`);
    }
    
    console.log(`Fixed progress for ${email} (${user.position}): ${oldProgress}% -> ${user.progress}%`);
  });
  storage.saveUsers(users);
};

// Reset progress for a specific user (for testing)
export const resetUserProgress = (userEmail: string): void => {
  const users = storage.getUsers();
  const user = users[userEmail];

  if (user) {
    // Only reset for tracked positions
    if (shouldTrackUserProgress(user)) {
      user.visitedSections = [];
      user.progress = 0;
      user.acknowledged = false;
      user.acknowledgementDate = undefined;
      storage.saveUsers(users);
      console.log(`Progress reset for ${userEmail}`);
    } else {
      console.log(`Skipping progress reset for ${user.position}: ${userEmail}`);
    }
  }
};

// Check if a section should be tracked for progress
export const shouldTrackSection = (sectionId: string): boolean => {
  return ALL_SECTIONS.includes(sectionId) && !EXCLUDED_SECTIONS.includes(sectionId);
};

// Check if a user should have progress tracking
export const shouldTrackUser = (user: User): boolean => {
  return shouldTrackUserProgress(user);
};