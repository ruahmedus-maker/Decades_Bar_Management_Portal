// lib/supabase-auth.ts - COMPLETE FIXED VERSION
import { supabase, getServiceRoleClient } from './supabase';
import { User } from '@/types';

export interface AuthUser extends User {
  id: string;
  auth_id?: string;
}

interface AuthResponse {
  user: AuthUser | null;
  error: string | null;
}

export const SECURITY_CONFIG = {
  sessionTimeout: 24 * 60 * 60 * 1000
};

export const APPROVED_CODES: string[] = [
  "BARSTAFF2025", "DECADESADMIN"
];

export const ADMIN_CODES: string[] = [
  "DECADESADMIN"
];

// Password strength validation
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

// Convert database user to AuthUser
const convertToAuthUser = (user: any): AuthUser => {
  return {
    id: user.id,
    auth_id: user.auth_id,
    name: user.name,
    email: user.email,
    position: user.position,
    status: user.status,
    progress: user.progress || 0,
    acknowledged: user.acknowledged || false,
    acknowledgementDate: user.acknowledgement_date || null,
    registeredDate: user.registered_date,
    lastActive: user.last_active,
    loginCount: user.login_count || 0,
    visitedSections: user.visited_sections || [],
    testResults: user.test_results || {},
    sectionVisits: user.section_visits || {}
  };
};

