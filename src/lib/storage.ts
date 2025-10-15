// storage.ts - Fixed without this keyword issues
import { User, CounselingRecord, SessionData, EmployeeFolder } from '@/types';

export const storage = {
  // User management - WITHOUT encryption to fix progress tracking
  getUsers: (): Record<string, User> => {
    if (typeof window === 'undefined') return {};
    
    try {
      const usersJson = localStorage.getItem('decadesBarUsers');
      if (!usersJson) return {};
      
      return JSON.parse(usersJson);
    } catch (error) {
      console.error('Error reading user database:', error);
      return {};
    }
  },

  saveUsers: (users: Record<string, User>): void => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem('decadesBarUsers', JSON.stringify(users));
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

  // Employee folders and counseling management
  getEmployeeFolders: (): EmployeeFolder[] => {
    if (typeof window === 'undefined') return [];
    
    try {
      const users = storage.getUsers();
      const counselings = storage.getCounselings();
      
      return Object.values(users)
        .filter(user => user.position !== 'Admin')
        .map(user => {
          const employeeCounselings = counselings.filter((c: CounselingRecord) => 
            c.employeeEmail === user.email
          );
          
          return {
            email: user.email,
            name: user.name,
            position: user.position,
            hireDate: user.registeredDate,
            counselingRecords: employeeCounselings
          };
        });
    } catch (error) {
      console.error('Error reading employee folders:', error);
      return [];
    }
  },

  saveCounselingRecord: (record: CounselingRecord): void => {
    if (typeof window === 'undefined') return;
    
    try {
      const counselings = storage.getCounselings();
      counselings.push(record);
      storage.saveCounselings(counselings);
    } catch (error) {
      console.error('Error saving counseling record:', error);
    }
  },

  acknowledgeCounselingRecord: (recordId: string): void => {
    if (typeof window === 'undefined') return;
    
    try {
      const counselings = storage.getCounselings();
      const record = counselings.find((c: CounselingRecord) => c.id === recordId);
      if (record) {
        record.acknowledged = true;
        record.acknowledgedDate = new Date().toISOString();
        storage.saveCounselings(counselings);
      }
    } catch (error) {
      console.error('Error acknowledging counseling record:', error);
    }
  },

  getCounselingRecords: (): CounselingRecord[] => {
    return storage.getCounselings();
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
  },

  // Migration helper - if you had encrypted data, this will convert it
  migrateFromEncrypted: (): void => {
    if (typeof window === 'undefined') return;
    
    try {
      const encrypted = localStorage.getItem('decadesBarUsers');
      if (!encrypted) return;
      
      // Check if it's base64 encoded (encrypted)
      const isBase64 = /^[A-Za-z0-9+/]*={0,2}$/.test(encrypted) && encrypted.length % 4 === 0;
      
      if (isBase64) {
        console.log('Migrating from encrypted data...');
        try {
          // Try to decrypt
          const decrypted = decodeURIComponent(escape(atob(encrypted)));
          const users = JSON.parse(decrypted);
          // Save without encryption
          localStorage.setItem('decadesBarUsers', JSON.stringify(users));
          console.log('Successfully migrated from encrypted data');
        } catch (e) {
          console.error('Failed to decrypt existing data, starting fresh');
          localStorage.removeItem('decadesBarUsers');
        }
      }
    } catch (error) {
      console.error('Error during migration:', error);
    }
  }
};