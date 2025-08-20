'use client'

import React, { useState, ReactNode, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';
import { getMenuSectionsForRole } from '../../config/menu-config';
import {
  Bell,
  Mail,
  HelpCircle,
  User,
  LogOut,
  ChevronDown,
  Settings
} from 'lucide-react';
import SidebarMenu from './SidebarMenu';
import Loading from '../common/Loading';
import { useRouter } from 'next/navigation';
import { useNotifications } from '@/hooks/useNotifications';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title, subtitle }) => {
  const { user, logout, isAuthenticated, isLoading } = useAuth(); // Fixed: use correct property names
  const { notifications, loading: notificationsLoading, error, refresh } = useNotifications();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // Set mounted state and initialize time
  React.useEffect(() => {
    setMounted(true);
    updateTime();
    const timeInterval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(timeInterval);
  }, []);

  const unreadNotifications = useMemo(() => {
    return notifications.filter(n => !n.read);
  }, [notifications]);

  const updateTime = () => {
    const now = new Date();
    const timeString = now.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: 'short'
    });
    setCurrentTime(timeString);
  };

  // Don't render until mounted to prevent SSR issues
  if (!mounted) {
    return null;
  }

  // Show loading while checking authentication
  if (isLoading) {
    return <Loading message="Loading dashboard..." fullScreen />;
  }

  // Show loading if not authenticated (will redirect to login)
  if (!isAuthenticated || !user) {
    return <Loading message="Redirecting to login..." fullScreen />;
  }

  // Get general menu items (notifications count, etc.)
  const generalItems = getMenuSectionsForRole(user.role)
    .find(section => section.id === 'common')?.items || [];

  const handleGeneralMenuClick = (href: string) => {
    if (href === '/dashboard/notifications') {
      setNotificationsOpen(!notificationsOpen);
    } else {
      router.push(href);
    }
  };

  const handleClickOutside = () => {
    setUserMenuOpen(false);
    setNotificationsOpen(false);
  };
  const handleNotify = () => {
    router.push("/dashboard/notifications")
  };

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      {/* Logo Section */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
        {!sidebarCollapsed && (
          <div className="flex items-center space-x-3">
            <div
              style={{ backgroundColor: colors.smart.blue }}
              className="w-9 h-9 rounded-lg flex items-center justify-center"
            >
              <img
                src="/smart_spend_logo.jpg"
                alt="Spending Logo"
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Smart Spendings</h2>
            </div>
          </div>
        )}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Dynamic Menu Component */}
      <SidebarMenu
        collapsed={sidebarCollapsed}
        onMenuClick={() => setSidebarOpen(false)}
        excludeGeneral={true}
      />
    </div>
  );

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        bg-white border-r border-gray-200 transition-all duration-300 flex-shrink-0
        ${sidebarCollapsed ? 'w-16' : 'w-64'}
        ${sidebarOpen ? 'fixed inset-y-0 left-0 z-50 lg:relative lg:z-auto' : 'hidden lg:block'}
      `}>
        <SidebarContent />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            {/* Left Side - Mobile menu button + Title */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Page Title */}
              <div>
                {title && <h1 className="text-xl font-semibold text-gray-900">{title}</h1>}
                {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
              </div>
            </div>

            {/* Right Side - General Menu Items + User Profile */}
            <div className="flex items-center space-x-2">
              {/* Current Time */}
              <div className="hidden md:block text-sm text-gray-600 px-3">
                {currentTime}
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => handleGeneralMenuClick('/dashboard/notifications')}
                  className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Notifications"
                >
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {unreadNotifications.length || 0}
                  </span>

                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                    </div>

                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`px-4 py-3 hover:bg-gray-50 ${!notification.read ? 'bg-gray-100' : ''}`}
                          >
                            <p className="text-sm text-gray-900">{notification.title}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(notification.timestamp).toLocaleString()}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-500">
                          No notifications found.
                        </div>
                      )}
                    </div>

                    <div className="px-4 py-2 border-t border-gray-200">
                      <button
                        className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                        onClick={handleNotify}
                      >
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* Help & Support */}
              <button
                onClick={() => handleGeneralMenuClick('/dashboard/support')}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Help & Support"
              >
                <HelpCircle size={20} />
              </button>

              {/* User Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                  </div>
                  <ChevronDown size={16} className="text-gray-400" />
                </button>

                {/* User Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-lg font-medium text-blue-600">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                          <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                          <p className="text-xs text-gray-400">{user?.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <button
                        onClick={() => {
                          handleGeneralMenuClick('/dashboard/user/profile');
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <User size={16} />
                        <span>My Profile</span>
                      </button>

                      <button
                        onClick={() => {
                          handleGeneralMenuClick('/dashboard/settings');
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings size={16} />
                        <span>Settings</span>
                      </button>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-200 py-1">
                      <button
                        onClick={async () => {
                          setUserMenuOpen(false);
                          await logout();
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area - Scrollable */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Click outside handlers */}
      {(userMenuOpen || notificationsOpen) && (
        <div
          className="fixed inset-0 z-20"
          onClick={handleClickOutside}
        />
      )}
    </div>
  );
};

export default DashboardLayout;