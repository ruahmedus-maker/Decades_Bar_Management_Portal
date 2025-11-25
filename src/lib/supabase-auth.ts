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

// SINGLE function for test user management
export const setupTestUsers = async (): Promise<{ success: boolean; message: string }> => {
  // Remove the environment check - allow in production
  // if (process.env.NODE_ENV !== 'development') {
  //   return { success: false, message: 'Test users only available in development' };
  // }

  try {
    const testUsers = [
      { email: 'bartender@decadesbar.com', password: 'password123', name: 'Test Bartender', position: 'Bartender' as const },
      { email: 'trainee@decadesbar.com', password: 'password123', name: 'Test Trainee', position: 'Trainee' as const },
      { email: 'admin@decadesbar.com', password: 'admin123', name: 'Test Admin', position: 'Admin' as const }
    ];

    let createdCount = 0;
    let results = [];

    for (const user of testUsers) {
      try {
        // Step 1: Delete from custom users table if exists
        await supabase.from('users').delete().eq('email', user.email);

        // Step 2: Try to create auth user
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: user.email,
          password: user.password,
          options: { 
            data: { 
              name: user.name, 
              position: user.position 
            },
            // Auto-confirm in production
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        });

        // Step 3: Create in custom table regardless of auth result
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            email: user.email,
            name: user.name,
            position: user.position,
            created_at: new Date().toISOString(),
            status: 'active',
            progress: 0,
            acknowledged: false,
            acknowledgementDate: null,
            registeredDate: new Date().toISOString(),
            lastActive: new Date().toISOString(),
            loginCount: 0,
            visitedSections: [],
            testResults: {},
            sectionVisits: {}
          });

        if (!insertError) {
          createdCount++;
          results.push(`✅ ${user.email}`);
        } else {
          results.push(`❌ ${user.email}: ${insertError.message}`);
        }

      } catch (error) {
        results.push(`❌ ${user.email}: ${error}`);
      }
    }

    return { 
      success: createdCount > 0, 
      message: `Setup complete: ${createdCount}/3 users ready\n${results.join('\n')}` 
    };

  } catch (error) {
    console.error('Test user setup failed:', error);
    return { success: false, message: 'Setup failed: ' + (error as Error).message };
  }
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

// In lib/supabase-auth.ts - UPDATED with delay
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
    console.log('🔍 [REGISTRATION START]', { email, name: userData.name });

    // Validation
    if (!userData.code) throw new Error('Registration code is required');
    if (!APPROVED_CODES.includes(userData.code)) throw new Error('Invalid registration code');
    if (userData.position === 'Admin' && !ADMIN_CODES.includes(userData.code)) {
      throw new Error('Administrative positions require manager authorization codes');
    }

    const strengthError = validatePasswordStrength(password);
    if (strengthError) throw new Error(strengthError);

    // 1. Create user in Supabase Auth
    console.log('📝 [STEP 1] Creating auth user...');
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

    if (error) {
      console.error('❌ [AUTH ERROR] Auth user creation failed:', error);
      throw error;
    }
    if (!data.user) {
      console.error('❌ [AUTH ERROR] No user data returned');
      throw new Error('No user data returned');
    }

    console.log('✅ [STEP 1 COMPLETE] Auth user created:', { 
      id: data.user.id, 
      email: data.user.email 
    });

    // 🔄 ADDED DELAY HERE - Wait for auth user to be fully created
    console.log('⏳ Waiting for auth user to be fully processed...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('✅ Delay complete, proceeding to users table insert...');

    // 2. Create record in users table
    console.log('📝 [STEP 2] Creating users table record...');
    console.log('🔍 [INSERT DATA]', {
      auth_id: data.user.id,
      email: data.user.email,
      name: userData.name,
      position: userData.position
    });

    const { data: insertData, error: profileError } = await supabase
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
      })
      .select();

    if (profileError) {
      console.error('❌ [USERS TABLE ERROR] Insert failed:', profileError);
      console.error('❌ [ERROR DETAILS]', {
        message: profileError.message,
        details: profileError.details,
        hint: profileError.hint,
        code: profileError.code
      });
      
      // Try to delete the auth user if profile creation fails
      try {
        await supabase.auth.admin.deleteUser(data.user.id);
        console.log('🗑️ [ROLLBACK] Auth user deleted');
      } catch (deleteError) {
        console.error('❌ [ROLLBACK ERROR] Failed to delete auth user:', deleteError);
      }
      
      throw new Error(`Failed to create user profile: ${profileError.message}`);
    }

    console.log('✅ [STEP 2 COMPLETE] Users table record created:', insertData);

    // 3. Verify the record was actually created
    console.log('📝 [STEP 3] Verifying users table record...');
    const { data: userDataFromTable, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', data.user.id)
      .single();

    if (fetchError) {
      console.error('❌ [VERIFICATION ERROR] Failed to fetch user data:', fetchError);
      throw new Error('User created but verification failed');
    }

    if (!userDataFromTable) {
      console.error('❌ [VERIFICATION ERROR] No data returned from verification query');
      throw new Error('User created but verification returned no data');
    }

    console.log('✅ [STEP 3 COMPLETE] User data verified:', userDataFromTable);

    const authUser = convertToAuthUser(data.user, userDataFromTable);
    console.log('🎉 [REGISTRATION COMPLETE]', { 
      name: authUser.name, 
      email: authUser.email,
      id: authUser.id 
    });
    
    return { user: authUser, error: null };

  } catch (error: any) {
    console.error('💥 [REGISTRATION FAILED]', error);
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


// ===== CRUD OPERATIONS =====

// Get all users (for admin panel) - USING AUTH API
// In supabase-auth.ts - UPDATED VERSION
export const getAllUsers = async (): Promise<AuthUser[]> => {
  try {
    // Query the users table directly
    const { data: usersData, error } = await supabase
      .from('users')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching users from database:', error);
      return [];
    }

    if (!usersData) return [];

    // Convert database records to AuthUser objects
    const users: AuthUser[] = usersData.map(userData => ({
      id: userData.id,
      auth_id: userData.auth_id,
      name: userData.name,
      email: userData.email,
      position: userData.position,
      status: userData.status || 'active',
      progress: userData.progress || 0,
      acknowledged: userData.acknowledged || false,
      acknowledgementDate: userData.acknowledgement_date || null,
      registeredDate: userData.registered_date || new Date().toISOString(),
      lastActive: userData.last_active || new Date().toISOString(),
      loginCount: userData.login_count || 0,
      visitedSections: userData.visited_sections || [],
      testResults: userData.test_results || {},
      sectionVisits: userData.section_visits || {}
    }));

    return users;
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
// In supabase-auth.ts - should look like this:
export const trackSectionVisit = async (userEmail: string, sectionId: string, timeSpent: number = 30): Promise<void> => {
  try {
    // This should use the new progress system with user_progress table
    const { trackSectionVisit: trackProgress } = await import('./progress');
    await trackProgress(userEmail, sectionId, timeSpent);
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