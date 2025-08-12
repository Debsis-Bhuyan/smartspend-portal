'use client'

import React, { useEffect, useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  X 
} from 'lucide-react';
import { useAlert } from '@/context/AlertContext';

const ToastNotifications: React.FC = () => {
  const { alerts, hideAlert } = useAlert();
  const [toastAlerts, setToastAlerts] = useState<any[]>([]);

  // Filter alerts that should be shown as toasts
  useEffect(() => {
    const toasts = alerts.filter(alert => alert.showToast);
    setToastAlerts(toasts);
  }, [alerts]);

  const getToastIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getToastColors = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  if (toastAlerts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toastAlerts.map((alert, index) => (
        <div
          key={alert.id}
          className={`transform transition-all duration-300 ease-in-out ${
            alert.isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          }`}
          style={{
            animationDelay: `${index * 100}ms`,
            animation: 'slideInRight 0.3s ease-out'
          }}
        >
          <div className={`
            max-w-sm w-full rounded-lg border shadow-lg p-4 
            ${getToastColors(alert.type)}
            backdrop-blur-sm
          `}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {getToastIcon(alert.type)}
              </div>
              <div className="flex-1 min-w-0">
                {alert.title && (
                  <h4 className="text-sm font-semibold mb-1">
                    {alert.title}
                  </h4>
                )}
                <p className="text-sm opacity-90">
                  {alert.message}
                </p>
              </div>
              <button
                onClick={() => hideAlert(alert.id)}
                className="flex-shrink-0 rounded-full p-1 hover:bg-white/20 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
      
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ToastNotifications;