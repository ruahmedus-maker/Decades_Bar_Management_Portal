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
const convertToAuthUser = (authUser: any, userData: any): AuthUser => {
  return {
    id: userData?.id || authUser.id,  // Use users.id as primary ID
    auth_id: authUser.id,  // Reference to auth user
    name: userData?.name || 'User',
    email: userData?.email || authUser.email || '',
    position: userData?.position || 'Trainee',
    status: userData?.status || 'active',
    progress: userData?.progress || 0,
    acknowledged: userData?.acknowledged || false,
    acknowledgementDate: userData?.acknowledgement_date || null,
    registeredDate: userData?.registered_date || new Date().toISOString(),
    lastActive: userData?.last_active || new Date().toISOString(),
    loginCount: userData?.login_count || 0,
    visitedSections: userData?.visited_sections || [],
    testResults: userData?.test_results || {},
    sectionVisits: userData?.section_visits || {}
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
// In lib/supabase-auth.ts
// In lib/supabase-auth.ts - FIXED signUpWithEmail
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
    
    // Validation (keep your existing code)
    if (!userData.code) throw new Error('Registration code is required');
    if (!APPROVED_CODES.includes(userData.code)) throw new Error('Invalid registration code');
    if (userData.position === 'Admin' && !ADMIN_CODES.includes(userData.code)) {
      throw new Error('Administrative positions require manager authorization codes');
    }

    const strengthError = validatePasswordStrength(password);
    if (strengthError) throw new Error(strengthError);

    // 1. Create user in Supabase Auth
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

    // 2. ✅ CRITICAL: Create record in users table for relationships
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        auth_id: data.user.id,
        email: data.user.email,
        name: userData.name,
        position: userData.position,
        status: 'active',
        progress: 0,
        acknowledged: false,
        acknowledgement_date: null,
        registered_date: new Date().toISOString(),
        last_active: new Date().toISOString(),
        login_count: 0,
        visited_sections: [],
        test_results: {},
        section_visits: {}
      });

    if (profileError) {
      console.error('Error creating user profile:', profileError);
      // Optional: Delete the auth user if profile creation fails
      await supabase.auth.admin.deleteUser(data.user.id);
      throw new Error('Failed to create user profile');
    }

    // ✅ FIX: Fetch the user data from users table instead of using metadata
    const { data: userDataFromTable, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', data.user.id)
      .single();

    if (fetchError) {
      console.error('Error fetching new user data:', fetchError);
      throw new Error('User created but failed to fetch user data');
    }

    const authUser = convertToAuthUser(data.user, userDataFromTable);
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

    // ✅ Get user data from users table instead of metadata
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', session.user.id)
      .single();

    if (error) {
      console.error('Error fetching user data in getCurrentSession:', error);
      return null;
    }

    return convertToAuthUser(session.user, userData);
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
      // ✅ Get user data from users table
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching user data in auth state change:', error);
        callback(null);
        return;
      }

      const user = convertToAuthUser(session.user, userData);
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
// In lib/supabase-auth.ts - Update getCurrentUser
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    // ✅ Get user data from users table
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user data:', error);
      return null;
    }

    return convertToAuthUser(user, userData);
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Update progress tracking to use users table
export const trackSectionVisit = async (sectionId: string): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('No user logged in');

    // Get current user data
    const { data: currentUser } = await supabase
      .from('users')
      .select('visited_sections')
      .eq('auth_id', user.id)
      .single();

    const currentSections = currentUser?.visited_sections || [];
    const updatedSections = Array.from(new Set([...currentSections, sectionId]));

    // Update users table
    const { error } = await supabase
      .from('users')
      .update({
        visited_sections: updatedSections,
        last_active: new Date().toISOString()
      })
      .eq('auth_id', user.id);

    if (error) throw error;
  } catch (error) {
    console.error('Error tracking section visit:', error);
    throw error;
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