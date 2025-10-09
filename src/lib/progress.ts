import { User } from '@/types';
import { storage } from './storage';

export const calculateProgress = (user: User): number => {
  const totalSections = 15;
  const visitedCount = user.visitedSections?.length || 0;
  const acknowledgementBonus = user.acknowledged ? 1 : 0;

  return Math.round(((visitedCount + acknowledgementBonus) / (totalSections + 1)) * 100);
};

export const trackSectionVisit = (userEmail: string, sectionId: string): void => {
  const users = storage.getUsers();
  const user = users[userEmail];

  if (!user) return;

  if (!user.visitedSections) {
    user.visitedSections = [];
  }

  if (!user.visitedSections.includes(sectionId)) {
    user.visitedSections.push(sectionId);
  }

  user.lastActive = new Date().toISOString();
  user.progress = calculateProgress(user);
  
  storage.saveUsers(users);
};

export const submitAcknowledgement = (userEmail: string): void => {
  const users = storage.getUsers();
  const user = users[userEmail];

  if (user) {
    user.acknowledged = true;
    user.acknowledgementDate = new Date().toISOString();
    user.progress = calculateProgress(user);
    storage.saveUsers(users);
  }
};