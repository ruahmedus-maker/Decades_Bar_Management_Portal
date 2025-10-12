// types.ts - Complete updated file with all interfaces
export interface User {
  name: string;
  email: string;
  position: 'Bartender' | 'Admin' | 'Trainee';
  status: 'active' | 'blocked';
  progress: number;
  acknowledged: boolean;
  acknowledgementDate?: string;
  registeredDate: string;
  lastActive: string;
  loginCount: number;
  passwordHash: string;
  visitedSections?: string[];
  testResults?: Record<string, TestResult>;
}

export interface RegistrationData {
  name: string;
  email: string;
  position: 'Bartender' | 'Admin' | 'Trainee';
  code: string;
  password: string;
  confirmPassword: string;
}

export interface TestResult {
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  date: string;
  testName: string;
}

export interface SessionData {
  user: User;
  loginTime: string;
}

export interface CounselingRecord {
  id: string;
  employeeEmail: string;
  employeeName: string;
  type: 'observation' | 'verbal' | 'written' | 'suspension' | 'termination';
  date: string;
  description: string;
  actionPlan: string;
  recordedBy: string;
  recordedDate: string;
  acknowledged?: boolean;
  acknowledgedDate?: string;
}

export interface EmployeeFolder {
  email: string;
  name: string;
  position: string;
  hireDate: string;
  counselingRecords: CounselingRecord[];
}