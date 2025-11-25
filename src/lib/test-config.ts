// lib/test-config.ts - Easy test management
export interface TestQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    correct: boolean;
  }[];
  category?: string;
}

export interface TestConfig {
  id: string;
  name: string;
  description: string;
  passingScore: number; // Percentage
  questions: TestQuestion[];
  enabled: boolean;
  requiredFor: ('Bartender' | 'Trainee')[];
}

// EASY TO MODIFY TESTS - Just update this array!
export const TEST_CONFIGS: TestConfig[] = [
  {
    id: 'bartending-fundamentals-1',
    name: 'Bartending Fundamentals - Test 1',
    description: 'Basic bartending knowledge and procedures',
    passingScore: 70,
    enabled: true,
    requiredFor: ['Bartender', 'Trainee'],
    questions: [
      {
        id: 1,
        question: "What is the first thing you should do when starting your shift?",
        options: [
          { text: "Check the daily specials and event board", correct: true },
          { text: "Start making drinks for waiting customers", correct: false },
          { text: "Take a break before the rush", correct: false },
          { text: "Count the cash register", correct: false }
        ],
        category: "Opening Procedures"
      },
      {
        id: 2,
        question: "How should you handle a customer who appears intoxicated?",
        options: [
          { text: "Continue serving them but slower", correct: false },
          { text: "Politely refuse service and offer water", correct: true },
          { text: "Serve them one more drink then cut them off", correct: false },
          { text: "Ask other customers what to do", correct: false }
        ],
        category: "Customer Service"
      },
      {
        id: 3,
        question: "What is the proper procedure for splitting a check?",
        options: [
          { text: "Use the 'Split Check' function in Aloha POS", correct: true },
          { text: "Manually calculate and write separate checks", correct: false },
          { text: "Ask customers to figure it out themselves", correct: false },
          { text: "Combine all payments on one card", correct: false }
        ],
        category: "POS Operations"
      },
    ]
  },
];

// Helper functions
export const getActiveTests = (position: string): TestConfig[] => {
  return TEST_CONFIGS.filter(test => 
    test.enabled && test.requiredFor.includes(position as any)
  );
};

export const getTestById = (testId: string): TestConfig | undefined => {
  return TEST_CONFIGS.find(test => test.id === testId);
};

export const hasPassedTest = async (userEmail: string, testId: string): Promise<boolean> => {
  const { supabase } = await import('./supabase');
  const { data } = await supabase
    .from('test_results')
    .select('passed')
    .eq('user_email', userEmail)
    .eq('test_id', testId)
    .eq('passed', true)
    .single();
  return !!data;
};