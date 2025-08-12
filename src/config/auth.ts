// utils/auth.ts
import { ApolloError } from '@apollo/client';

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

export const parseAuthError = (error: ApolloError): string => {
  // Handle GraphQL errors
  if (error.graphQLErrors && error.graphQLErrors.length > 0) {
    const graphQLError = error.graphQLErrors[0];
    
    // Handle validation errors
    if (graphQLError.extensions?.validation) {
      const validation = graphQLError.extensions.validation as Record<string, string[]>;
      const firstField = Object.keys(validation)[0];
      const firstError = validation[firstField][0];
      return firstError || 'Validation error occurred';
    }
    
    // Handle other GraphQL errors
    return graphQLError.message || 'An error occurred';
  }
  
  // Handle network errors
  if (error.networkError) {
    if ('statusCode' in error.networkError) {
      const statusCode = (error.networkError as any).statusCode;
      switch (statusCode) {
        case 401:
          return 'Invalid credentials. Please check your login details.';
        case 403:
          return 'Access denied. You do not have permission to access this resource.';
        case 404:
          return 'Service not found. Please try again later.';
        case 429:
          return 'Too many requests. Please wait a moment before trying again.';
        case 500:
          return 'Server error. Please try again later.';
        default:
          return 'Network error. Please check your connection and try again.';
      }
    }
    return 'Network error. Please check your connection and try again.';
  }
  
  // Fallback error message
  return error.message || 'An unexpected error occurred. Please try again.';
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    return true; // If we can't parse the token, consider it expired
  }
};

export const getTokenPayload = (token: string): any => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (error) {
    return null;
  }
};

export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Format as Indian phone number if it looks like one
  if (digitsOnly.length === 10) {
    return digitsOnly.replace(/(\d{5})(\d{5})/, '$1-$2');
  }
  
  // Return as-is if not a standard format
  return phone;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile number format
  const digitsOnly = phone.replace(/\D/g, '');
  return phoneRegex.test(digitsOnly);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  if (password.length > 50) {
    errors.push('Password must be less than 50 characters long');
  }
  
  if (!/[A-Za-z]/.test(password)) {
    errors.push('Password must contain at least one letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const getRedirectPath = (userRole: string): string => {
  switch (userRole.toLowerCase()) {
    case 'admin':
      return '/dashboard/admin';
    case 'doctor':
      return '/dashboard/doctor';
    case 'nurse':
      return '/dashboard/nurse';
    case 'patient':
      return '/dashboard/patient';
    default:
      return '/dashboard';
  }
};

// Storage helpers that work both client and server side
export const setAuthTokens = (accessToken: string, refreshToken: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }
};

export const getAuthTokens = () => {
  if (typeof window === 'undefined') {
    return { accessToken: null, refreshToken: null };
  }
  
  return {
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken')
  };
};

export const clearAuthTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
};

// Rate limiting for authentication attempts
export class AuthRateLimiter {
  private attempts: { [key: string]: number } = {};
  private lastAttempt: { [key: string]: number } = {};
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts = 5, windowMs = 15 * 60 * 1000) { // 5 attempts per 15 minutes
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  canAttempt(identifier: string): boolean {
    const now = Date.now();
    const lastAttemptTime = this.lastAttempt[identifier] || 0;
    
    // Reset if window has passed
    if (now - lastAttemptTime > this.windowMs) {
      this.attempts[identifier] = 0;
    }
    
    return (this.attempts[identifier] || 0) < this.maxAttempts;
  }

  recordAttempt(identifier: string): void {
    const now = Date.now();
    this.lastAttempt[identifier] = now;
    this.attempts[identifier] = (this.attempts[identifier] || 0) + 1;
  }

  getRemainingAttempts(identifier: string): number {
    return Math.max(0, this.maxAttempts - (this.attempts[identifier] || 0));
  }

  getTimeUntilReset(identifier: string): number {
    const lastAttemptTime = this.lastAttempt[identifier] || 0;
    const timePassed = Date.now() - lastAttemptTime;
    return Math.max(0, this.windowMs - timePassed);
  }
}

export const validateZipCode = (zip: string): boolean => {
  // Accepts US 5-digit, US ZIP+4, or Indian 6-digit PIN codes
  const zipRegex = /^(\d{5}(-\d{4})?|\d{6})$/;
  return zipRegex.test(zip.trim());
};