export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  roles: string[];
  badge?: string;
  isImplemented?: boolean;
  children?: MenuItem[];
}

export interface MenuSection {
  id: string;
  title: string;
  items: MenuItem[];
  roles: string[];
}

export interface QuickAction {
  label: string;
  icon: string;
  action: string;
}

export type UserRole = 'admin' | 'user';

export const menuConfig: MenuSection[] = [
  {
    id: 'admin-main',
    title: 'Administration',
    roles: ['admin','user'],
    items: [
      {
        id: 'admin-dashboard',
        label: 'Admin Dashboard',
        icon: 'Settings',
        href: '/dashboard/admin',
        roles: ['admin'],
        isImplemented: true
      },
      {
        id: 'mis-dashboard',
        label: 'MIS Dashboard',
        icon: 'BarChart3',
        href: '/dashboard/admin/mis',
        roles: ['admin'],
        isImplemented: true
      },
      
    ]
  },
  {
    id: 'patient-management',
    title: 'Patient Management',
    roles: ['admin', 'user'],
    items: [
      {
        id: 'manual-registration',
        label: 'Registration Form',
        icon: 'ClipboardEdit',
        href: '/dashboard/registration/manual',
        roles: ['admin'],
        isImplemented: true
      },
      {
        id: 'view-all-patients',
        label: 'View All Patients',
        icon: 'Users',
        href: '/dashboard/patients/all',
        roles: ['admin'],
        isImplemented: true
      },
      
    ]
  },
  {
    id: 'admin-master',
    title: 'Master Maintenance',
    roles: ['admin'],
    items: [
      {
        id: 'employee-master',
        label: 'Employee Master',
        icon: 'UserCircle',
        href: '/dashboard/admin/master',
        roles: ['admin'],
        isImplemented: true
      },
      {
        id: 'dependent-master',
        label: 'Dependent Master',
        icon: 'Users',
        href: '/dashboard/admin/master/dependents',
        roles: ['admin'],
        isImplemented: true
      },
      {
        id: 'department-master',
        label: 'Department Master',
        icon: 'Building2',
        href: '/dashboard/admin/master/departments',
        roles: ['admin'],
        isImplemented: true
      },
      {
        id: 'medical-history-import',
        label: 'Medical History Import',
        icon: 'FileText',
        href: '/dashboard/admin/master/medical-history',
        roles: ['admin'],
        isImplemented: true
      },
    ]
  },
  {
    id: 'admin-doctor-management',
    title: 'Doctor Management',
    roles: ['admin'],
    items: [
      {
        id: 'view-all-doctors',
        label: 'View All Doctors',
        icon: 'Users',
        href: '/dashboard/doctors/all',
        roles: ['admin'],
        isImplemented: true
      },
      {
        id: 'create-doctor',
        label: 'Create Doctor',
        icon: 'UserPlus',
        href: '/dashboard/doctors/add',
        roles: ['admin'],
        isImplemented: true
      },
    ]
  },
  {
    id: 'admin-clinical-operations',
    title: 'Clinical Operations',
    roles: ['admin'],
    items: [
      {
        id: 'pme-management',
        label: 'PME / OHS Management',
        icon: 'Clipboard',
        href: '/dashboard/clinical/pme',
        roles: ['admin'],
        isImplemented: true
      },
      {
        id: 'vaccination-module',
        label: 'Vaccination Management',
        icon: 'Syringe',
        href: '/dashboard/clinical/vaccination',
        roles: ['admin'],
        isImplemented: true
      },
      {
        id: 'referral-management',
        label: 'Referral Management',
        icon: 'ArrowRightLeft',
        href: '/dashboard/clinical/referrals',
        roles: ['admin'],
        isImplemented: true
      },
      {
        id: 'medical-reimbursement',
        label: 'Medical Bill Reimbursement',
        icon: 'Receipt',
        href: '/dashboard/clinical/reimbursement',
        roles: ['admin'],
        isImplemented: true
      },
    ]
  },
  {
    id: 'admin-specialized-modules',
    title: 'Specialized Modules',
    roles: ['admin'],
    items: [
      {
        id: 'biomedical-engineering',
        label: 'Bio-Medical Engineering',
        icon: 'Wrench',
        href: '/dashboard/specialize/biomedical',
        roles: ['admin'],
        isImplemented: true
      },
      {
        id: 'waste-management',
        label: 'Waste Management',
        icon: 'Trash2',
        href: '/dashboard/specialize/waste-management',
        roles: ['admin'],
        isImplemented: true
      },
      {
        id: 'ambulance-service',
        label: 'Ambulance Service',
        icon: 'Truck',
        href: '/dashboard/specialize/ambulance',
        roles: ['admin'],
        isImplemented: true
      },
      {
        id: 'housekeeping',
        label: 'Housekeeping',
        icon: 'Sparkles',
        href: '/dashboard/specialize/housekeeping',
        roles: ['admin'],
        isImplemented: true
      },
      {
        id: 'mortuary',
        label: 'Mortuary Management',
        icon: 'Flower',
        href: '/dashboard/specialize/mortuary',
        roles: ['admin'],
        isImplemented: true
      },
      {
        id: 'token-queue-management',
        label: 'Queue Management',
        icon: 'Clock',
        href: '/dashboard/specialize/queue-management',
        roles: ['admin'],
        isImplemented: true
      },
    ]
  },
  {
    id: 'admin-telemedicine',
    title: 'Digital Health',
    roles: ['admin'],
    items: [
      {
        id: 'telemedicine-admin',
        label: 'Telemedicine Management',
        icon: 'Video',
        href: '/dashboard/digital/telemedicine',
        roles: ['admin'],
        isImplemented: true
      },
      {
        id: 'document-management',
        label: 'Document Management',
        icon: 'FolderOpen',
        href: '/dashboard/digital/documents',
        roles: ['admin'],
        isImplemented: true
      },
    ]
  },

  {
    id: 'admin-operations',
    title: 'Operations',
    roles: ['admin'],
    items: [
      {
        id: 'bed-management',
        label: 'Bed Management',
        icon: 'Bed',
        href: '/dashboard/operations/beds',
        roles: ['admin'],
        isImplemented: true
      },
      {
        id: 'inventory-management',
        label: 'Inventory',
        icon: 'Package',
        href: '/dashboard/operations/inventory',
        roles: ['admin'],
        isImplemented: true
      },
      {
        id: 'material-management',
        label: 'Material Management',
        icon: 'Box',
        href: '/dashboard/operations/materials',
        roles: ['admin'],
        isImplemented: true
      },
      {
        id: 'sub-store-management',
        label: 'Sub-Store Management',
        icon: 'Store',
        href: '/dashboard/operations/sub-stores',
        roles: ['admin'],
        isImplemented: true
      },
      {
        id: 'financial-reports',
        label: 'Financial Reports',
        icon: 'DollarSign',
        href: '/dashboard/operations/finance',
        roles: ['admin'],
        isImplemented: true
      },
      {
        id: 'backup-restore',
        label: 'Backup & Restore',
        icon: 'HardDrive',
        href: '/dashboard/operations/backup',
        roles: ['admin'],
        isImplemented: true
      },
      {
        id: 'complaints-management',
        label: 'Complaints Management',
        icon: 'MessageSquare',
        href: '/dashboard/operations/complaints',
        roles: ['admin'],
        isImplemented: true
      },
    ]
  },

  // User Menus
  {
    id: 'patient-main',
    title: 'My Health',
    roles: ['user'],
    items: [
      {
        id: 'patient-dashboard',
        label: 'My Dashboard',
        icon: 'Home',
        href: '/dashboard/user',
        roles: ['user'],
        isImplemented: true
      },
      {
        id: 'my-appointments',
        label: 'My Appointments',
        icon: 'CalendarDays',
        href: '/dashboard/my-appointments',
        roles: ['user'],
        isImplemented: false
      },
      {
        id: 'medical-records',
        label: 'Medical Records',
        icon: 'FolderOpen',
        href: '/dashboard/medical-records',
        roles: ['user'],
        isImplemented: false
      },
      {
        id: 'test-reports',
        label: 'Test Reports',
        icon: 'BarChart',
        href: '/dashboard/reports',
        roles: ['user'],
        isImplemented: false
      },
      {
        id: 'prescriptions-view',
        label: 'My Prescriptions',
        icon: 'Capsule',
        href: '/dashboard/my-prescriptions',
        roles: ['user'],
        isImplemented: false
      },
      {
        id: 'pme-schedule',
        label: 'PME Schedule',
        icon: 'Calendar',
        href: '/dashboard/patient/pme',
        roles: ['user'],
        isImplemented: false
      },
    ]
  },
  {
    id: 'patient-services',
    title: 'Services',
    roles: ['user'],
    items: [
      {
        id: 'billing',
        label: 'Billing',
        icon: 'Receipt',
        href: '/dashboard/billing',
        roles: ['user', 'admin'],
        isImplemented: false
      },
      {
        id: 'pharmacy-orders',
        label: 'Pharmacy Orders',
        icon: 'ShoppingCart',
        href: '/dashboard/pharmacy-orders',
        roles: ['user'],
        isImplemented: false
      },
      {
        id: 'telemedicine',
        label: 'Telemedicine',
        icon: 'Video',
        href: '/dashboard/telemedicine',
        roles: ['user'],
        isImplemented: false
      },
      {
        id: 'health-checkup',
        label: 'Health Checkup',
        icon: 'HeartHandshake',
        href: '/dashboard/health-checkup',
        roles: ['user'],
        isImplemented: false
      },
      {
        id: 'medical-reimbursement-patient',
        label: 'Medical Reimbursement',
        icon: 'Receipt',
        href: '/dashboard/patient/reimbursement',
        roles: ['user'],
        isImplemented: false
      },
    ]
  },

  {
    id: 'admin-security',
    title: 'Security & Access Control',
    roles: ['admin'],
    items: [
      {
        id: 'manage-roles',
        label: 'Role & Permissions',
        icon: 'Shield',
        href: '/dashboard/admin/permissions',
        roles: ['admin'],
        isImplemented: true
      },
      {
        id: 'user-management',
        label: 'User Management',
        icon: 'UserCog',
        href: '/dashboard/admin/users',
        roles: ['admin'],
        isImplemented: true
      },
      {
        id: 'system-logs',
        label: 'System Logs & Audit Trail',
        icon: 'FileCheck',
        href: '/dashboard/admin/system-logs',
        roles: ['admin'],
        isImplemented: true
      },
      {
        id: 'master-config',
        label: 'Master Config',
        icon: 'Cog',
        href: '/dashboard/admin/master-config',
        roles: ['admin'],
        isImplemented: true
      }
    ]
  },

  // Common Menus (All Roles)
  {
    id: 'common',
    title: 'General',
    roles: ['admin', 'user'],
    items: [
      {
        id: 'notifications',
        label: 'Notifications',
        icon: 'Bell',
        href: '/dashboard/notifications',
        roles: ['admin', 'user'],
        badge: '3',
        isImplemented: false
      },
      {
        id: 'messages',
        label: 'Messages',
        icon: 'Mail',
        href: '/dashboard/messages',
        roles: ['admin', 'user'],
        isImplemented: false
      },
      {
        id: 'help-support',
        label: 'Help & Support',
        icon: 'HelpCircle',
        href: '/dashboard/support',
        roles: ['admin', 'user'],
        isImplemented: false
      },
      {
        id: 'profile',
        label: 'My Profile',
        icon: 'User',
        href: '/dashboard/profile',
        roles: ['admin', 'user'],
        isImplemented: false
      }
    ]
  }
];

