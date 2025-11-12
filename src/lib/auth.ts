import { User, SessionData } from '@/types';
import { SECURITY_CONFIG } from './constants';
import { storage } from './storage';
import { supabase } from './supabase';

// Define the RegistrationData interface here too
interface RegistrationData {
  name: string;
  email: string;
  position: 'Bartender' | 'Admin' | 'Trainee';
  code: string;
  password: string;
  confirmPassword: string;
}

// Fix the constants to be strongly typed
export const APPROVED_CODES: string[] = [
  "BARSTAFF2025", "DECADESADMIN"
];

export const ADMIN_CODES: string[] = [
  "DECADESADMIN"
];

// UPDATED: New initializeTestUsers that works with Supabase
export const initializeTestUsers = async (): Promise<void> => {
  try {
    // Check if test users already exist in Supabase
    const { data: existingUsers } = await supabase
      .from('users')
      .select('email')
      .in('email', ['bartender@decadesbar.com', 'trainee@decadesbar.com', 'admin@decadesbar.com']);

    // FIXED: Added type annotation for the parameter
    const existingEmails = existingUsers?.map((u: { email: string }) => u.email) || [];

    const testUsers = [
      {
        email: 'bartender@decadesbar.com',
        name: 'Test Bartender',
        position: 'Bartender' as const,
        password: 'password123'
      },
      {
        email: 'trainee@decadesbar.com', 
        name: 'Test Trainee',
        position: 'Trainee' as const,
        password: 'password123'
      },
      {
        email: 'admin@decadesbar.com',
        name: 'Test Admin',
        position: 'Admin' as const,
        password: 'admin123'
      }
    ];

    const usersToCreate = testUsers.filter(user => !existingEmails.includes(user.email));

    if (usersToCreate.length > 0) {
      const { error } = await supabase
        .from('users')
        .insert(usersToCreate.map(user => ({
          email: user.email,
          name: user.name,
          position: user.position,
          status: 'active',
          progress: 0,
          acknowledged: false,
          registered_date: new Date().toISOString(),
          last_active: new Date().toISOString(),
          login_count: 0,
          password_hash: hashPassword(user.password),
          visited_sections: [],
          test_results: {},
          section_visits: {}
        })));

      if (error) {
        console.error('Error creating test users in Supabase:', error);
        // Fallback to localStorage
        initializeTestUsersLocal();
      } else {
        console.log(`Created ${usersToCreate.length} test users in Supabase`);
      }
    }
  } catch (error) {
    console.error('Error initializing test users:', error);
    // Fallback to localStorage
    initializeTestUsersLocal();
  }
};

// Keep the local version as fallback
const initializeTestUsersLocal = (): void => {
  const users = storage.getUsers();
  
  const testUsers = [
    {
      email: 'bartender@decadesbar.com',
      name: 'Test Bartender',
      position: 'Bartender' as const,
      password: 'password123'
    },
    {
      email: 'trainee@decadesbar.com', 
      name: 'Test Trainee',
      position: 'Trainee' as const,
      password: 'password123'
    },
    {
      email: 'admin@decadesbar.com',
      name: 'Test Admin',
      position: 'Admin' as const,
      password: 'admin123'
    }
  ];

  let createdAny = false;
  
  testUsers.forEach(testUser => {
    if (!users[testUser.email]) {
      users[testUser.email] = {
        name: testUser.name,
        email: testUser.email,
        position: testUser.position,
        status: 'active',
        registeredDate: new Date().toISOString(),
        progress: 0,
        acknowledged: false,
        passwordHash: hashPassword(testUser.password),
        loginCount: 0,
        lastActive: new Date().toISOString(),
        visitedSections: []
      };
      createdAny = true;
    }
  });

  if (createdAny) {
    storage.saveUsers(users);
    console.log('Test users initialized in localStorage');
  }
};

export const hashPassword = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString();
};

export const validatePasswordStrength = (password: string): string | null => {
  const requirements = {
    length: password.length >= 6,
    hasNumber: /\d/.test(password),
    hasLetter: /[a-zA-Z]/.test(password)
  };

  if (!requirements.length) return 'Password must be at least 6 characters';
  if (!requirements.hasNumber) return 'Password must contain at least one number';
  if (!requirements.hasLetter) return 'Password must contain at least one letter';
  return null;
};

export const isAdmin = (user: User | null): boolean => {
  return user?.position === 'Admin';
};

export const validateSession = (): User | null => {
  const session = storage.getSession();
  if (!session) return null;

  // Check if session is expired using loginTime + timeout
  const sessionAge = Date.now() - new Date(session.loginTime).getTime();
  if (sessionAge > SECURITY_CONFIG.sessionTimeout) {
    storage.clearSession();
    return null;
  }

  // Verify user still exists in database
  const users = storage.getUsers();
  if (!users[session.user.email]) {
    storage.clearSession();
    return null;
  }

  return session.user;
};

export const startUserSession = (user: User): void => {
  const sessionData: SessionData = {
    user,
    loginTime: new Date().toISOString()
  };
  storage.saveSession(sessionData);
};

export const endUserSession = (): void => {
  storage.clearSession();
};

