// types.ts - Complete updated file with all interfaces
export interface User {
  id?: string;
  auth_id?: string;
  name: string;
  email: string;
  position: 'Bartender' | 'Admin' | 'Trainee';
  status: 'active' | 'blocked';
  progress: number;
  acknowledged: boolean;
  acknowledgementDate: string | null;
  registeredDate: string;
  lastActive: string;
  loginCount: number;
  passwordHash?: string;
  visitedSections: string[];
  testResults: any;
  sectionVisits: any;
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
  employeeSignature?: string; // Add this line
}

export interface EmployeeFolder {
  email: string;
  name: string;
  position: string;
  hireDate: string;
  counselingRecords: CounselingRecord[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed'; // Add status field
  completed: boolean; // Keep for backward compatibility
  completedAt: string | null;
  createdAt: string;
  eventId: string | null;
  priority: 'low' | 'medium' | 'high';
}

export interface SpecialEvent {
  id: string;
  name: string;
  date: string;
  theme: string;
  drinkSpecials: string;
  notes: string;
  tasks: Task[];
  createdAt: string;
  createdBy: string; // User email
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
}

export interface MaintenanceTicket {
  id: string;
  floor: '2000s' | '2010s' | 'Hip Hop' | 'Rooftop';
  location: string;
  title: string;
  description: string;
  reported_by: string;
  reported_by_email: string;
  status: 'open' | 'assigned' | 'in-progress' | 'completed' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface RealtimePayload {
  event: 'INSERT' | 'UPDATE' | 'DELETE';
  schema: string;
  table: string;
  record: MaintenanceTicket;
  old_record: MaintenanceTicket | null;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  category: 'opening' | 'bank' | 'cash' | 'during-shift' | 'closing';
}

export interface SectionVisit {
  sectionId: string;
  firstVisit: string;
  lastVisit: string;
  totalTime: number;
  completed: boolean;
  quizPassed?: boolean;
}

export interface CardProps {
  title: string;
  description?: string;
  items?: string[];
  footer?: {
    left: string;
    right: string;
  };
  index?: number;
  children?: React.ReactNode;
  glowColor?: string;
}

export interface GlasswareCardProps {
  title: string;
  primaryUse: string;
  includes: string[];
  note?: string | null;
  index: number;
}

export interface UniformCardProps {
  title: string;
  items: string[];
  index: number;
}

export interface SpecialCardProps {
  title: string;
  description?: string;
  specials: string[];
  hours: string;
  notes?: string;
  index: number;
}

export interface WeekDayProps {
  title: string;
  children: React.ReactNode;
  index: number;
  highlight?: string;
}

export interface ProgressItem {
  sectionId: string;
  sectionName: string;
  completed: boolean;
  progress: number;
  lastVisited?: string;
}

export interface SectionDetail {
  id: string;
  label: string;
  completed: boolean;
  timeSpent: number;
  timeRequired: number;
}

export interface ProgressBreakdown {
  progress: number;
  canAcknowledge: boolean;
  sectionDetails: SectionDetail[];
}

