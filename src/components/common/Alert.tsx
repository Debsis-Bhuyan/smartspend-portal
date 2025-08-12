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

const Alert: React.FC = () => {
  const { alerts, hideAlert } = useAlert();
  const [animatingAlerts, setAnimatingAlerts] = useState<Set<string>>(new Set());

  // Filter alerts that should be shown as popup modals
  const popupAlerts = alerts.filter(alert => alert.showPopup);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'error':
        return <XCircle className="h-6 w-6 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case 'info':
        return <Info className="h-6 w-6 text-blue-500" />;
      default:
        return <Info className="h-6 w-6 text-gray-500" />;
    }
  };

  const getAlertColors = (type: string) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          button: 'bg-green-600 hover:bg-green-700',
          buttonSecondary: 'border-green-300 text-green-700 hover:bg-green-50'
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          button: 'bg-red-600 hover:bg-red-700',
          buttonSecondary: 'border-red-300 text-red-700 hover:bg-red-50'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          button: 'bg-yellow-600 hover:bg-yellow-700',
          buttonSecondary: 'border-yellow-300 text-yellow-700 hover:bg-yellow-50'
        };
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          button: 'bg-blue-600 hover:bg-blue-700',
          buttonSecondary: 'border-blue-300 text-blue-700 hover:bg-blue-50'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-800',
          button: 'bg-gray-600 hover:bg-gray-700',
          buttonSecondary: 'border-gray-300 text-gray-700 hover:bg-gray-50'
        };
    }
  };

  const handleClose = (alertId: string) => {
    setAnimatingAlerts(prev => new Set([...Array.from(prev), alertId]));
    setTimeout(() => {
      hideAlert(alertId);
      setAnimatingAlerts(prev => {
        const newSet = new Set(prev);
        newSet.delete(alertId);
        return newSet;
      });
    }, 200);
  };

  // Only render if there are popup alerts
  if (popupAlerts.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {popupAlerts.map((alert) => {
        const colors = getAlertColors(alert.type);
        const isAnimating = animatingAlerts.has(alert.id);
        
        return (
          <div key={alert.id} className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div 
              className={`absolute inset-0 bg-black transition-opacity duration-200 ${
                isAnimating ? 'opacity-0' : 'opacity-50'
              }`}
              onClick={() => !alert.showCancelButton && handleClose(alert.id)}
            />
            
            {/* Alert Modal */}
            <div className="relative flex min-h-full items-center justify-center p-4">
              <div 
                className={`relative transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-200 w-full max-w-md ${
                  isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
                }`}
              >
                {/* Header */}
                <div className={`${colors.bg} ${colors.border} border-b px-6 py-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getAlertIcon(alert.type)}
                      <h3 className={`text-lg font-semibold ${colors.text}`}>
                        {alert.title}
                      </h3>
                    </div>
                    {!alert.showCancelButton && (
                      <button
                        onClick={() => handleClose(alert.id)}
                        className="rounded-full p-1 hover:bg-white/50 transition-colors"
                      >
                        <X className="h-5 w-5 text-gray-500" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 py-4">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {alert.message}
                  </p>
                </div>

                {/* Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex gap-3 justify-end">
                    {alert.showCancelButton && (
                      <button
                        onClick={alert.onCancel}
                        className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${colors.buttonSecondary}`}
                      >
                        {alert.cancelButtonText || 'Cancel'}
                      </button>
                    )}
                    <button
                      onClick={alert.onConfirm || (() => handleClose(alert.id))}
                      className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${colors.button}`}
                    >
                      {alert.confirmButtonText || 'OK'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Alert;