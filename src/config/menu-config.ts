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
    roles: ['admin', 'user'],
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
    id: 'home',
    title: 'My Dashboard',
    roles: ['user', 'admin'],
    items: [
      {
        id: 'dash',
        label: 'Dashboard',
        icon: 'Home',
        href: '/dashboard',
        roles: ['user', 'admin'],
        isImplemented: true
      },
      {
        id: 'dashboard',
        label: 'My Dashboard',
        icon: 'Home',
        href: '/dashboard/user',
        roles: ['user', 'admin'],
        isImplemented: true
      },
      {
        id: 'transactions',
        label: 'Transactions',
        icon: 'Calendar',
        href: '/dashboard/transactions',
        roles: ['user', 'admin'],
        isImplemented: true
      },
      {
        id: 'budget',
        label: 'My Budget',
        icon: 'Home',
        href: '/dashboard/budget',
        roles: ['user', 'admin'],
        isImplemented: true
      },
      {
        id: 'notifications',
        label: 'My Notifications',
        icon: 'Bell',
        href: '/dashboard/notifications',
        roles: ['user', 'admin'],
        isImplemented: true
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
        href: '/dashboard/user/profile',
        roles: ['admin', 'user'],
        isImplemented: true
      }
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

  {
    id: 'common',
    title: 'General',
    roles: ['user', 'admin'],
    items: [
      {
        id: 'notifications',
        label: 'My Notifications',
        icon: 'Bell',
        href: '/dashboard/notifications',
        roles: ['user', 'admin'],
        isImplemented: true
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
        isImplemented: true
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
    '/dashboard',
    '/dashboard/admin',
    '/dashboard/user',
    '/dashboard/notifications',
    '/dashboard/transactions',
    '/dashboard/user/profile',
    '/dashboard/budget'

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