// Quick actions by role - Now properly typed and expanded
export const quickActions: Record<UserRole, QuickAction[]> = {
  admin: [
    { label: 'Emergency Alert', icon: 'AlertTriangle', action: 'emergency' },
    { label: 'SAP Sync Status', icon: 'RefreshCw', action: 'sap-sync' },
    { label: 'System Backup', icon: 'HardDrive', action: 'backup' },
    { label: 'Master Data Import', icon: 'Database', action: 'data-import' },
    { label: 'Manage Permissions', icon: 'Shield', action: 'permissions' },
    { label: 'QR Code Print', icon: 'QrCode', action: 'qr-print' },
    { label: 'Generate Reports', icon: 'FileText', action: 'reports' }
  ],

  user: [
    { label: 'Emergency Call', icon: 'Phone', action: 'emergency' },
    { label: 'Book Appointment', icon: 'Calendar', action: 'appointment' },
    { label: 'Contact Support', icon: 'PhoneCall', action: 'support' },
    { label: 'Health Summary', icon: 'Clipboard', action: 'health-summary' },
    { label: 'View Reports', icon: 'FileText', action: 'view-reports' },
    { label: 'Telemedicine', icon: 'Video', action: 'telemedicine' }
  ]
};

// Utility functions
export const getMenuSectionsForRole = (userRole: string): MenuSection[] => {
  return menuConfig.filter(section => 
    section.roles.includes(userRole)
  ).map(section => ({
    ...section,
    items: section.items.filter(item => 
      item.roles.includes(userRole)
    )
  })).filter(section => section.items.length > 0);
};

