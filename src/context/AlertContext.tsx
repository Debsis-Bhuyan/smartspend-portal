'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface AlertOptions {
  title?: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number; // Auto-close duration in milliseconds (0 = no auto-close)
  showCancelButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  showPopup?: boolean; // New flag to control popup display
  showToast?: boolean; // New flag to control toast display
}

interface AlertState extends AlertOptions {
  id: string;
  isVisible: boolean;
}

interface AlertContextType {
  showAlert: (options: AlertOptions) => Promise<boolean>;
  showSuccess: (message: string, title?: string, duration?: number, showPopup?: boolean) => void;
  showError: (message: string, title?: string, showPopup?: boolean) => void;
  showWarning: (message: string, title?: string, showPopup?: boolean) => void;
  showInfo: (message: string, title?: string, duration?: number, showPopup?: boolean) => void;
  showConfirm: (message: string, title?: string, options?: Partial<AlertOptions>) => Promise<boolean>;
  hideAlert: (id?: string) => void;
  alerts: AlertState[];
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alerts, setAlerts] = useState<AlertState[]>([]);

  const generateId = () => `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const showAlert = useCallback((options: AlertOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      const id = generateId();
      
      // Default behavior: if showPopup is not specified, use legacy logic
      let finalShowPopup = options.showPopup;
      let finalShowToast = options.showToast;
      
      // If neither is specified, use legacy defaults
      if (finalShowPopup === undefined && finalShowToast === undefined) {
        if (options.type === 'success' || options.type === 'info') {
          finalShowPopup = false;
          finalShowToast = true;
        } else {
          finalShowPopup = true;
          finalShowToast = false;
        }
      }
      
      // If only one is specified, default the other to false
      if (finalShowPopup === undefined) finalShowPopup = false;
      if (finalShowToast === undefined) finalShowToast = false;

      const alert: AlertState = {
        ...options,
        id,
        isVisible: true,
        showPopup: finalShowPopup,
        showToast: finalShowToast,
      };

      setAlerts(prev => [...prev, alert]);

      // Auto-close if duration is specified and it's a toast
      if (options.duration && options.duration > 0 && finalShowToast) {
        setTimeout(() => {
          hideAlert(id);
        }, options.duration);
      }

      // Handle confirmation for popup alerts
      if (finalShowPopup && (options.showCancelButton || options.onConfirm || options.onCancel)) {
        const originalOnConfirm = options.onConfirm;
        const originalOnCancel = options.onCancel;

        alert.onConfirm = async () => {
          if (originalOnConfirm) {
            await originalOnConfirm();
          }
          hideAlert(id);
          resolve(true);
        };

        alert.onCancel = () => {
          if (originalOnCancel) {
            originalOnCancel();
          }
          hideAlert(id);
          resolve(false);
        };
      } else {
        // For non-interactive alerts, resolve immediately
        resolve(true);
      }
    });
  }, []);

  const hideAlert = useCallback((id?: string) => {
    if (id) {
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    } else {
      setAlerts([]);
    }
  }, []);

  const showSuccess = useCallback((
    message: string, 
    title = 'Success', 
    duration = 3000, 
    showPopup = false
  ) => {
    showAlert({
      type: 'success',
      title,
      message,
      duration,
      showPopup,
      showToast: true, // Always show toast for success
    });
  }, [showAlert]);

  const showError = useCallback((
    message: string, 
    title = 'Error', 
    showPopup = true
  ) => {
    showAlert({
      type: 'error',
      title,
      message,
      duration: 0,
      showPopup,
      showToast: !showPopup, // Show toast if not showing popup
    });
  }, [showAlert]);

  const showWarning = useCallback((
    message: string, 
    title = 'Warning', 
    showPopup = true
  ) => {
    showAlert({
      type: 'warning',
      title,
      message,
      duration: 0,
      showPopup,
      showToast: !showPopup, // Show toast if not showing popup
    });
  }, [showAlert]);

  const showInfo = useCallback((
    message: string, 
    title = 'Information', 
    duration = 4000, 
    showPopup = false
  ) => {
    showAlert({
      type: 'info',
      title,
      message,
      duration,
      showPopup,
      showToast: true, // Always show toast for info
    });
  }, [showAlert]);

  const showConfirm = useCallback((
    message: string, 
    title = 'Confirm Action', 
    options: Partial<AlertOptions> = {}
  ): Promise<boolean> => {
    return showAlert({
      type: 'warning',
      title,
      message,
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      showPopup: true, // Always show popup for confirmations
      showToast: false,
      ...options,
    });
  }, [showAlert]);

  const value: AlertContextType = {
    showAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
    hideAlert,
    alerts,
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
    </AlertContext.Provider>
  );
};