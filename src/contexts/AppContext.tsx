// contexts/AppContext.tsx - UPDATED IMPORTS
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';
import { 
  initializeAuth, 
  signInWithEmail, 
  signUpWithEmail, 
  signOut, 
  getCurrentSession, 
  onAuthStateChange 
} from '@/lib/supabase-auth'; // ← Updated import
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('welcome');
  const [toast, setToast] = useState({ message: '', show: false });
  const [userProgress, setUserProgress] = useState<any>(null);

  // In AppContext.tsx - SIMPLIFIED
useEffect(() => {
  const initAuth = async () => {
    await initializeAuth();
    
    // Check for existing session
    const user = await getCurrentSession();
    setCurrentUser(user);
    setIsLoading(false);
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
    const { user, error } = await signInWithEmail(email, password); // ← Updated function
    if (error) throw new Error(error);
    if (!user) throw new Error('Login failed');
    
    setCurrentUser(user);
    showToast(`Welcome back, ${user.name}!`);
  };

  const register = async (userData: RegistrationData) => {
    const { user, error } = await signUpWithEmail( // ← Updated function
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

  const logout = async () => {
    const { error } = await signOut(); // ← Updated function
    if (error) {
      console.error('Logout error:', error);
    }
    setCurrentUser(null);
    setActiveSection('welcome');
    setUserProgress(null);
    showToast('Logged out successfully');
  };

  const trackVisit = async (sectionId: string) => {
    if (currentUser) {
      try {
        await trackSectionVisit(currentUser.email, sectionId);
        await refreshProgress();
      } catch (error) {
        console.error('Error tracking visit:', error);
        showToast('Error tracking progress');
      }
    }
  };

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
    refreshProgress
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