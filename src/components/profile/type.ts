export type UserRole = 'user' | 'admin';

export interface BaseUserProfile {
  id: string;
  role: UserRole;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    emergencyContacts: Array<{
      name: string;
      relationship: string;
      phone: string;
    }>;
    profilePhoto: string;
    dateOfBirth: string;
  };
  authentication: {
    lastLogin: string;
    twoFactorEnabled: boolean;
    sessionCount: number;
    passwordLastChanged: string;
  };
  preferences: {
    language: string;
    timezone: string;
    theme: 'light' | 'dark' | 'clinical';
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  activity: {
    loginHistory: Array<{
      date: string;
      device: string;
      location: string;
      ipAddress: string;
      duration: string;
    }>;
    recentActions: Array<{
      action: string;
      timestamp: string;
      details: string;
      category: 'clinical' | 'administrative' | 'communication' | 'system';
      status: 'completed' | 'pending' | 'failed';
    }>;
    platformLogs: Array<{
      timestamp: string;
      action: string;
      module: string;
      details: string;
      ipAddress: string;
      userAgent: string;
      duration?: string;
      affectedRecords?: string[];
    }>;
    dailyStats: {
      todayLogin: string;
      sessionsToday: number;
      actionsToday: number;
      timeSpentToday: string;
    };
  };
}


export interface PatientProfile extends BaseUserProfile {
  role: 'user';
  medicalHistory: {
    conditions: string[];
    allergies: string[];
    medications: Array<{
      name: string;
      dosage: string;
      frequency: string;
      prescribedBy: string;
    }>;
    familyHistory: string[];
  };
  currentCare: {
    assignedProviders: Array<{
      name: string;
      role: string;
      specialty: string;
    }>;
    upcomingAppointments: Array<{
      date: string;
      provider: string;
      type: string;
    }>;
    carePlan: string[];
  };
  vitals: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    weight: number;
    lastUpdated: string;
  };
  insurance: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
    coverageType: string;
    copay: number;
  };
}

export interface AdminProfile extends BaseUserProfile {
  role: 'admin';
  jobInfo: {
    position: string;
    department: string;
    supervisor: string;
    teamMembers: number;
    startDate: string;
  };
  systemAccess: {
    permissions: string[];
    systemRoles: string[];
    lastAudit: string;
    securityClearance: string;
  };
  performance: {
    kpis: Array<{
      metric: string;
      target: number;
      current: number;
    }>;
    goalCompletion: number;
    lastEvaluation: string;
  };
  management: {
    supervisedStaff: number;
    budgetResponsibility: number;
    currentProjects: string[];
  };
}

export type UserProfile =  PatientProfile | AdminProfile;