export const getQuickActionsForRole = (userRole: string): QuickAction[] => {
  return quickActions[userRole as UserRole] || [];
};

export const isMenuItemImplemented = (href: string): boolean => {
  const implementedPages = [
    '/dashboard/admin',
    '/dashboard/user',
    '/dashboard/admin/mis',
    '/dashboard/admin/master',
    '/dashboard/admin/master/dependents',
    '/dashboard/admin/master/departments',
    '/dashboard/admin/master/sap-sync',
    '/dashboard/admin/master/medical-history',
    '/dashboard/admin/master/migration-status',
    '/dashboard/admin/permissions',
    '/dashboard/admin/users',
    '/dashboard/admin/master-config',
    '/dashboard/admin/system-logs',
    '/dashboard/registration/manual',
    '/dashboard/patients/all',
    '/dashboard/registration/qr',
    '/dashboard/registration/smartcard',
    '/dashboard/registration/online',
    '/dashboard/operations/beds',
    '/dashboard/operations/inventory',
    '/dashboard/operations/materials',
    '/dashboard/operations/sub-stores',
    '/dashboard/operations/finance',
    '/dashboard/operations/backup',
    '/dashboard/operations/complaints',
    '/dashboard/clinical/pme',
    '/dashboard/clinical/vaccination',
    '/dashboard/clinical/referrals',
    '/dashboard/clinical/reimbursement',
    '/dashboard/specialize/biomedical',
    '/dashboard/specialize/waste-management',
    '/dashboard/specialize/ambulance',
    '/dashboard/specialize/housekeeping',
    '/dashboard/specialize/mortuary',
    '/dashboard/specialize/queue-management',
    '/dashboard/digital/telemedicine',
    '/dashboard/digital/documents',
    '/dashboard/lab/management',
    '/dashboard/lab/manage-tests',
    '/dashboard/lab/samples',
    '/dashboard/lab/results',
    '/dashboard/lab/machines',
    '/dashboard/doctors/all',
    '/dashboard/doctors/add',
    '/dashboard/pharmacy/inventory',
    '/dashboard/pharmacy/drug-lists',
  ];
  return implementedPages.includes(href);
};