// FIXED: Ensure database user exists with proper error handling
const ensureDatabaseUser = async (authUser: any): Promise<AuthUser> => {
  const serviceClient = getServiceRoleClient();
  
  try {
    console.log(`🔍 Ensuring database user exists for: ${authUser.email}`);
    
    // First, try to find by auth_id (this is the correct way)
    const { data: existingUser, error: fetchError } = await serviceClient
      .from('users')
      .select('*')
      .eq('auth_id', authUser.id)
      .single();

    if (!fetchError && existingUser) {
      console.log(`✅ Found user by auth_id: ${authUser.email}`);
      return convertToAuthUser(existingUser);
    }

    // If not found by auth_id, try by email (for legacy users)
    console.log(`🔍 User not found by auth_id, trying by email: ${authUser.email}`);
    const { data: userByEmail, error: emailError } = await serviceClient
      .from('users')
      .select('*')
      .eq('email', authUser.email)
      .single();

    if (!emailError && userByEmail) {
      console.log(`✅ Found user by email, updating auth_id: ${authUser.email}`);
      // Update the existing user with the correct auth_id
      const { data: updatedUser, error: updateError } = await serviceClient
        .from('users')
        .update({ 
          auth_id: authUser.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', userByEmail.id)
        .select()
        .single();

      if (updateError) throw updateError;
      return convertToAuthUser(updatedUser);
    }

    // If no user exists at all, create a new one
    console.log(`📝 Creating new database user for: ${authUser.email}`);
    const { data: newUser, error: createError } = await serviceClient
      .from('users')
      .insert({
        auth_id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.name || authUser.email.split('@')[0],
        position: authUser.user_metadata?.position || 'Trainee',
        status: 'active',
        progress: 0,
        acknowledged: false,
        registered_date: new Date().toISOString(),
        last_active: new Date().toISOString(),
        login_count: 0,
        visited_sections: [],
        test_results: {},
        section_visits: {}
      })
      .select()
      .single();

    if (createError) {
      console.error('❌ Failed to create database user:', createError);
      throw createError;
    }

    console.log(`✅ Created new database user: ${authUser.email}`);
    return convertToAuthUser(newUser);

  } catch (error) {
    console.error('❌ Error ensuring database user:', error);
    throw error;
  }
};

// FIXED: Initialize auth with better error handling
export const initializeAuth = async (): Promise<void> => {
  try {
    console.log('🔐 Initializing authentication system...');
    
    const serviceClient = getServiceRoleClient();

    // Check if we have any users in our database
    const { data: existingUsers, error } = await serviceClient
      .from('users')
      .select('id, email, auth_id')
      .limit(5);

    if (error) {
      console.error('❌ Database connection failed:', error);
      return;
    }

    console.log(`📊 Found ${existingUsers?.length || 0} existing users`);

    // If no users exist, create test users
    if (!existingUsers || existingUsers.length === 0) {
      console.log('👥 No users found, creating test users...');
      await createTestUsersWithAuth();
    } else {
      // Check for users without auth_id and fix them
      const usersWithoutAuth = existingUsers.filter(user => !user.auth_id);
      if (usersWithoutAuth.length > 0) {
        console.log(`🔗 ${usersWithoutAuth.length} users need auth linking`);
        await fixUsersWithoutAuth(usersWithoutAuth);
      }
    }
  } catch (error) {
    console.error('❌ Auth initialization failed:', error);
  }
};

// NEW: Fix users that don't have auth_id
const fixUsersWithoutAuth = async (users: any[]): Promise<void> => {
  const serviceClient = getServiceRoleClient();
  
  for (const user of users) {
    try {
      console.log(`🔧 Fixing user without auth_id: ${user.email}`);
      
      // Find the auth user by email
      const { data: { users: authUsers }, error: listError } = await serviceClient.auth.admin.listUsers();
      if (listError) throw listError;
      
      const authUser = authUsers.find((au: any) => au.email === user.email);
      
      if (authUser) {
        // Update the database user with the auth_id
        const { error: updateError } = await serviceClient
          .from('users')
          .update({ 
            auth_id: authUser.id,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (updateError) throw updateError;
        console.log(`✅ Fixed auth_id for: ${user.email}`);
      } else {
        console.log(`⚠️ No auth user found for: ${user.email}`);
      }
    } catch (error) {
      console.error(`❌ Failed to fix user ${user.email}:`, error);
    }
  }
};

// FIXED: Create test users with proper linking
const createTestUsersWithAuth = async (): Promise<void> => {
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

  const serviceClient = getServiceRoleClient();

  for (const testUser of testUsers) {
    try {
      console.log(`👤 Creating user: ${testUser.email}`);

      // 1. Create user in Supabase Auth
      const { data: authData, error: authError } = await serviceClient.auth.admin.createUser({
        email: testUser.email,
        password: testUser.password,
        email_confirm: true,
        user_metadata: {
          name: testUser.name,
          position: testUser.position
        }
      });

      if (authError) {
        console.error(`❌ Auth creation failed for ${testUser.email}:`, authError);
        continue;
      }

      console.log(`✅ Auth user created: ${authData.user.id}`);

      // 2. Create user in our database WITH THE CORRECT AUTH_ID
      const { error: dbError } = await serviceClient
        .from('users')
        .insert({
          auth_id: authData.user.id, // THIS IS THE CRITICAL LINK
          email: testUser.email,
          name: testUser.name,
          position: testUser.position,
          status: 'active',
          progress: testUser.position === 'Admin' ? 100 : 0,
          acknowledged: false,
          registered_date: new Date().toISOString(),
          last_active: new Date().toISOString(),
          login_count: 0,
          visited_sections: [],
          test_results: {},
          section_visits: {}
        });

      if (dbError) {
        console.error(`❌ Database creation failed for ${testUser.email}:`, dbError);
        // Clean up auth user if database insert fails
        await serviceClient.auth.admin.deleteUser(authData.user.id);
      } else {
        console.log(`✅ Successfully created linked user: ${testUser.email}`);
      }
    } catch (error) {
      console.error(`❌ Unexpected error creating ${testUser.email}:`, error);
    }
  }
};

// FIXED: Sign in with comprehensive error handling
export const signInWithEmail = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    console.log(`🔐 Attempting sign in for: ${email}`);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error(`❌ Sign in failed for ${email}:`, error.message);
      throw error;
    }

    if (!data.user) {
      throw new Error('No user data returned from authentication');
    }

    console.log(`✅ Auth successful for: ${email}`);

    // Ensure database user exists and get profile
    const authUser = await ensureDatabaseUser(data.user);
    
    // Update login stats
    await supabase
      .from('users')
      .update({
        login_count: (authUser.loginCount || 0) + 1,
        last_active: new Date().toISOString()
      })
      .eq('auth_id', data.user.id);

    console.log(`✅ Sign in complete for: ${email}`);
    return { user: authUser, error: null };

  } catch (error: any) {
    console.error(`❌ Sign in error for ${email}:`, error.message);
    return { user: null, error: error.message || 'Sign in failed' };
  }
};

// FIXED: Registration with guaranteed database record creation
export const signUpWithEmail = async (
  email: string, 
  password: string, 
  userData: {
    name: string;
    position: 'Bartender' | 'Admin' | 'Trainee';
    code: string;
  }
): Promise<AuthResponse> => {
  const serviceClient = getServiceRoleClient();
  
  try {
    console.log(`👤 Starting registration for: ${email}`);
    
    // Validation
    if (!userData.code) throw new Error('Registration code is required');
    if (!APPROVED_CODES.includes(userData.code)) throw new Error('Invalid registration code');
    if (userData.position === 'Admin' && !ADMIN_CODES.includes(userData.code)) {
      throw new Error('Administrative positions require manager authorization codes');
    }

    const strengthError = validatePasswordStrength(password);
    if (strengthError) throw new Error(strengthError);

    console.log(`🔐 Creating Supabase Auth user: ${email}`);
    
    // 1. Create user in Supabase Auth
    const { data: authData, error: authError } = await serviceClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name: userData.name,
        position: userData.position
      }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('No user created in authentication');

    console.log(`✅ Auth user created: ${authData.user.id}`);

    // 2. Create user in our database WITH AUTH_ID
    console.log(`💾 Creating database record for: ${email}`);
    const { data: userProfile, error: profileError } = await serviceClient
      .from('users')
      .insert({
        auth_id: authData.user.id, // CRITICAL: Link to Auth user
        email,
        name: userData.name,
        position: userData.position,
        status: 'active',
        progress: 0,
        acknowledged: false,
        registered_date: new Date().toISOString(),
        last_active: new Date().toISOString(),
        login_count: 0,
        visited_sections: [],
        test_results: {},
        section_visits: {}
      })
      .select()
      .single();

    if (profileError) {
      console.error('❌ Database insert failed:', profileError);
      // Clean up auth user
      await serviceClient.auth.admin.deleteUser(authData.user.id);
      throw new Error(`Registration failed: ${profileError.message}`);
    }

    console.log(`✅ Database record created for: ${email}`);
    const authUser = convertToAuthUser(userProfile);
    
    console.log(`🎉 Registration successful for: ${email}`);
    return { user: authUser, error: null };

  } catch (error: any) {
    console.error(`❌ Registration failed for ${email}:`, error);
    return { user: null, error: error.message || 'Registration failed' };
  }
};

