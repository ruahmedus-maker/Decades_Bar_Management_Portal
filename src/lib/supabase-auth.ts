// lib/supabase-auth.ts - SIMPLIFIED VERSION
import { supabase } from './supabase';
import { User } from '@/types';

export interface AuthUser extends User {
  id: string;
}

interface AuthResponse {
  user: AuthUser | null;
  error: string | null;
}

export const APPROVED_CODES = ["BARSTAFF2025", "DECADESADMIN"];
export const ADMIN_CODES = ["DECADESADMIN"];

export const validatePasswordStrength = (password: string): string | null => {
  if (password.length < 6) return 'Password must be at least 6 characters';
  if (!/\d/.test(password)) return 'Password must contain at least one number';
  if (!/[a-zA-Z]/.test(password)) return 'Password must contain at least one letter';
  return null;
};

export const isAdmin = (user: User | null): boolean => {
  return user?.position === 'Admin';
};

// Convert Auth user to our User type
const convertToAuthUser = (authUser: any, userMetadata: any): AuthUser => {
  return {
    id: authUser.id,
    name: userMetadata?.name || authUser.email?.split('@')[0] || 'User',
    email: authUser.email || '',
    position: userMetadata?.position || 'Trainee',
    status: userMetadata?.status || 'active',
    progress: userMetadata?.progress || 0,
    acknowledged: userMetadata?.acknowledged || false,
    acknowledgementDate: userMetadata?.acknowledgementDate || null,
    registeredDate: authUser.created_at || new Date().toISOString(),
    lastActive: userMetadata?.lastActive || new Date().toISOString(),
    loginCount: userMetadata?.loginCount || 0,
    visitedSections: userMetadata?.visitedSections || [],
    testResults: userMetadata?.testResults || {},
    sectionVisits: userMetadata?.sectionVisits || {}
  };
};
// SIMPLE: Just initialize with basic check
export const initializeAuth = async (): Promise<void> => {
  console.log('🔐 Auth system ready');
};

// SIMPLE: Sign in
export const signInWithEmail = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    console.log(`🔐 Signing in: ${email}`);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('No user data returned');

    const authUser = convertToAuthUser(data.user, data.user.user_metadata);
    console.log(`✅ Signed in: ${authUser.name}`);
    
    return { user: authUser, error: null };

  } catch (error: any) {
    console.error(`❌ Sign in failed:`, error);
    return { user: null, error: error.message || 'Sign in failed' };
  }
};

// SIMPLE: Sign up
export const signUpWithEmail = async (
  email: string, 
  password: string, 
  userData: {
    name: string;
    position: 'Bartender' | 'Admin' | 'Trainee';
    code: string;
  }
): Promise<AuthResponse> => {
  try {
    console.log(`👤 Registering: ${email}`);
    
    // Validation
    if (!userData.code) throw new Error('Registration code is required');
    if (!APPROVED_CODES.includes(userData.code)) throw new Error('Invalid registration code');
    if (userData.position === 'Admin' && !ADMIN_CODES.includes(userData.code)) {
      throw new Error('Administrative positions require manager authorization codes');
    }

    const strengthError = validatePasswordStrength(password);
    if (strengthError) throw new Error(strengthError);

    // Create user in Supabase Auth ONLY
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.name,
          position: userData.position
        }
      }
    });

    if (error) throw error;
    if (!data.user) throw new Error('No user created');

    const authUser = convertToAuthUser(data.user, data.user.user_metadata);
    console.log(`✅ Registered: ${authUser.name}`);
    
    return { user: authUser, error: null };

  } catch (error: any) {
    console.error(`❌ Registration failed:`, error);
    return { user: null, error: error.message || 'Registration failed' };
  }
};

// SIMPLE: Sign out
export const signOut = async (): Promise<{ error: string | null }> => {
  try {
    const { error } = await supabase.auth.signOut();
    return { error: error?.message || null };
  } catch (error: any) {
    return { error: error.message || 'Sign out failed' };
  }
};

// SIMPLE: Get current session
export const getCurrentSession = async (): Promise<AuthUser | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return null;
    }

    return convertToAuthUser(session.user, session.user.user_metadata);
  } catch (error) {
    console.error('Error getting current session:', error);
    return null;
  }
};

// SIMPLE: Auth state change
export const onAuthStateChange = (callback: (user: AuthUser | null) => void) => {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    console.log(`🔄 Auth state: ${event}`);
    
    if (event === 'SIGNED_IN' && session?.user) {
      const user = convertToAuthUser(session.user, session.user.user_metadata);
      callback(user);
    } else if (event === 'SIGNED_OUT') {
      callback(null);
    }
  });
};

// SIMPLE: Create test users (manual process)
export const createTestUsers = async (): Promise<void> => {
  console.log('👤 Creating test users...');
  
  // Just log the test credentials - users will register themselves
  const testUsers = [
    { email: 'bartender@decadesbar.com', password: 'password123', role: 'Bartender' },
    { email: 'trainee@decadesbar.com', password: 'password123', role: 'Trainee' },
    { email: 'admin@decadesbar.com', password: 'admin123', role: 'Admin' }
  ];
  
  console.log('Test credentials:', testUsers);
  console.log('Users should register themselves using these credentials');
};

