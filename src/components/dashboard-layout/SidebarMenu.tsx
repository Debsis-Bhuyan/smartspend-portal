'use client'

import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowRightLeft,
  BarChart,
  BarChart3,
  Bed,
  Bell,
  Box,
  Boxes,
  Building2,
  Calendar,
  CalendarDays,
  Camera,
  ChevronRight,
  Clipboard,
  ClipboardEdit,
  Clock,
  Cog,
  CreditCard,
  Cross,
  Database,
  DollarSign,
  Download,
  Droplet,
  FileBarChart,
  FileCheck,
  FileText,
  Flower,
  FolderOpen,
  GitBranch,
  Globe,
  HardDrive,
  Heart,
  HeartHandshake,
  HelpCircle,
  Home,
  Link,
  LogOut,
  Mail,
  MessageSquare,
  Microscope,
  Monitor,
  Package,
  Phone,
  PhoneCall,
  Pill,
  Printer,
  QrCode,
  Receipt,
  RefreshCw,
  Scan,
  Scissors,
  Search,
  Settings,
  Shield,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Stethoscope,
  StickyNote,
  Store,
  Syringe,
  Tablets,
  TestTube,
  Trash2,
  Truck,
  User,
  UserCheck,
  UserCircle,
  UserCog,
  Users,
  Video,
  Wrench,
  UserPlus,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  getMenuSectionsForRole,
  isMenuItemImplemented,
  MenuItem,
  MenuSection
} from '../../config/menu-config';
import { useAuth } from '../../context/AuthContext';

interface SidebarMenuProps {
  collapsed: boolean;
  onMenuClick?: () => void;
  excludeGeneral?: boolean;
}

// Icon mapping object
const iconMap: { [key: string]: React.ComponentType<any> } = {
  Settings,
  BarChart3,
  ClipboardEdit,
  QrCode,
  CreditCard,
  Globe,
  MessageSquare,
  Printer,
  UserCircle,
  Users,
  RefreshCw,
  FileText,
  Download,
  Sparkles,
  Shield,
  UserCog,
  FileCheck,
  Cog,
  Bed,
  Package,
  DollarSign,
  HardDrive,
  Stethoscope,
  Calendar,
  Heart,
  Pill,
  UserCheck,
  TestTube,
  Scan,
  Microscope,
  FileBarChart,
  Cross,
  Building2,
  Activity,
  Syringe,
  Monitor,
  StickyNote,
  Clipboard,
  ArrowRightLeft,
  LogOut,
  Home,
  CalendarDays,
  FolderOpen,
  BarChart,
  Receipt,
  ShoppingCart,
  Video,
  HeartHandshake,
  Bell,
  Mail,
  HelpCircle,
  User,
  AlertTriangle,
  Database,
  Phone,
  Search,
  Clock,
  PhoneCall,
  Camera,
  Wrench,
  Trash2,
  Truck,
  Flower,
  Smartphone,
  Link,
  Box,
  Store,
  Boxes,
  Droplet,
  GitBranch,
  Scissors,
  AlertCircle,
  Tablets,
  UserPlus
};

const collapsibleSectionIds = [
  'admin-master',
  'admin-clinical-operations',
  'admin-specialized-modules',
  'admin-telemedicine',
  'admin-integrations',
  'admin-security',
  'nurse-care',
  'nurse-specialized',
  'patient-services',
  'lab-technician',
  'pharmacy-management',
  'blood-bank',
  'patient-management',
  'admin-doctor-management'
];

