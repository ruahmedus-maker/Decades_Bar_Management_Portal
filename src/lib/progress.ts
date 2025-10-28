import { User } from '@/types';
import { storage } from './storage';

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
const MINIMUM_SECTION_TIME = 30; // 30 seconds minimum per section

// Enhanced section visit tracking interface
export interface SectionVisit {
  sectionId: string;
  firstVisit: string;
  lastVisit: string;
  totalTime: number; // in seconds
  completed: boolean;
  quizPassed?: boolean;
}

// Helper function to check if user should have progress tracked
const shouldTrackUserProgress = (user: User): boolean => {
  return TRACKED_POSITIONS.includes(user.position);
};

// Helper function to get unique valid sections
const getUniqueValidSections = (visitedSections: string[] | undefined): string[] => {
  const uniqueSections: string[] = [];
  (visitedSections || []).forEach(section => {
    const isValid = ALL_SECTIONS.includes(section);
    const isExcluded = EXCLUDED_SECTIONS.includes(section);
    const isUnique = !uniqueSections.includes(section);
    
    if (isValid && !isExcluded && isUnique) {
      uniqueSections.push(section);
    }
  });
  return uniqueSections;
};

// Enhanced progress calculation using section visits
export const calculateProgress = (user: User): number => {
  // If user shouldn't be tracked, return 0
  if (!shouldTrackUserProgress(user)) {
    return 0;
  }

  // Use enhanced section visits if available, otherwise fall back to visitedSections
  if (user.sectionVisits) {
    const completedSections = ALL_SECTIONS.filter(sectionId => {
      const visit = user.sectionVisits?.[sectionId];
      return visit?.completed || false;
    }).length;
    
    const progress = Math.round((completedSections / ALL_SECTIONS.length) * 100);
    return Math.min(progress, 100);
  }

  // Fallback to original calculation
  const uniqueSections = getUniqueValidSections(user.visitedSections);
  const uniqueVisitedCount = uniqueSections.length;
  const totalSections = ALL_SECTIONS.length;
  
  const progress = Math.round((uniqueVisitedCount / totalSections) * 100);
  return Math.min(progress, 100);
};

// Enhanced section visit tracking with time requirements
export const trackSectionVisit = (userEmail: string, sectionId: string, timeSpent: number = 0): void => {
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

  // Initialize section visits tracking if not exists
  if (!user.sectionVisits) {
    user.sectionVisits = {};
  }

  // Initialize visitedSections for backward compatibility if not exists
  if (!user.visitedSections) {
    user.visitedSections = [];
  }

  const now = new Date().toISOString();
  
  // Get existing visit or create new one - SAFE ACCESS
  const existingVisit = user.sectionVisits[sectionId];
  
  if (existingVisit) {
    // Update existing visit
    existingVisit.lastVisit = now;
    existingVisit.totalTime += timeSpent;
    
    // Mark as completed if minimum time met
    if (!existingVisit.completed && existingVisit.totalTime >= MINIMUM_SECTION_TIME) {
      existingVisit.completed = true;
      console.log(`Section ${sectionId} marked as completed for ${userEmail} (${existingVisit.totalTime}s)`);
    }
  } else {
    // Create new visit record
    user.sectionVisits[sectionId] = {
      sectionId,
      firstVisit: now,
      lastVisit: now,
      totalTime: timeSpent,
      completed: timeSpent >= MINIMUM_SECTION_TIME
    };
    
    if (timeSpent >= MINIMUM_SECTION_TIME) {
      console.log(`Section ${sectionId} completed on first visit for ${userEmail}`);
    }
  }

  // Update visitedSections for backward compatibility - SAFE ACCESS
  const currentSectionVisit = user.sectionVisits[sectionId];
  const shouldAddToVisited = currentSectionVisit?.completed && 
                            user.visitedSections &&
                            !user.visitedSections.includes(sectionId);
  
  if (shouldAddToVisited) {
    user.visitedSections.push(sectionId);
    console.log(`Added section: ${sectionId} to visited sections for ${userEmail}`);
  }

  // Recalculate progress
  user.progress = calculateProgress(user);
  
  // AUTO-RESET: If user was acknowledged but no longer has 100% progress, reset acknowledgement
  if (user.acknowledged && user.progress < 100) {
    user.acknowledged = false;
    user.acknowledgementDate = undefined;
    console.log(`Auto-reset acknowledgement for ${userEmail} - progress dropped to ${user.progress}%`);
  }

  user.lastActive = now;
  storage.saveUsers(users);
};

// Get section completion details for UI display
export const getSectionCompletionDetails = (user: User, sectionId: string) => {
  // SAFE ACCESS with optional chaining
  const visit = user.sectionVisits?.[sectionId];
  
  if (!visit) {
    return {
      completed: false,
      timeSpent: 0,
      timeRequired: MINIMUM_SECTION_TIME,
      progress: 0
    };
  }

  const timeRequired = MINIMUM_SECTION_TIME;
  const timeSpent = visit.totalTime;
  const progress = Math.min(Math.round((timeSpent / timeRequired) * 100), 100);

  return {
    completed: visit.completed,
    timeSpent,
    timeRequired,
    progress
  };
};

