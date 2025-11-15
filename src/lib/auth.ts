import { User, SessionData } from '@/types';
import { SECURITY_CONFIG } from './constants';
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

// Define the Supabase user type for better type safety
interface SupabaseUser {
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
  visited_sections: string[];
  test_results: any;
  section_visits: any;
  created_at: string;
  updated_at: string;
}

// Fix the constants to be strongly typed
export const APPROVED_CODES: string[] = [
  "BARSTAFF2025", "DECADESADMIN"
];

export const ADMIN_CODES: string[] = [
  "DECADESADMIN"
];

// UPDATED: Initialize test users in Supabase only
export const initializeTestUsers = async (): Promise<void> => {
  try {
    // Check if test users already exist in Supabase
    const { data: existingUsers } = await supabase
      .from('users')
      .select('email')
      .in('email', ['bartender@decadesbar.com', 'trainee@decadesbar.com', 'admin@decadesbar.com']);

    // FIXED: Added proper type annotation
    const existingEmails = existingUsers?.map((user: { email: string }) => user.email) || [];

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
        throw error;
      } else {
        console.log(`Created ${usersToCreate.length} test users in Supabase`);
      }
    }
  } catch (error) {
    console.error('Error initializing test users:', error);
    throw error;
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

// UPDATED: Session management using localStorage (client-side only)
export const validateSession = (): User | null => {
  if (typeof window === 'undefined') return null;

  try {
    const sessionData = localStorage.getItem('decades_session');
    if (!sessionData) return null;

    const session: SessionData = JSON.parse(sessionData);
    
    // Check if session is expired using loginTime + timeout
    const sessionAge = Date.now() - new Date(session.loginTime).getTime();
    if (sessionAge > SECURITY_CONFIG.sessionTimeout) {
      localStorage.removeItem('decades_session');
      return null;
    }

    return session.user;
  } catch (error) {
    console.error('Error validating session:', error);
    return null;
  }
};

export const startUserSession = (user: User): void => {
  const sessionData: SessionData = {
    user,
    loginTime: new Date().toISOString()
  };
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('decades_session', JSON.stringify(sessionData));
  }
};

export const endUserSession = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('decades_session');
  }
};

// Helper function to convert Supabase user to app User type
const convertSupabaseUserToAppUser = (user: SupabaseUser): User => {
  return {
    name: user.name,
    email: user.email,
    position: user.position as 'Bartender' | 'Admin' | 'Trainee',
    status: user.status as 'active' | 'blocked',
    progress: user.progress || 0,
    acknowledged: user.acknowledged || false,
    acknowledgementDate: user.acknowledgement_date || null,
    registeredDate: user.registered_date,
    lastActive: user.last_active,
    loginCount: user.login_count || 0,
    passwordHash: user.password_hash,
    visitedSections: user.visited_sections || [],
    testResults: user.test_results || {},
    sectionVisits: user.section_visits || {}
  };
};

// UPDATED: Perform login using Supabase only
export const performLogin = async (email: string, password: string): Promise<User> => {
  if (!email || !password) {
    throw new Error('Please enter both email and password');
  }

  // Server-side rendering check
  if (typeof window === 'undefined') {
    throw new Error('Login is only available in the browser');
  }

  try {
    // Query user from Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      throw new Error('Invalid email or password');
    }

    // Check if account is blocked
    if (user.status === 'blocked') {
      throw new Error('Account has been blocked. Please contact management.');
    }

    // Verify password
    const hashedPassword = hashPassword(password);
    if (user.password_hash !== hashedPassword) {
      throw new Error('Invalid email or password');
    }

    // Update user login stats in Supabase
    await supabase
      .from('users')
      .update({
        login_count: (user.login_count || 0) + 1,
        last_active: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('email', email);

    const appUser = convertSupabaseUserToAppUser(user as SupabaseUser);
    startUserSession(appUser);
    return appUser;
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(error.message || 'Login failed. Please try again.');
  }
};

// UPDATED: Perform registration using Supabase only
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

  // Server-side rendering check
  if (typeof window === 'undefined') {
    throw new Error('Registration is only available in the browser');
  }

  try {
    // Check if user already exists in Supabase
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

    const appUser = convertSupabaseUserToAppUser(data as SupabaseUser);
    startUserSession(appUser);
    return appUser;
  } catch (error: any) {
    console.error('Registration error:', error);
    throw new Error(error.message || 'Registration failed. Please try again.');
  }
};

// NEW: Get all users (for admin panel)
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('name');

    if (error) throw error;

    // FIXED: Added proper type annotation for the mapping function
    return (data || []).map((user: SupabaseUser) => convertSupabaseUserToAppUser(user));
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

// NEW: Update user (for admin panel)
export const updateUser = async (email: string, updates: Partial<User>): Promise<void> => {
  try {
    const { error } = await supabase
      .from('users')
      .update({
        name: updates.name,
        position: updates.position,
        status: updates.status,
        progress: updates.progress,
        acknowledged: updates.acknowledged,
        acknowledgement_date: updates.acknowledgementDate,
        last_active: updates.lastActive,
        updated_at: new Date().toISOString()
      })
      .eq('email', email);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// NEW: Delete user (for admin panel)
export const deleteUser = async (email: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('email', email);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};