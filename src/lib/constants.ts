export const SECURITY_CONFIG = {
  maxLoginAttempts: 5,
  lockoutTime: 15 * 60 * 1000, // 15 minutes
  sessionTimeout: 8 * 60 * 60 * 1000, // 8 hours
  passwordMinLength: 6
} as const;

export const APPROVED_CODES = [
  "BARSTAFF2025", "DECADESADMIN"
] as const;

export const ADMIN_CODES = [
  "DECADESADMIN"
] as const;

export const NAV_ITEMS = [
  // HOME / DASHBOARD
  { id: 'welcome', icon: '🏠', label: 'Home Dashboard', group: 'Home' },

  // SERVICE & MENU
  { id: 'drinks-specials', icon: '🏷️', label: 'Drinks & Specials', group: 'Service & Menu' },
  { id: 'cocktails', icon: '🍹', label: 'Cocktail Library', group: 'Service & Menu' },
  { id: 'bar-cleanings', icon: '🧹', label: 'Bar Cleaning', group: 'Service & Menu' },
  { id: 'glassware-guide', icon: '🥃', label: 'Glassware Guide', group: 'Service & Menu' },
  { id: 'comps-voids', icon: '💰', label: 'Comps & Voids', group: 'Service & Menu' },
  { id: 'special-events', icon: '📅', label: 'Special Events', group: 'Service & Menu' },

  // OPERATIONS & CULTURE
  { id: 'training', icon: '🎓', label: 'Training Hub', group: 'Operations & Culture' },
  { id: 'tests', icon: '📝', label: 'Classwork & Exams', group: 'Operations & Culture' },
  { id: 'procedures', icon: '📋', label: 'Standard Procedures', group: 'Operations & Culture' },
  { id: 'uniform-guide', icon: '👕', label: 'Uniform Standards', group: 'Operations & Culture' },
  { id: 'social-media', icon: '📱', label: 'Social Media', group: 'Operations & Culture' },
  { id: 'policies', icon: '📄', label: 'Venue Policies', group: 'Operations & Culture' },
  { id: 'maintenance', icon: '🔧', label: 'Maintenance Log', group: 'Operations & Culture' },

  // ADMIN
  { id: 'admin-panel', icon: '⚙️', label: 'System Admin', group: 'Admin' },
  { id: 'employee-counselings', icon: '📝', label: 'Counseling Log', group: 'Admin' },
  { id: 'performance-report', icon: '📊', label: 'KPI Reports', group: 'Admin' },
] as const;

export const TEST_QUESTIONS = [
  {
    id: 1,
    question: "What is the standard pour for a shot of liquor?",
    options: [
      { text: "1 oz", correct: false },
      { text: "1.5 oz", correct: true },
      { text: "2 oz", correct: false },
      { text: "2.5 oz", correct: false }
    ],
    feedback: "The standard pour for a shot is 1.5 oz."
  },
  // Add other questions...
] as const;

// REMOVED: ENABLE_TESTS - now handled by environment variable directly