// Simple quiz submission for critical sections
export const submitSectionQuiz = (userEmail: string, sectionId: string, score: number): boolean => {
  const users = storage.getUsers();
  const user = users[userEmail];

  // SAFE ACCESS with optional chaining
  const visit = user?.sectionVisits?.[sectionId];
  
  if (!user || !visit) {
    return false;
  }

  const passed = score >= 0.7; // 70% or higher to pass

  if (passed) {
    visit.quizPassed = true;
    
    // Auto-complete if time requirement also met
    if (!visit.completed && visit.totalTime >= MINIMUM_SECTION_TIME) {
      visit.completed = true;
      
      // Add to visitedSections for backward compatibility - SAFE ACCESS
      if (user.visitedSections && !user.visitedSections.includes(sectionId)) {
        user.visitedSections.push(sectionId);
      }
    }
    
    storage.saveUsers(users);
    console.log(`Quiz passed for section ${sectionId} by ${userEmail}`);
  }

  return passed;
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

// Enhanced progress breakdown with time tracking
export const getProgressBreakdown = (user: User) => {
  // Don't calculate progress for admins, managers, or owners
  if (NON_TRACKED_POSITIONS.includes(user.position)) {
    return {
      progress: 0,
      sectionsVisited: 0,
      totalSections: 0,
      canAcknowledge: false,
      breakdown: {},
      isTracked: false,
      sectionDetails: []
    };
  }

  // Use enhanced section details if available
  const sectionDetails = ALL_SECTIONS.map(sectionId => {
    const completion = getSectionCompletionDetails(user, sectionId);
    return {
      id: sectionId,
      label: sectionId.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' '),
      completed: completion.completed,
      timeSpent: completion.timeSpent,
      timeRequired: completion.timeRequired,
      progress: completion.progress
    };
  });

  const completedSections = sectionDetails.filter(s => s.completed).length;
  const totalSections = ALL_SECTIONS.length;
  const progress = calculateProgress(user);
  
  // Can only acknowledge if progress is 100% AND not already acknowledged AND user is tracked
  const canAcknowledge = progress === 100 && !user.acknowledged && shouldTrackUserProgress(user);
  const missingSections = ALL_SECTIONS.filter(sectionId => {
    const details = getSectionCompletionDetails(user, sectionId);
    return !details.completed;
  });
  
  return {
    sectionsVisited: completedSections,
    totalSections: totalSections,
    progress: progress,
    canAcknowledge: canAcknowledge,
    missingSections: missingSections,
    isTracked: true,
    sectionDetails: sectionDetails
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
      
      // Initialize section visits with completed status
      if (!user.sectionVisits) {
        user.sectionVisits = {};
      }
      
      ALL_SECTIONS.forEach(sectionId => {
        user.sectionVisits![sectionId] = {
          sectionId,
          firstVisit: new Date().toISOString(),
          lastVisit: new Date().toISOString(),
          totalTime: MINIMUM_SECTION_TIME,
          completed: true
        };
      });
      
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
    const oldProgress = user.progress || 0;
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
      user.sectionVisits = {};
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

// Export the non-tracked positions for use in other files
export const getNonTrackedPositions = (): string[] => {
  return [...NON_TRACKED_POSITIONS];
};

// Export the tracked positions for use in other files
export const getTrackedPositions = (): string[] => {
  return [...TRACKED_POSITIONS];
};

// Migrate existing users to enhanced tracking
export const migrateToEnhancedTracking = (): void => {
  const users = storage.getUsers();
  Object.keys(users).forEach(email => {
    const user = users[email];
    
    if (shouldTrackUserProgress(user) && user.visitedSections && user.visitedSections.length > 0) {
      // Initialize section visits if not exists
      if (!user.sectionVisits) {
        user.sectionVisits = {};
      }
      
      // Migrate existing visited sections to enhanced tracking
      user.visitedSections.forEach(sectionId => {
        if (shouldTrackSection(sectionId) && !user.sectionVisits![sectionId]) {
          user.sectionVisits![sectionId] = {
            sectionId,
            firstVisit: user.lastActive || new Date().toISOString(),
            lastVisit: user.lastActive || new Date().toISOString(),
            totalTime: MINIMUM_SECTION_TIME, // Assume they spent enough time
            completed: true
          };
        }
      });
      
      console.log(`Migrated ${user.visitedSections.length} sections for ${email}`);
    }
  });
  storage.saveUsers(users);
  console.log('Enhanced tracking migration completed');
};

// Get all completed sections for a user (safe version)
export const getCompletedSections = (user: User): string[] => {
  if (!user.sectionVisits) {
    return getUniqueValidSections(user.visitedSections);
  }
  
  return ALL_SECTIONS.filter(sectionId => {
    const visit = user.sectionVisits?.[sectionId];
    return visit?.completed || false;
  });
};

// Check if a specific section is completed (safe version)
export const isSectionCompleted = (user: User, sectionId: string): boolean => {
  if (user.sectionVisits?.[sectionId]) {
    return user.sectionVisits[sectionId].completed;
  }
  
  return user.visitedSections?.includes(sectionId) || false;
};