// UPDATED: New performLogin that works with Supabase
export const performLogin = async (email: string, password: string): Promise<User> => {
  if (!email || !password) {
    throw new Error('Please enter both email and password');
  }

  // Safety check for server-side rendering
  if (typeof window === 'undefined') {
    return performLoginLocal(email, password);
  }

  try {
    // First try Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      // Fallback to localStorage
      console.log('User not found in Supabase, falling back to localStorage');
      return performLoginLocal(email, password);
    }

    // User found in Supabase
    if (user.status === 'blocked') {
      throw new Error('Account has been blocked. Please contact management.');
    }

    const hashedPassword = hashPassword(password);
    if (user.password_hash !== hashedPassword) {
      throw new Error('Invalid email or password');
    }

    // Update user in Supabase
    await supabase
      .from('users')
      .update({
        login_count: (user.login_count || 0) + 1,
        last_active: new Date().toISOString()
      })
      .eq('email', email);

    // Convert Supabase user to our User type
    const appUser: User = {
      name: user.name,
      email: user.email,
      position: user.position as 'Bartender' | 'Admin' | 'Trainee',
      status: user.status as 'active' | 'blocked',
      progress: user.progress,
      acknowledged: user.acknowledged,
      acknowledgementDate: user.acknowledgement_date,
      registeredDate: user.registered_date,
      lastActive: user.last_active,
      loginCount: user.login_count,
      passwordHash: user.password_hash,
      visitedSections: user.visited_sections || [],
      testResults: user.test_results || {},
      sectionVisits: user.section_visits || {}
    };

    startUserSession(appUser);
    return appUser;
  } catch (error) {
    console.error('Supabase login failed, falling back to local:', error);
    return performLoginLocal(email, password);
  }
};

// Keep local login as fallback
const performLoginLocal = async (email: string, password: string): Promise<User> => {
  const users = storage.getUsers();
  const user = users[email];

  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (user.status === 'blocked') {
    throw new Error('Account has been blocked. Please contact management.');
  }

  const hashedPassword = hashPassword(password);
  if (user.passwordHash !== hashedPassword) {
    throw new Error('Invalid email or password');
  }

  // Update user login stats
  user.loginCount = (user.loginCount || 0) + 1;
  user.lastActive = new Date().toISOString();
  storage.saveUsers(users);

  startUserSession(user);
  return user;
};

export const performRegistration = async (userData: RegistrationData): Promise<User> => {
  const { name, email, position, code, password, confirmPassword } = userData;

  // Validation
  if (!name || !email || !position || !code || !password || !confirmPassword) {
    throw new Error('Please fill in all fields');
  }

  if (password !== confirmPassword) {
    throw new Error('Passwords do not match');
  }

  const strengthError = validatePasswordStrength(password);
  if (strengthError) {
    throw new Error(strengthError);
  }

  if (!APPROVED_CODES.includes(code)) {
    throw new Error('Invalid registration code. Please contact your manager.');
  }

  // Admin registration safeguards
  if (position === 'Admin') {
    if (!ADMIN_CODES.includes(code)) {
      throw new Error('Administrative positions require manager authorization codes.');
    }
  }

  // Safety check for server-side rendering
  if (typeof window === 'undefined') {
    return performRegistrationLocal(userData);
  }

  try {
    // Try to register in Supabase first
    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      throw new Error('This email is already registered.');
    }

    // Create new user in Supabase
    const newUser = {
      name,
      email,
      position,
      status: 'active' as const,
      progress: 0,
      acknowledged: false,
      registered_date: new Date().toISOString(),
      last_active: new Date().toISOString(),
      login_count: 0,
      password_hash: hashPassword(password),
      visited_sections: [],
      test_results: {},
      section_visits: {}
    };

    const { data, error } = await supabase
      .from('users')
      .insert([newUser])
      .select()
      .single();

    if (error) throw error;

    // Convert back to app User type
    const appUser: User = {
      name: data.name,
      email: data.email,
      position: data.position as 'Bartender' | 'Admin' | 'Trainee',
      status: data.status as 'active' | 'blocked',
      progress: data.progress,
      acknowledged: data.acknowledged,
      acknowledgementDate: data.acknowledgement_date,
      registeredDate: data.registered_date,
      lastActive: data.last_active,
      loginCount: data.login_count,
      passwordHash: data.password_hash,
      visitedSections: data.visited_sections || [],
      testResults: data.test_results || {},
      sectionVisits: data.section_visits || {}
    };

    startUserSession(appUser);
    return appUser;
  } catch (error) {
    console.error('Supabase registration failed, falling back to local:', error);
    return performRegistrationLocal(userData);
  }
};

// Keep local registration as fallback
const performRegistrationLocal = async (userData: RegistrationData): Promise<User> => {
  const { name, email, position, code, password } = userData;
  
  const users = storage.getUsers();

  // Check if user already exists
  if (users[email]) {
    throw new Error('This email is already registered.');
  }

  // Create new user
  const newUser: User = {
    name,
    email,
    position,
    status: 'active',
    registeredDate: new Date().toISOString(),
    progress: 0,
    acknowledged: false,
    passwordHash: hashPassword(password),
    loginCount: 0,
    lastActive: new Date().toISOString(),
    visitedSections: []
  };

  users[email] = newUser;
  storage.saveUsers(users);

  startUserSession(newUser);
  return newUser;
};