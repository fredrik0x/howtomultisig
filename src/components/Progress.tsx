
import React from 'react';
import { Progress as ProgressBar } from '@/components/ui/progress';
import { useChecklist } from '@/context/ChecklistContext';
import { AlertTriangle } from 'lucide-react';

interface ProgressProps {
  section?: string;
  showPercentage?: boolean;
  showFraction?: boolean;
  showCritical?: boolean;
  className?: string;
  isScrolled?: boolean;
  isMobile?: boolean;
}

const Progress: React.FC<ProgressProps> = ({
  section,
  showPercentage = true,
  showFraction = true,
  showCritical = false,
  className = '',
  isScrolled = false,
  isMobile = false,
}) => {
  const { getProgress, getTotalProgress, getCriticalProgress } = useChecklist();
  
  const progress = section 
    ? getProgress(section) 
    : getTotalProgress();
    
  const criticalProgress = getCriticalProgress();

  // Calculate the color based on the percentage
  const getProgressColor = () => {
    if (progress.percentage < 30) return 'bg-red-500';
    if (progress.percentage < 70) return 'bg-amber-500';
    return 'bg-green-500';
  };

  const colorClass = getProgressColor();

  return (
    <div className={`${className}`}>
      <div className="flex justify-between items-center mb-1">
        {showFraction && (
          <div className={`text-sm bg-transparent print:text-gray-700 text-slate-900 ${isMobile ? 'dark:text-slate-900' : 'dark:text-white'}`}>
            <span className={`font-medium print:text-black text-slate-900 ${isMobile ? 'dark:text-slate-900' : 'dark:text-white'}`}>{progress.completed}</span>
            <span className={`text-slate-900 ${isMobile ? 'dark:text-slate-900' : 'dark:text-white'}`}> / {progress.total} completed</span>
          </div>
        )}
        {showPercentage && (
          <div className={`text-sm font-medium print:text-indigo-700 text-slate-900 ${isMobile ? 'dark:text-slate-900' : 'dark:text-white'}`}>
            {progress.percentage}%
          </div>
        )}
      </div>
      <ProgressBar 
        value={progress.percentage} 
        className="h-1.5 bg-muted dark:bg-nord-0 print:bg-gray-200" 
        indicatorClassName={colorClass}
      />
      
      {showCritical && (
        <div className={`flex items-center mt-2 text-sm text-slate-900 ${isMobile ? 'dark:text-slate-900' : 'dark:text-white'}`}>
          <AlertTriangle className={`h-4 w-4 mr-1 ${criticalProgress.completed < criticalProgress.total ? 'text-destructive' : 'text-green-500'}`} />
          <span>
            <span className={`font-medium text-slate-900 ${isMobile ? 'dark:text-slate-900' : 'dark:text-white'}`}>{criticalProgress.completed}/{criticalProgress.total}</span> critical items completed
          </span>
        </div>
      )}
    </div>
  );
};

export default Progress;
