'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';
import { validateSession, endUserSession, performLogin, performRegistration } from '@/lib/auth';

import { trackSectionVisit, submitAcknowledgement } from '@/lib/progress';

interface RegistrationData {
  name: string;
  email: string;
  position: string;
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
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  setActiveSection: (section: string) => void;
  trackVisit: (sectionId: string) => void;
  submitAck: () => void;
  showToast: (message: string) => void;
  hideToast: () => void;
  isAdmin: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('welcome');
  const [toast, setToast] = useState({ message: '', show: false });

  useEffect(() => {
    // Check for existing session on mount
    const user = validateSession();
    setCurrentUser(user);
    setIsLoading(false);
  }, []);

  const showToast = (message: string) => {
    setToast({ message, show: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  const login = async (email: string, password: string) => {
    const user = await performLogin(email, password);
    setCurrentUser(user);
    showToast(`Welcome back, ${user.name}!`);
  };

  const register = async (userData: any) => {
    const user = await performRegistration(userData);
    setCurrentUser(user);
    showToast(`Welcome to Decades Bar, ${user.name}!`);
  };

  const logout = () => {
    endUserSession();
    setCurrentUser(null);
    setActiveSection('welcome');
    showToast('Logged out successfully');
  };

  const trackVisit = (sectionId: string) => {
    if (currentUser) {
      trackSectionVisit(currentUser.email, sectionId);
      // Update local state to trigger re-render
      setCurrentUser(prev => prev ? { ...prev } : null);
    }
  };

  const submitAck = () => {
    if (currentUser) {
      submitAcknowledgement(currentUser.email);
      setCurrentUser(prev => prev ? { ...prev, acknowledged: true, progress: 100 } : null);
      showToast('Acknowledgement submitted successfully!');
    }
  };

  const value: AppContextType = {
    currentUser,
    isLoading,
    activeSection,
    toast,
    login,
    register,
    logout,
    setActiveSection,
    trackVisit,
    submitAck,
    showToast,
    hideToast,
    isAdmin: currentUser?.position === 'Admin'
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