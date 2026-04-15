// contexts/AppContext.tsx - RESTORED SIMPLE VERSION
'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '@/types';
import {
  initializeAuth,
  signInWithEmail,
  signUpWithEmail,
  signOut,
  getCurrentSession,
  onAuthStateChange
} from '@/lib/supabase-auth';
import { trackSectionVisit, submitAcknowledgement, getProgressBreakdown } from '@/lib/progress';

interface RegistrationData {
  name: string;
  email: string;
  position: 'Bartender' | 'Admin' | 'Trainee';
  code: string;
  password: string;
  confirmPassword: string;
}

interface AppContextType {
  currentUser: User | null;
  isLoading: boolean;
  activeSection: string;
  toast: {
    message: string;
    show: boolean;
  };
  userProgress: any;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegistrationData) => Promise<void>;
  logout: () => Promise<void>;
  setActiveSection: (section: string) => void;
  trackVisit: (sectionId: string) => void;
  submitAck: () => void;
  showToast: (message: string) => void;
  hideToast: () => void;
  isAdmin: boolean;
  refreshProgress: () => void;
  forceReset: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('welcome');
  const [toast, setToast] = useState({ message: '', show: false });
  const [userProgress, setUserProgress] = useState<any>(null);

  // Simple auth initialization - RESTORED WITH ROBUST ERROR HANDLING
  useEffect(() => {
    const initAuth = async () => {
      console.log('🚀 Starting auth initialization...');
      
      // 1) Safety Fallback Timeout: If Supabase/SW hangs for >15s, force load
      const timeoutId = setTimeout(() => {
        setIsLoading(prev => {
          if (prev) {
            console.warn('⚠️ Auth initialization TIMEOUT reached (15s). Forcing app load.');
          }
          return false;
        });
      }, 15000);

      try {
        console.log('📡 Calling initializeAuth()...');
        await initializeAuth();
        
        console.log('📡 Calling getCurrentSession()...');
        const user = await getCurrentSession();
        console.log('👤 Session state:', user ? `Logged in as ${user.email}` : 'Not logged in');
        
        setCurrentUser(user);
      } catch (error) {
        console.error('❌ Failed to initialize auth session:', error);
      } finally {
        clearTimeout(timeoutId);
        setIsLoading(false);
        console.log('✅ Initialization sequence complete, isLoading -> false');
      }
    };

    initAuth();

    // Listen for auth state changes
    const { data: { subscription } } = onAuthStateChange((user) => {
      setCurrentUser(user);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load user progress when currentUser changes
  useEffect(() => {
    if (currentUser) {
      refreshProgress();
    }
  }, [currentUser]);

  const showToast = (message: string) => {
    setToast({ message, show: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  const refreshProgress = async () => {
    if (currentUser) {
      try {
        const progress = await getProgressBreakdown(currentUser.email);
        setUserProgress(progress);
      } catch (error) {
        console.error('Error refreshing progress:', error);
      }
    }
  };

  const login = async (email: string, password: string) => {
    const { user, error } = await signInWithEmail(email, password);
    if (error) throw new Error(error);
    if (!user) throw new Error('Login failed');

    setCurrentUser(user);
    showToast(`Welcome back, ${user.name}!`);
  };

  const register = async (userData: RegistrationData) => {
    const { user, error } = await signUpWithEmail(
      userData.email,
      userData.password,
      {
        name: userData.name,
        position: userData.position,
        code: userData.code
      }
    );

    if (error) throw new Error(error);
    if (!user) throw new Error('Registration failed');

    setCurrentUser(user);
    showToast(`Welcome to Decades Bar, ${user.name}!`);
  };

  const forceReset = useCallback(async () => {
    console.warn('🚨 EMERGENCY RESET TRIGGERED');
    
    // 1. Clear all storage
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
      
      // 2. Unregister all service workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) await reg.unregister();
      }
      
      // 3. Clear all caches
      if ('caches' in window) {
        const names = await caches.keys();
        for (const name of names) await caches.delete(name);
      }
      
      // 4. Force reload to a clean URL
      window.location.href = window.location.origin + '?v=' + Date.now();
    }
  }, []);

  const logout = useCallback(async () => {
    const { error } = await signOut();
    if (error) {
      console.error('Logout error:', error);
    }
    setCurrentUser(null);
    setActiveSection('welcome');
    setUserProgress(null);
    showToast('Logged out successfully');
  }, [showToast]);

  const trackVisit = useCallback(async (sectionId: string) => {
    if (currentUser) {
      trackSectionVisit(currentUser.email, sectionId, 30)
        .then(() => refreshProgress())
        .catch(error => console.error('Error tracking visit:', error));
    }
  }, [currentUser]);

  const submitAck = async () => {
    if (currentUser) {
      try {
        await submitAcknowledgement(currentUser.email);
        await refreshProgress();
        showToast('Acknowledgement submitted successfully!');
      } catch (error) {
        console.error('Error submitting acknowledgement:', error);
        showToast('Error submitting acknowledgement');
      }
    }
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const value: AppContextType = {
    currentUser,
    isLoading,
    activeSection,
    toast,
    userProgress,
    login,
    register,
    logout,
    setActiveSection,
    trackVisit,
    submitAck,
    showToast,
    hideToast,
    isAdmin: currentUser?.position === 'Admin',
    refreshProgress,
    forceReset,
    isSidebarOpen,
    setIsSidebarOpen
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}