// ... (keep all your other functions the same - signOut, getCurrentSession, etc.)

export const signOut = async (): Promise<{ error: string | null }> => {
  try {
    const { error } = await supabase.auth.signOut();
    return { error: error?.message || null };
  } catch (error: any) {
    return { error: error.message || 'Sign out failed' };
  }
};

export const getCurrentSession = async (): Promise<AuthUser | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return null;
    }

    const authUser = await ensureDatabaseUser(session.user);
    return authUser;

  } catch (error) {
    console.error('Error getting current session:', error);
    return null;
  }
};

export const onAuthStateChange = (callback: (user: AuthUser | null) => void) => {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    console.log(`🔄 Auth state changed: ${event}`);
    
    if (event === 'SIGNED_IN' && session?.user) {
      try {
        const user = await ensureDatabaseUser(session.user);
        callback(user);
      } catch (error) {
        console.error('Error handling auth state change:', error);
        callback(null);
      }
    } else if (event === 'SIGNED_OUT') {
      callback(null);
    } else if (event === 'USER_UPDATED') {
      try {
        const user = await getCurrentSession();
        callback(user);
      } catch (error) {
        console.error('Error handling user update:', error);
        callback(null);
      }
    }
  });
};

// ===== CRUD OPERATIONS =====

// Get all users (for admin panel)
export const getAllUsers = async (): Promise<AuthUser[]> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('name');

    if (error) throw error;

    return (data || []).map((user: any) => convertToAuthUser(user));
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

