import { User, CounselingRecord, SessionData } from '@/types';

// Simple encryption/decryption for localStorage data
const encrypt = (data: string): string => {
  if (typeof window === 'undefined') return data;
  return btoa(unescape(encodeURIComponent(data)));
};

const decrypt = (encrypted: string): string => {
  if (typeof window === 'undefined') return encrypted;
  try {
    return decodeURIComponent(escape(atob(encrypted)));
  } catch {
    return '';
  }
};

export const storage = {
  // User management
  getUsers: (): Record<string, User> => {
    if (typeof window === 'undefined') return {};
    
    try {
      const encrypted = localStorage.getItem('decadesBarUsers');
      if (!encrypted) return {};
      
      const decrypted = decrypt(encrypted);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Error reading user database:', error);
      return {};
    }
  },

  saveUsers: (users: Record<string, User>): void => {
    if (typeof window === 'undefined') return;
    
    try {
      const encrypted = encrypt(JSON.stringify(users));
      localStorage.setItem('decadesBarUsers', encrypted);
    } catch (error) {
      console.error('Error saving user database:', error);
    }
  },

  // Session management
  getSession: (): SessionData | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const session = localStorage.getItem('currentSession');
      return session ? JSON.parse(session) : null;
    } catch {
      return null;
    }
  },

  saveSession: (session: SessionData): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('currentSession', JSON.stringify(session));
  },

  clearSession: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('currentSession');
  },

  // Counseling records
  getCounselings: (): CounselingRecord[] => {
    if (typeof window === 'undefined') return [];
    
    try {
      return JSON.parse(localStorage.getItem('decadesCounselings') || '[]');
    } catch {
      return [];
    }
  },

  saveCounselings: (counselings: CounselingRecord[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('decadesCounselings', JSON.stringify(counselings));
  },

  // Schedule
  getSchedule: (): string => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('decadesSchedule') || '';
  },

  saveSchedule: (schedule: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('decadesSchedule', schedule);
  },

  // Cleaning days
  getCleaningDays: (): string[] => {
    if (typeof window === 'undefined') return [];
    
    try {
      return JSON.parse(localStorage.getItem('decadesCleaningDays') || '[]');
    } catch {
      return [];
    }
  },

  saveCleaningDays: (days: string[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('decadesCleaningDays', JSON.stringify(days));
  }
};