// ===== CRUD OPERATIONS =====

// Get all users (for admin panel) - USING AUTH API
export const getAllUsers = async (): Promise<AuthUser[]> => {
  try {
    // Note: This requires service role key for admin operations
    // For now, we'll return current user or empty array
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return [];
    
    // Convert current user to AuthUser
    const authUser = convertToAuthUser(user, user.user_metadata);
    return [authUser];
    
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

// Update user - USING USER METADATA
export const updateUser = async (email: string, updates: Partial<AuthUser>): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || user.email !== email) {
      throw new Error('Unauthorized to update this user');
    }

    // Update user metadata in Supabase Auth
    const { error } = await supabase.auth.updateUser({
      data: {
        ...user.user_metadata,
        name: updates.name,
        position: updates.position,
        progress: updates.progress,
        acknowledged: updates.acknowledged,
        acknowledgementDate: updates.acknowledgementDate,
        lastActive: updates.lastActive || new Date().toISOString(),
        visitedSections: updates.visitedSections,
        testResults: updates.testResults,
        sectionVisits: updates.sectionVisits
      }
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Delete user - USING AUTH API
export const deleteUser = async (email: string): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user || user.email !== email) {
      throw new Error('Unauthorized to delete this user');
    }

    // Users can delete their own account
    const { error } = await supabase.auth.updateUser({
      data: {
        ...user.user_metadata,
        status: 'deleted'
      }
    });

    if (error) throw error;
    
    // Sign out after account deletion
    await supabase.auth.signOut();
    
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Update user progress - USING USER METADATA
export const updateUserProgress = async (progress: number): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('No user logged in');

    const { error } = await supabase.auth.updateUser({
      data: {
        ...user.user_metadata,
        progress: progress,
        lastActive: new Date().toISOString()
      }
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error updating user progress:', error);
    throw error;
  }
};

// Track section visit - USING USER METADATA
export const trackSectionVisit = async (sectionId: string): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('No user logged in');

    const currentSections = user.user_metadata?.visitedSections || [];
    const updatedSections = Array.from(new Set([...currentSections, sectionId]));

    const { error } = await supabase.auth.updateUser({
      data: {
        ...user.user_metadata,
        visitedSections: updatedSections,
        lastActive: new Date().toISOString()
      }
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error tracking section visit:', error);
    throw error;
  }
};

// Submit acknowledgement - USING USER METADATA
export const submitAcknowledgement = async (): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('No user logged in');

    const { error } = await supabase.auth.updateUser({
      data: {
        ...user.user_metadata,
        acknowledged: true,
        acknowledgementDate: new Date().toISOString(),
        lastActive: new Date().toISOString()
      }
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error submitting acknowledgement:', error);
    throw error;
  }
};

// Get user by email - USING AUTH
export const getUserByEmail = async (email: string): Promise<AuthUser | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Users can only get their own data in this simplified version
    if (!user || user.email !== email) {
      return null;
    }

    return convertToAuthUser(user, user.user_metadata);
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
};

// Get current user - SIMPLIFIED
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    return convertToAuthUser(user, user.user_metadata);
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Password reset function - USING AUTH
export const resetUserPassword = async (email: string): Promise<{ error: string | null }> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    return { error: error?.message || null };
  } catch (error: any) {
    return { error: error.message || 'Failed to reset password' };
  }
};

// Update user profile - SIMPLE VERSION
export const updateUserProfile = async (updates: {
  name?: string;
  position?: string;
}): Promise<{ error: string | null }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: 'No user logged in' };
    }

    const { error } = await supabase.auth.updateUser({
      data: {
        ...user.user_metadata,
        ...updates
      }
    });

    return { error: error?.message || null };
  } catch (error: any) {
    return { error: error.message || 'Failed to update profile' };
  }
};

// Check if user exists - USING AUTH
export const checkUserExists = async (email: string): Promise<boolean> => {
  try {
    // Try to sign in (this will fail if user doesn't exist)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false // Don't create user, just check
      }
    });

    // If no error, user exists
    return !error;
  } catch (error) {
    return false;
  }
};

// Simple user stats update
export const updateUserStats = async (stats: {
  progress?: number;
  visitedSections?: string[];
  testResults?: any;
  sectionVisits?: any;
}): Promise<{ error: string | null }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: 'No user logged in' };
    }

    const { error } = await supabase.auth.updateUser({
      data: {
        ...user.user_metadata,
        ...stats,
        lastActive: new Date().toISOString()
      }
    });

    return { error: error?.message || null };
  } catch (error: any) {
    return { error: error.message || 'Failed to update stats' };
  }
};

// Helper to refresh user data
export const refreshUserData = async (): Promise<AuthUser | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    return convertToAuthUser(user, user.user_metadata);
  } catch (error) {
    console.error('Error refreshing user data:', error);
    return null;
  }
};