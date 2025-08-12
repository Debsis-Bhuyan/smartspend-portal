'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Loading from '../common/Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth(); // Changed from 'loading' to 'isLoading'
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Only run on client side to prevent SSR issues
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only run redirects after component is mounted and not loading
    if (mounted && !isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Redirect to unauthorized page or appropriate dashboard
        router.push('/unauthorized');
        return;
      }
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, router, mounted]);

  // Don't render anything until mounted (prevents SSR issues)
  if (!mounted) {
    return null;
  }

  // Show loading while checking authentication
  if (isLoading) {
    return <Loading message="Checking permissions..." fullScreen />;
  }

  // Show loading while redirecting (prevents flash)
  if (!isAuthenticated) {
    return <Loading message="Redirecting to login..." fullScreen />;
  }

  // Check role-based access
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <div className="mb-4">
            <svg className="mx-auto h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. Required role: {allowedRoles?.join(', ')}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.back()}
              className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={() => {
                // Redirect to appropriate dashboard based on user role
                switch (user?.role) {
                  case 'admin':
                    router.push('/dashboard/admin');
                    break;
                  default:
                    router.push('/dashboard/user');
                }
              }}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to My Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;