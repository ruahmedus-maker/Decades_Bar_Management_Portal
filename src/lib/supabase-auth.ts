// lib/supabase-auth.ts - CORRECTED VERSION
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
  sessionTimeout: 24 * 60 * 60 * 1000 // 24 hours
};

export const APPROVED_CODES: string[] = [
  "BARSTAFF2025", "DECADESADMIN"
];

export const ADMIN_CODES: string[] = [
  "DECADESADMIN"
];

// Password strength validation (used by LogonBarrier)
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

// Admin check function
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
    // REMOVED: passwordHash since we're using Supabase Auth
    visitedSections: user.visited_sections || [],
    testResults: user.test_results || {},
    sectionVisits: user.section_visits || {}
  };
};

// Initialize authentication system
export const initializeAuth = async (): Promise<void> => {
  try {
    console.log('🔐 Initializing authentication system...');
    
    const serviceClient = getServiceRoleClient();

    // Check if we have any users in our database
    const { data: existingUsers, error } = await serviceClient
      .from('users')
      .select('id, email, auth_id')
      .limit(1);

    if (error) {
      console.error('❌ Database connection failed:', error);
      return;
    }

    // If no users exist, create test users with Supabase Auth
    if (!existingUsers || existingUsers.length === 0) {
      console.log('👥 No users found, creating test users...');
      await createTestUsersWithAuth();
    } else {
      console.log(`✅ Found ${existingUsers.length} existing user(s)`);
      
      // Check if existing users need auth_id linking
      const usersWithoutAuth = existingUsers.filter(user => !user.auth_id);
      if (usersWithoutAuth.length > 0) {
        console.log(`🔗 ${usersWithoutAuth.length} users need auth linking`);
        await linkExistingUsersToAuth();
      }
    }
  } catch (error) {
    console.error('❌ Auth initialization failed:', error);
  }
};

// Create test users with proper Supabase Auth integration
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

      // 2. Create user in our database (NO PASSWORD HASH NEEDED)
      const { error: dbError } = await serviceClient
        .from('users')
        .insert({
          auth_id: authData.user.id,
          email: testUser.email,
          name: testUser.name,
          position: testUser.position,
          status: 'active',
          progress: testUser.position === 'Admin' ? 100 : 0,
          acknowledged: false,
          registered_date: new Date().toISOString(),
          last_active: new Date().toISOString(),
          login_count: 0,
          // REMOVED: password_hash - Supabase Auth handles passwords
          visited_sections: [],
          test_results: {},
          section_visits: {}
        });

      if (dbError) {
        console.error(`❌ Database creation failed for ${testUser.email}:`, dbError);
        // Clean up auth user if database insert fails
        await serviceClient.auth.admin.deleteUser(authData.user.id);
      } else {
        console.log(`✅ Successfully created user: ${testUser.email}`);
      }
    } catch (error) {
      console.error(`❌ Unexpected error creating ${testUser.email}:`, error);
    }
  }
};

// Link existing database users to Supabase Auth
const linkExistingUsersToAuth = async (): Promise<void> => {
  const serviceClient = getServiceRoleClient();

  // Get users without auth_id
  const { data: usersWithoutAuth, error } = await serviceClient
    .from('users')
    .select('*')
    .is('auth_id', null);

  if (error || !usersWithoutAuth) {
    console.error('❌ Error fetching users without auth:', error);
    return;
  }

  console.log(`🔗 Linking ${usersWithoutAuth.length} users to Supabase Auth...`);

  for (const user of usersWithoutAuth) {
    try {
      // Check if auth user exists
      const { data: { users: authUsers }, error: listError } = await serviceClient.auth.admin.listUsers();
      if (listError) throw listError;
      
      const existingAuthUser = authUsers.find((au: any) => au.email === user.email);
      
      if (existingAuthUser) {
        // Link to existing auth user
        const { error: updateError } = await serviceClient
          .from('users')
          .update({ auth_id: existingAuthUser.id })
          .eq('id', user.id);

        if (updateError) throw updateError;
        console.log(`✅ Linked ${user.email} to existing auth user`);
      } else {
        // Create new auth user
        const password = generateTemporaryPassword();
        const { data: authData, error: createError } = await serviceClient.auth.admin.createUser({
          email: user.email,
          password: password,
          email_confirm: true,
          user_metadata: {
            name: user.name,
            position: user.position
          }
        });

        if (createError) throw createError;

        // Update database user with auth_id
        const { error: updateError } = await serviceClient
          .from('users')
          .update({ auth_id: authData.user.id })
          .eq('id', user.id);

        if (updateError) throw updateError;
        console.log(`✅ Created auth user for ${user.email}`);
      }
    } catch (error) {
      console.error(`❌ Failed to link ${user.email}:`, error);
    }
  }
};

