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

export interface CounselingRecord {
  employeeEmail: string;
  employeeName: string;
  type: 'verbal' | 'written' | 'suspension' | 'termination';
  date: string;
  reason: string;
  action: string;
  recordedBy: string;
  recordedDate: string;
}

export interface SessionData {
  user: User;
  loginTime: string;
  expires: string;
}