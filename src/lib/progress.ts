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
    // Only allow acknowledgement if progress is 100%
    if (user.progress === 100) {
      user.acknowledged = true;
      user.acknowledgementDate = new Date().toISOString();
      storage.saveUsers(users);
      console.log(`Acknowledgement submitted for ${userEmail}`);
    } else {
      console.warn(`Cannot acknowledge - progress is only ${user.progress}%`);
    }
  }
};

// Helper function to get progress breakdown
export const getProgressBreakdown = (user: User) => {
  const visitedSections = user.visitedSections || [];
  const uniqueSections = getUniqueValidSections(visitedSections);
  
  const uniqueVisitedCount = uniqueSections.length;
  const totalSections = ALL_SECTIONS.length;
  const progress = calculateProgress(user);
  
  // Can only acknowledge if progress is 100% AND not already acknowledged
  const canAcknowledge = progress === 100 && !user.acknowledged;
  const missingSections = ALL_SECTIONS.filter(section => !uniqueSections.includes(section));
  
  return {
    sectionsVisited: uniqueVisitedCount,
    totalSections: totalSections,
    progress: progress,
    canAcknowledge: canAcknowledge,
    missingSections: missingSections
  };
};

// NEW: Force visit all sections for a user (for testing)
export const visitAllSections = (userEmail: string): void => {
  const users = storage.getUsers();
  const user = users[userEmail];

  if (user) {
    user.visitedSections = [...ALL_SECTIONS];
    user.progress = calculateProgress(user);
    
    // If progress is 100%, allow acknowledgement
    if (user.progress === 100 && !user.acknowledged) {
      user.acknowledged = false; // Reset to allow user to submit
      user.acknowledgementDate = undefined;
    }
    
    storage.saveUsers(users);
    console.log(`Force visited all sections for ${userEmail}, progress: ${user.progress}%`);
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

// FIXED: Fix all users progress without logging them out
export const fixAllUsersProgress = (): void => {
  const users = storage.getUsers();
  Object.keys(users).forEach(email => {
    const user = users[email];
    const oldProgress = user.progress;
    user.progress = calculateProgress(user);
    
    // Auto-reset acknowledgement if progress dropped
    if (user.acknowledged && user.progress < 100) {
      user.acknowledged = false;
      user.acknowledgementDate = undefined;
      console.log(`Auto-reset acknowledgement for ${email} during fix`);
    }
    
    console.log(`Fixed progress for ${email}: ${oldProgress}% -> ${user.progress}%`);
  });
  storage.saveUsers(users);
};

// Reset progress for a specific user (for testing)
export const resetUserProgress = (userEmail: string): void => {
  const users = storage.getUsers();
  const user = users[userEmail];

  if (user) {
    user.visitedSections = [];
    user.progress = 0;
    user.acknowledged = false;
    user.acknowledgementDate = undefined;
    storage.saveUsers(users);
  }
};

// Check if a section should be tracked for progress
export const shouldTrackSection = (sectionId: string): boolean => {
  return ALL_SECTIONS.includes(sectionId) && !EXCLUDED_SECTIONS.includes(sectionId);
};