// components/ui/progress.tsx
import * as React from "react";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
}

export const Progress = ({ value = 0, max = 100, className, ...props }: ProgressProps) => {
  const percentage = Math.min(100, (value / max) * 100);

  return (
    <div className={`w-full h-2 bg-gray-200 rounded-full overflow-hidden ${className}`} {...props}>
      <div
        className="h-full bg-blue-600 transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
