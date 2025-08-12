// components/Loading.tsx
import React from 'react';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ 
  message = "Loading...", 
  fullScreen = false 
}) => {
  const containerClass = fullScreen 
    ? "fixed inset-0 bg-white bg-opacity-90 z-50 flex items-center justify-center"
    : "flex items-center justify-center p-8";

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-blue-400 rounded-full animate-ping"></div>
        </div>
        <p className="text-gray-600 text-sm font-medium">{message}</p>
      </div>
    </div>
  );
};

export default Loading;