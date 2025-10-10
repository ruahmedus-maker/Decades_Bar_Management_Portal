export const SECURITY_CONFIG = {
  maxLoginAttempts: 5,
  lockoutTime: 15 * 60 * 1000, // 15 minutes
  sessionTimeout: 8 * 60 * 60 * 1000, // 8 hours
  passwordMinLength: 6
} as const;

export const APPROVED_CODES: string[] = [
  "BARSTAFF2025", "DECADESADMIN"
];

export const ADMIN_CODES: string[] = [
  "DECADESADMIN"
];


export const NAV_ITEMS = [
  { id: 'welcome', icon: '🏠', label: 'Welcome' },
  { id: 'training', icon: '🎓', label: 'Training Materials' },
  { id: 'tests', icon: '❓', label: 'Training Tests' },
  { id: 'procedures', icon: '📋', label: 'Standard Procedures' },
  { id: 'aloha-pos', icon: '💻', label: 'Aloha POS' },
  { id: 'videos', icon: '🎥', label: 'Video Library' },
  { id: 'cocktails', icon: '🍹', label: 'Cocktail Recipes' },
  { id: 'drink-specials', icon: '🏷️', label: 'Drink Specials' },
  { id: 'glassware-guide', icon: '🥃', label: 'Glassware Guide' },
  { id: 'uniform-guide', icon: '👕', label: 'Uniform Guide' },
  { id: 'bar-cleanings', icon: '🧹', label: 'Bar Cleanings' },
  { id: 'social-media', icon: '📱', label: 'Social Media' },
  { id: 'special-events', icon: '📅', label: 'Special Events' },
  { id: 'comps-voids', icon: '💰', label: 'Comps & Voids' },
  { id: 'policies', icon: '📄', label: 'Policies' },
  { id: 'admin-panel', icon: '⚙️', label: 'Admin Panel' },
  { id: 'faq', icon: '❓', label: 'FAQ' },
  { id: 'resources', icon: '📚', label: 'Additional Resources' },
  // Add the missing admin-only items
  { id: 'employee-counselings', icon: '📝', label: 'Employee Counselings' },
  { id: 'schedule-report', icon: '📋', label: 'Schedule Report' },
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

export const ENABLE_TESTS = true;