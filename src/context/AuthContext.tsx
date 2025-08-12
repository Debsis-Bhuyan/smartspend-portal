'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { useApolloClient } from '@apollo/client';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
// import { GET_CURRENT_USER, CurrentUserData } from '../graphql/queries/user.query';

interface User {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  role: 'admin' | 'user';
  roles: {
    id: string;
    name: string;
  }[];
}

interface LoginInput {
  identifier: string;
  password: string;
}

interface ForgotPasswordInput {
  identifier: string;
}

interface VerifyOTPInput {
  identifier: string;
  otp: string;
}

interface ResetPasswordInput {
  resetToken: string;
  newPassword: string;
  confirmPassword: string;
}
interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

const normalizeRole = (raw: string): 'admin' | 'user' => {
  switch (raw.toLowerCase()) {
    case 'admin':
    case 'ROLE_ADMIN':
      return 'admin';
    default:
      return 'user';
  }
};
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  loginWithCredentials: (input: LoginInput) => Promise<any>;
  registerWithCredentials: (input: RegisterInput) => Promise<any>;
  forgotPassword: (input: ForgotPasswordInput) => Promise<any>;
  verifyOTP: (input: VerifyOTPInput) => Promise<any>;
  resetPassword: (input: ResetPasswordInput) => Promise<any>;
  refreshToken: () => Promise<boolean>;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const currentPath = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_CORE_URL;
  const LOGIN_API_URL = `${API_BASE_URL}/api/auth/login`;
  const LOGOUT_API_URL = `${API_BASE_URL}/api/auth/logout`;
  const REFRESH_API_URL = `${API_BASE_URL}/api/auth/refresh`;
  const FORGOT_PASSWORD_API_URL = `${API_BASE_URL}/api/auth/forgot-password`;
  const VERIFY_OTP_API_URL = `${API_BASE_URL}/api/auth/verify-otp`;
  const GET_PROFILE_URL = `${API_BASE_URL}/api/auth/me`;
  const RESET_PASSWORD_API_URL = `${API_BASE_URL}/api/auth/reset-password`;

  // SSR-safe helper functions for token management
  const setTokens = (accessToken: string, refreshTokenValue: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshTokenValue);
    }
  };

  const getTokens = () => {
    if (typeof window === 'undefined') return { accessToken: null, refreshToken: null };
    return {
      accessToken: localStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken')
    };
  };

  const clearTokens = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  };

  // Transform GraphQL user data to our User interface
  const transformUser = (userData: any): User => {

    const roles: { id: string; name: string }[] = [];

    if (typeof userData.role === 'string') {
      const roleRegex = /Role\(id=(\d+), name=(ROLE_\w+)\)/g;
      let match;

      while ((match = roleRegex.exec(userData.role)) !== null) {
        const roleId = match[1];
        const roleName = match[2].replace('ROLE_', '').toLowerCase(); // e.g., "doctor"

        roles.push({
          id: roleId,
          name: roleName
        });
      }
    }
    const primaryRole = roles[0]?.name || 'user';
    const u = {
      id: userData?.id,
      userId: userData?.id.toString(),
      name: userData?.name,
      email: userData.email,
      phone: userData.phone || '',
      isActive: userData.is_active || true,
      role: normalizeRole(primaryRole),
      roles
    };
    setUser(u)
    setIsAuthenticated(true);
    return u;
  };

  // Get user profile using GraphQL
  const getUserProfile = async (): Promise<User | null> => {
    try {
      const { accessToken } = getTokens();

      if (!accessToken) {
        return null;
      }

      const response = await axios.post(GET_PROFILE_URL, {}, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      if (response?.data) {
        return transformUser(response.data);
      }

      return null;
    } catch (error: any) {
      console.log(error.message)
      return null;
    }
  };
  const registerWithCredentials = async (input: RegisterInput): Promise<any> => {
    try {
      setIsLoading(true);

      const response = await axios.post("http://localhost:8080/api/auth/register", {
        username: input.username,
        email: input.email,
        password: input.password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = response.data;

      if (data?.accessToken) {
        setTokens(data.accessToken, data.refreshToken || '');
        setIsAuthenticated(true);

        setTimeout(() => {
          const data = getUserProfile();
          if (!data) {
            setUser(null)
          }
        }, 1)
        return data;
      } else {
        throw new Error('Registration failed. Please try again.');
      }

    } catch (error: any) {
      console.log(error?.message);

      if (error.response?.status === 400) {
        throw new Error('Bad request. Please check your input.');
      } else if (error.response?.status === 409) {
        throw new Error('An account with this email or username already exists.');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }

      throw new Error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Login with credentials (email/phone/userId + password)
  const loginWithCredentials = async (input: LoginInput): Promise<any> => {
    try {
      setIsLoading(true);

      const response = await axios.post(LOGIN_API_URL, {
        email: input.identifier,
        password: input.password
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = response.data;
      if (data?.accessToken) {
        setTokens(data.accessToken, data.refreshToken || '');
        setIsAuthenticated(true);
        setTimeout(() => {
          const data = getUserProfile();
          if (!data) {
            setUser(null)
          }
        }, 1)
        return data;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error: any) {
      console.log(error?.message)
      if (error.response?.status === 401) {
        throw new Error('Invalid credentials. Please check your login details.');
      } else if (error.response?.status === 422) {
        throw new Error('Invalid input. Please check your credentials.');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
      throw new Error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Set user after successful login (for compatibility)
  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  // Logout
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);

      try {
        const { accessToken } = getTokens();
        if (accessToken) {
          await axios.post(LOGOUT_API_URL, {}, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            }
          });
        }
      } catch (error) {
        // Continue with logout even if API call fails
      }

      setUser(null);
      setIsAuthenticated(false);
      clearTokens();

      // await apolloClient.clearStore();

      if (mounted) {
        router.push('/login');
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      clearTokens();
      // await apolloClient.clearStore();
      if (mounted) {
        router.push('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot password
  const forgotPassword = async (input: ForgotPasswordInput): Promise<any> => {
    try {
      const response = await axios.post(FORGOT_PASSWORD_API_URL, {
        identifier: input.identifier
      });

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to send reset instructions.');
    }
  };

  // Verify OTP
  const verifyOTP = async (input: VerifyOTPInput): Promise<any> => {
    try {
      const response = await axios.post(VERIFY_OTP_API_URL, {
        identifier: input.identifier,
        otp: input.otp
      });

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Invalid or expired OTP.');
    }
  };

  // Reset password
  const resetPassword = async (input: ResetPasswordInput): Promise<any> => {
    try {
      const response = await axios.post(RESET_PASSWORD_API_URL, {
        reset_token: input.resetToken,
        password: input.newPassword,
        password_confirmation: input.confirmPassword
      });

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to reset password.');
    }
  };

  // Refresh access token
  const refreshToken = async (): Promise<boolean> => {
    try {
      const { refreshToken: refreshTokenValue } = getTokens();

      if (!refreshTokenValue) {
        return false;
      }

      const response = await axios.post(`${REFRESH_API_URL}?refreshToken=${refreshToken}`, {});
      if (response.data?.access_token) {
        const { access_token, refresh_token } = response.data;
        setTokens(access_token, refresh_token || refreshTokenValue);
        await getUserProfile();
      }

      return false;
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 422) {
        clearTokens();
        setUser(null);
        setIsAuthenticated(false);
      }

      return false;
    }
  };

  // Check authentication status
  const checkAuth = async (): Promise<boolean> => {
    try {
      const { accessToken, refreshToken: refreshTokenValue } = getTokens();

      if (!accessToken && !refreshTokenValue) {
        setIsAuthenticated(false);
        setUser(null);
        return false;
      }

      if (accessToken) {
        const userData = await getUserProfile();
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
          return true;
        }
      }

      if (refreshTokenValue) {
        const refreshed = await refreshToken();
        if (refreshed) {
          return true;
        }
      }

      setIsAuthenticated(false);
      setUser(null);
      clearTokens();
      return false;
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      clearTokens();
      return false;
    }
  };

  // Set mounted state on client-side mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize authentication only after component is mounted (client-side)
  useEffect(() => {
    if (!mounted) return;

    const initAuth = async () => {
      setIsLoading(true);

      try {
        await checkAuth();
      } catch (error) {
        // Handle error silently
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [mounted]);

  // Redirect logic - only run after mounted and auth is checked
  useEffect(() => {
    if (!mounted || isLoading) return;
    const isLoginPage = currentPath === '/login';
    const isPublicPage = ['/login', '/forgot-password'].includes(currentPath);

    if (!isAuthenticated && !isPublicPage) {
      router.push('/login');
    } else if (isAuthenticated && isLoginPage) {

      setTimeout(() => {
        if (user?.role) {
          switch (user.role) {
            case 'admin':
              router.push('/dashboard/admin');
              break;
            default:
              router.push('/dashboard/user');
          }
        }
      }, 100)
    }
  }, [isAuthenticated, isLoading, user?.role, mounted]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    loginWithCredentials,
    registerWithCredentials,
    forgotPassword,
    verifyOTP,
    resetPassword,
    refreshToken,
    checkAuth
  };

  // Don't render children until mounted on client-side to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};