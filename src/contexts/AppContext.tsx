// contexts/AppContext.tsx - UPDATED WITH BACKGROUND IMAGE MANAGEMENT
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
  // Background Image Management
  backgroundImages: string[];
  setBackgroundImages: (images: string[]) => void;
  uploadBackgroundImage: (file: File) => Promise<string>;
  deleteBackgroundImage: (imageUrl: string) => Promise<void>;
  // Auth & Progress Methods
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

// Default fallback images
const defaultBackgroundImages = [
  'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1556009127-85d6f4bce551?w=1920&h=1080&fit=crop',
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('welcome');
  const [toast, setToast] = useState({ message: '', show: false });
  const [userProgress, setUserProgress] = useState<any>(null);
  const [backgroundImages, setBackgroundImages] = useState<string[]>(defaultBackgroundImages);

  // Initialize auth and load saved background images
  useEffect(() => {
    const initApp = async () => {
      await initializeAuth();
      
      // Check for existing session
      const user = await getCurrentSession();
      setCurrentUser(user);

      // Load saved background images from localStorage
      const savedImages = localStorage.getItem('decades-background-images');
      if (savedImages) {
        try {
          const parsedImages = JSON.parse(savedImages);
          if (Array.isArray(parsedImages) && parsedImages.length > 0) {
            setBackgroundImages(parsedImages);
          }
        } catch (error) {
          console.error('Error loading saved background images:', error);
        }
      }

      setIsLoading(false);
    };

    initApp();

    // Listen for auth state changes
    const { data: { subscription } } = onAuthStateChange((user) => {
      setCurrentUser(user);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Save background images to localStorage whenever they change
  useEffect(() => {
    if (backgroundImages.length > 0) {
      localStorage.setItem('decades-background-images', JSON.stringify(backgroundImages));
    }
  }, [backgroundImages]);

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

  // Background Image Management Methods
  const uploadBackgroundImage = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const blob = await response.json();
      
      // Add new image to the beginning of the list
      const updatedImages = [blob.url, ...backgroundImages];
      setBackgroundImages(updatedImages);
      
      return blob.url;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const deleteBackgroundImage = async (imageUrl: string) => {
    try {
      // Remove from local state
      const updatedImages = backgroundImages.filter(img => img !== imageUrl);
      setBackgroundImages(updatedImages);

      // If we're deleting the last image, restore defaults
      if (updatedImages.length === 0) {
        setBackgroundImages(defaultBackgroundImages);
      }

      // Note: In a production app, you'd also call a DELETE API route
      // to remove the file from Vercel Blob storage
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
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

  const logout = async () => {
    const { error } = await signOut();
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
    // Background Image Management
    backgroundImages,
    setBackgroundImages,
    uploadBackgroundImage,
    deleteBackgroundImage,
    // Auth & Progress Methods
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