// Get all menu items for a specific role (flattened)
export const getAllMenuItemsForRole = (userRole: string): MenuItem[] => {
  const sections = getMenuSectionsForRole(userRole);
  return sections.flatMap(section => section.items);
};

// Find menu item by href
export const findMenuItemByHref = (href: string): MenuItem | undefined => {
  for (const section of menuConfig) {
    const item = section.items.find(item => item.href === href);
    if (item) return item;
  }
  return undefined;
};

// Get menu statistics
export const getMenuStats = () => {
  const totalItems = menuConfig.reduce((sum, section) => sum + section.items.length, 0);
  const implementedItems = menuConfig.reduce((sum, section) => 
    sum + section.items.filter(item => item.isImplemented).length, 0
  );
  
  return {
    total: totalItems,
    implemented: implementedItems,
    pending: totalItems - implementedItems,
    completionPercentage: Math.round((implementedItems / totalItems) * 100)
  };
};

export const getModulesByCategory = () => {
  return {
    'Core Administration': [
      'Master Maintenance',
      'Registration',
      'Security & Access Control',
      'Role Management',
      'System Integration'
    ],
    'Clinical Operations': [
      'Electronic Medical Records',
      'IP and OP Modules',
      'Doctor Module',
      'Nursing Module',
      'PME/OHS Management'
    ],
    'Diagnostics & Laboratory': [
      'Lab Management',
      'Radiology Module',
      'Blood Bank',
      'Pathology'
    ],
    'Pharmacy & Inventory': [
      'Pharmacy Management',
      'Material Management',
      'Sub-Store Management',
      'Inventory Management'
    ],
    'Specialized Services': [
      'Theatre Management',
      'Telemedicine',
      'Vaccination Module',
      'Bio-Medical Engineering',
      'Ambulance Service'
    ],
    'Financial & Billing': [
      'Billing and Invoicing',
      'Medical Bill Reimbursement',
      'PRMBS Integration',
      'Financial Reports'
    ],
    'Support Services': [
      'Waste Management',
      'Housekeeping',
      'Mortuary',
      'Queue Management',
      'Complaints Management'
    ],
    'Integration & Communication': [
      'SAP Integration',
      'ABDM Integration',
      'Document Management',
      'Patient Communication',
      'Mobile App Management'
    ]
  };
};