const generateTemporaryPassword = (): string => {
  return `Temp${Math.random().toString(36).slice(-10)}!`;
};

// Core authentication functions
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

    // Get user profile from our database
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', data.user.id)
      .single();

    if (profileError) {
      console.error(`❌ User profile fetch failed for ${email}:`, profileError);
      throw new Error('User profile not found');
    }

    const authUser = convertToAuthUser(userProfile);
    
    // Update login stats
    await supabase
      .from('users')
      .update({
        login_count: (userProfile.login_count || 0) + 1,
        last_active: new Date().toISOString()
      })
      .eq('id', userProfile.id);

    console.log(`✅ Sign in complete for: ${email}`);
    return { user: authUser, error: null };

  } catch (error: any) {
    console.error(`❌ Sign in error for ${email}:`, error.message);
    return { user: null, error: error.message || 'Sign in failed' };
  }
};

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
    console.log(`👤 Attempting registration for: ${email}`);
    
    // Registration validations
    if (!userData.code) {
      throw new Error('Registration code is required');
    }

    if (!APPROVED_CODES.includes(userData.code)) {
      throw new Error('Invalid registration code. Please contact your manager.');
    }

    // Admin registration safeguards
    if (userData.position === 'Admin') {
      if (!ADMIN_CODES.includes(userData.code)) {
        throw new Error('Administrative positions require manager authorization codes.');
      }
    }

    // Validate password strength
    const strengthError = validatePasswordStrength(password);
    if (strengthError) {
      throw new Error(strengthError);
    }

    // 1. Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.name,
          position: userData.position
        }
      }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('No user created in authentication');

    // 2. Create user in our database (NO PASSWORD HASH NEEDED)
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .insert({
        auth_id: authData.user.id,
        email,
        name: userData.name,
        position: userData.position,
        status: 'active',
        progress: 0,
        acknowledged: false,
        registered_date: new Date().toISOString(),
        last_active: new Date().toISOString(),
        login_count: 0,
        // REMOVED: password_hash - Supabase Auth handles passwords
        visited_sections: [],
        test_results: {},
        section_visits: {}
      })
      .select()
      .single();

    if (profileError) {
      console.error(`❌ Database creation failed for ${email}:`, profileError);
      // Clean up auth user if database insert fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw profileError;
    }

    const authUser = convertToAuthUser(userProfile);
    
    console.log(`✅ Registration successful for: ${email}`);
    return { user: authUser, error: null };

  } catch (error: any) {
    console.error(`❌ Registration failed for ${email}:`, error.message);
    return { user: null, error: error.message || 'Registration failed' };
  }
};

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

    // Get user profile from our database
    const { data: userProfile, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', session.user.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return convertToAuthUser(userProfile);
  } catch (error) {
    console.error('Error getting current session:', error);
    return null;
  }
};

export const onAuthStateChange = (callback: (user: AuthUser | null) => void) => {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    console.log(`🔄 Auth state changed: ${event}`);
    
    if (event === 'SIGNED_IN' && session?.user) {
      const user = await getCurrentSession();
      callback(user);
    } else if (event === 'SIGNED_OUT') {
      callback(null);
    } else if (event === 'USER_UPDATED') {
      const user = await getCurrentSession();
      callback(user);
    }
  });
};

// Admin functions for user management
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

// Session validation using Supabase Auth (replaces localStorage validation)
export const validateSession = async (): Promise<AuthUser | null> => {
  return await getCurrentSession();
};