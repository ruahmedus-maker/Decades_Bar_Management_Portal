import { User, SessionData } from '@/types';
import { SECURITY_CONFIG } from './constants';
import { storage } from './storage';

// Define the RegistrationData interface here too
interface RegistrationData {
  name: string;
  email: string;
  position: 'Bartender' | 'Admin' | 'Trainee';
  code: string;
  password: string;
  confirmPassword: string;
}

// Fix the constants to be strongly typed
export const APPROVED_CODES: string[] = [
  "BARSTAFF2025", "DECADESADMIN"
];

export const ADMIN_CODES: string[] = [
  "DECADESADMIN"
];

export const hashPassword = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString();
};

export const validatePasswordStrength = (password: string): string | null => {
  const requirements = {
    length: password.length >= 6,
    hasNumber: /\d/.test(password),
    hasLetter: /[a-zA-Z]/.test(password)
  };

  if (!requirements.length) return 'Password must be at least 6 characters';
  if (!requirements.hasNumber) return 'Password must contain at least one number';
  if (!requirements.hasLetter) return 'Password must contain at least one letter';
  return null;
};

export const isAdmin = (user: User | null): boolean => {
  return user?.position === 'Admin';
};

export const validateSession = (): User | null => {
  const session = storage.getSession();
  if (!session) return null;

  // Check if session is expired
  if (new Date(session.expires) < new Date()) {
    storage.clearSession();
    return null;
  }

  // Verify user still exists in database
  const users = storage.getUsers();
  if (!users[session.user.email]) {
    storage.clearSession();
    return null;
  }

  return session.user;
};

export const startUserSession = (user: User): void => {
  const sessionData: SessionData = {
    user,
    loginTime: new Date().toISOString(),
    expires: new Date(Date.now() + SECURITY_CONFIG.sessionTimeout).toISOString()
  };
  storage.saveSession(sessionData);
};

export const endUserSession = (): void => {
  storage.clearSession();
};

export const performLogin = async (email: string, password: string): Promise<User> => {
  if (!email || !password) {
    throw new Error('Please enter both email and password');
  }

  const users = storage.getUsers();
  const user = users[email];

  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (user.status === 'blocked') {
    throw new Error('Account has been blocked. Please contact management.');
  }

  const hashedPassword = hashPassword(password);
  if (user.passwordHash !== hashedPassword) {
    throw new Error('Invalid email or password');
  }

  // Update user login stats
  user.loginCount = (user.loginCount || 0) + 1;
  user.lastActive = new Date().toISOString();
  storage.saveUsers(users);

  return user;
};

export const performRegistration = async (userData: RegistrationData): Promise<User> => {
  const { name, email, position, code, password, confirmPassword } = userData;

  // Validation
  if (!name || !email || !position || !code || !password || !confirmPassword) {
    throw new Error('Please fill in all fields');
  }

  if (password !== confirmPassword) {
    throw new Error('Passwords do not match');
  }

  const strengthError = validatePasswordStrength(password);
  if (strengthError) {
    throw new Error(strengthError);
  }

  // Fixed: Remove type assertions
  if (!APPROVED_CODES.includes(code)) {
    throw new Error('Invalid registration code. Please contact your manager.');
  }

  // Admin registration safeguards
  if (position === 'Admin') {
    if (!ADMIN_CODES.includes(code)) {
      throw new Error('Administrative positions require manager authorization codes.');
    }
  }

  const users = storage.getUsers();

  // Check if user already exists
  if (users[email]) {
    throw new Error('This email is already registered.');
  }

  // Create new user
  const newUser: User = {
    name,
    email,
    position,
    status: 'active',
    registeredDate: new Date().toISOString(),
    progress: 0,
    acknowledged: false,
    passwordHash: hashPassword(password),
    loginCount: 0,
    lastActive: new Date().toISOString(),
    visitedSections: []
  };

  users[email] = newUser;
  storage.saveUsers(users);

  return newUser;
};