// Get compliance-related menu items
export const getComplianceMenuItems = (): MenuItem[] => {
  const complianceItems = [
    'abdm-integration',
    'audit-trail',
    'waste-management',
    'system-logs',
    'prmbs-integration'
  ];
  
  return menuConfig.flatMap(section => section.items)
    .filter(item => complianceItems.includes(item.id));
};

// Get critical modules that need immediate implementation
export const getCriticalModules = (): MenuItem[] => {
  const criticalModuleIds = [
    'qr-registration',
    'smartcard-registration',
    'photo-management',
    'qr-barcode-printing',
    'sap-integration',
    'pme-management',
    'emr-management',
    'lab-management',
    'pharmacy-dispensing',
    'telemedicine'
  ];
  
  return menuConfig.flatMap(section => section.items)
    .filter(item => criticalModuleIds.includes(item.id));
};

// New utility functions for permission management
export const getSecurityMenuItems = (): MenuItem[] => {
  const securitySection = menuConfig.find(section => section.id === 'admin-security');
  return securitySection?.items || [];
};

export const hasPermissionAccess = (userRole: string, requiredPermission: string): boolean => {
  // This would typically check against a more complex permission system
  // For now, only admins have access to permission management
  return userRole === 'admin';
};

// Get modules by implementation priority
export const getModulesByPriority = () => {
  return {
    'Phase 1 - Core Modules': [
      'Master Maintenance',
      'Registration (All Types)',
      'SAP Integration',
      'Photo Management',
      'QR/Barcode System'
    ],
    'Phase 2 - Clinical Modules': [
      'Electronic Medical Records',
      'Doctor Module',
      'Nursing Module',
      'IP/OP Management',
      'Lab Management'
    ],
    'Phase 3 - Specialized Modules': [
      'Pharmacy Management',
      'Radiology Module',
      'Blood Bank',
      'Theatre Management',
      'PME/OHS'
    ],
    'Phase 4 - Support & Integration': [
      'Telemedicine',
      'Mobile App',
      'ABDM Integration',
      'PRMBS Integration',
      'Advanced Analytics'
    ]
  };
};

// Get modules requiring hardware components
export const getHardwareRequiredModules = (): string[] => {
  return [
    'QR/Barcode Printing',
    'Registration Counters',
    'Lab Machine Interface',
    'Queue Management',
    'Radiology Module',
    'Photo Management'
  ];
};

// Get integration requirements
export const getIntegrationRequirements = () => {
  return {
    'SAP Integration': [
      'HR Module',
      'Materials Module', 
      'Finance Module',
      'Real-time Data Sync'
    ],
    'ABDM Integration': [
      'M1 Level Compliance',
      'M2 Level Compliance',
      'M3 Level Compliance'
    ],
    'Third Party': [
      'Pharmacy Stores',
      'PRMBS',
      'NABH Compliance',
      'External APIs'
    ]
  };
};