// Update user (for admin panel)
export const updateUser = async (email: string, updates: Partial<AuthUser>): Promise<void> => {
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

// Delete user (for admin panel)
export const deleteUser = async (email: string): Promise<void> => {
  try {
    // First get the user to find their auth_id
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('auth_id')
      .eq('email', email)
      .single();

    if (fetchError) throw fetchError;

    // Delete from our database
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('email', email);

    if (deleteError) throw deleteError;

    // Also delete from Supabase Auth if auth_id exists
    if (user?.auth_id) {
      const serviceClient = getServiceRoleClient();
      await serviceClient.auth.admin.deleteUser(user.auth_id);
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Update user progress
export const updateUserProgress = async (email: string, progress: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('users')
      .update({
        progress: progress,
        updated_at: new Date().toISOString()
      })
      .eq('email', email);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating user progress:', error);
    throw error;
  }
};

// Track section visit
export const trackSectionVisit = async (email: string, sectionId: string): Promise<void> => {
  try {
    // First get current user to update their visited sections
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('visited_sections')
      .eq('email', email)
      .single();

    if (fetchError) throw fetchError;

    const visitedSections = user.visited_sections || [];
    const updatedSections = Array.from(new Set([...visitedSections, sectionId]));

    const { error: updateError } = await supabase
      .from('users')
      .update({
        visited_sections: updatedSections,
        updated_at: new Date().toISOString()
      })
      .eq('email', email);

    if (updateError) throw updateError;
  } catch (error) {
    console.error('Error tracking section visit:', error);
    throw error;
  }
};

// Submit acknowledgement
export const submitAcknowledgement = async (email: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('users')
      .update({
        acknowledged: true,
        acknowledgement_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('email', email);

    if (error) throw error;
  } catch (error) {
    console.error('Error submitting acknowledgement:', error);
    throw error;
  }
};

// Get user by email
export const getUserByEmail = async (email: string): Promise<AuthUser | null> => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) return null;

    return convertToAuthUser(user);
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
};

// Password reset functions
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

// Admin: Set temporary password
export const setTemporaryPassword = async (email: string, temporaryPassword: string): Promise<{ error: string | null }> => {
  try {
    const serviceClient = getServiceRoleClient();
    
    // Get the user by email first
    const { data: { users }, error: listError } = await serviceClient.auth.admin.listUsers();
    if (listError) throw listError;
    
    const user = users.find((u: any) => u.email === email);
    if (!user) {
      return { error: 'User not found' };
    }
    
    // Update the user's password
    const { error: updateError } = await serviceClient.auth.admin.updateUserById(
      user.id,
      { password: temporaryPassword }
    );

    if (updateError) throw updateError;
    
    return { error: null };
  } catch (error: any) {
    return { error: error.message || 'Failed to set temporary password' };
  }
};

// Send magic link for passwordless sign-in
export const sendMagicLink = async (email: string): Promise<{ error: string | null }> => {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    return { error: error?.message || null };
  } catch (error: any) {
    return { error: error.message || 'Failed to send magic link' };
  }
};

// Check if user exists
export const checkUserExists = async (email: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    return !error && !!data;
  } catch (error) {
    return false;
  }
};

// Helper function for generating temporary passwords
const generateTemporaryPassword = (): string => {
  return `Temp${Math.random().toString(36).slice(-10)}!`;
};