const SidebarMenu: React.FC<SidebarMenuProps> = ({ collapsed, onMenuClick, excludeGeneral = false }) => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const currentPath = usePathname();
  
  // Memoize menu sections to prevent unnecessary recalculations
  const menuSections = useMemo(() => {
    if (!user) return [];
    const sections = getMenuSectionsForRole(user.role);
    return excludeGeneral ? sections.filter(section => section.id !== 'common') : sections;
  }, [user, excludeGeneral]);

  // Calculate initial open sections synchronously
  const initialOpenSections = useMemo(() => {
    if (!user || !menuSections.length) return {};

    const initialState: { [key: string]: boolean } = {};

    collapsibleSectionIds.forEach(id => {
      initialState[id] = false;
    });

    // Find which section contains the current route and open it
    for (const section of menuSections) {
      if (collapsibleSectionIds.includes(section.id)) {
        const hasCurrentRoute = section.items.some(item => item.href === currentPath);
        if (hasCurrentRoute) {
          initialState[section.id] = true;
        }
      }
    }

    return initialState;
  }, [user, menuSections, currentPath]);

  const [openSections, setOpenSections] = useState(initialOpenSections);

  // Update open sections when route changes (only when necessary)
  useEffect(() => {
    if (!user || !menuSections.length) return;

    let needsUpdate = false;
    const updates: { [key: string]: boolean } = {};

    // Check if we need to open any section for the current route
    for (const section of menuSections) {
      if (collapsibleSectionIds.includes(section.id)) {
        const hasCurrentRoute = section.items.some(item => item.href === currentPath);
        if (hasCurrentRoute && !openSections[section.id]) {
          updates[section.id] = true;
          needsUpdate = true;
        }
      }
    }

    if (needsUpdate) {
      setOpenSections(prev => ({ ...prev, ...updates }));
    }
  }, [currentPath, user, menuSections, openSections]);

  const toggleSection = useCallback((sectionId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  }, []);

  // Helper function to render icon with improved fallback
  const renderIcon = useCallback((iconName: string, size: number = 18) => {
    const IconComponent = iconMap[iconName];
    if (!IconComponent) {
      return <Settings size={size} className="text-gray-400" />;
    }
    return <IconComponent size={size} />;
  }, []);

  const isCurrentRoute = useCallback((href: string) => {
    return currentPath === href;
  }, [currentPath]);

  const handleMenuItemClick = useCallback((item: MenuItem, event: React.MouseEvent) => {
    event.stopPropagation();

    if (isMenuItemImplemented(item.href)) {
      router.push(item.href);
    } else {
      alert(`${item.label} is not implemented yet. This module is part of requirements and will be developed in future phases.`);
    }

    if (collapsed) {
      onMenuClick?.();
    }
  }, [collapsed, onMenuClick, router]);

  // Early return if not authenticated or no user - prevents render flash
  if (!isAuthenticated || !user || !menuSections.length) {
    return null;
  }

  const MenuSectionComponent: React.FC<{ section: MenuSection }> = React.memo(({ section }) => {
    const isCollapsible = collapsibleSectionIds.includes(section.id);
    const isOpen = isCollapsible ? openSections[section.id] : true;

    return (
      <div className="mb-4">
        {!collapsed && (
          isCollapsible ? (
            <button
              className="flex items-center w-full text-left text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3 py-2 rounded-lg focus:outline-none transition-colors hover:bg-gray-100"
              onClick={() => toggleSection(section.id)}
              aria-expanded={isOpen}
              aria-controls={`section-items-${section.id}`}
            >
              <ChevronRight
                size={16}
                className={`transition-transform mr-2 ${isOpen ? 'rotate-90' : ''}`}
              />
              {section.title}
            </button>
          ) : (
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
              {section.title}
            </h3>
          )
        )}
        <div
          id={`section-items-${section.id}`}
          className={`space-y-1 transition-all duration-200 ease-in-out overflow-hidden ${isCollapsible && !isOpen ? 'max-h-0 py-0' : 'max-h-[2000px] py-1'
            }`}
        >
          {section.items.map((item) => (
            <button
              key={item.id}
              onClick={(event) => handleMenuItemClick(item, event)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-150 group ${isCurrentRoute(item.href)
                  ? 'bg-blue-100 text-blue-700 border border-blue-200 shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                } ${!item.isImplemented ? 'opacity-75' : ''}`}
              title={collapsed ? item.label : (item.isImplemented ? item.label : `${item.label} (Coming Soon)`)}
            >
              <span className="flex-shrink-0 group-hover:scale-110 transition-transform duration-150">
                {renderIcon(item.icon)}
              </span>
              {!collapsed && (
                <>
                  <span className="flex-1 font-medium text-sm">{item.label}</span>
                  <div className="flex items-center space-x-2">
                    {item.badge && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                        {item.badge}
                      </span>
                    )}
                    {!item.isImplemented && (
                      <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded font-medium">
                        Soon
                      </span>
                    )}
                  </div>
                </>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <nav className="flex-1 p-4 overflow-y-auto">
        {menuSections.map((section) => (
          <MenuSectionComponent key={section.id} section={section} />
        ))}
      </nav>
    </div>
  );
};

export default SidebarMenu;