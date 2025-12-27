import React from 'react';
import { Loader2, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PullToRefreshIndicatorProps {
  pullDistance: number;
  isRefreshing: boolean;
  threshold: number;
}

export const PullToRefreshIndicator: React.FC<PullToRefreshIndicatorProps> = ({
  pullDistance,
  isRefreshing,
  threshold,
}) => {
  const progress = Math.min(pullDistance / threshold, 1);
  const shouldTrigger = pullDistance >= threshold;

  if (pullDistance === 0 && !isRefreshing) return null;

  return (
    <div 
      className="flex items-center justify-center transition-all duration-200 overflow-hidden"
      style={{ height: pullDistance }}
    >
      <div 
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 transition-all",
          shouldTrigger && "bg-primary/20 scale-110",
          isRefreshing && "bg-primary/20"
        )}
        style={{ 
          transform: `rotate(${progress * 180}deg)`,
          opacity: Math.min(progress * 1.5, 1),
        }}
      >
        {isRefreshing ? (
          <Loader2 className="h-5 w-5 text-primary animate-spin" />
        ) : (
          <ArrowDown 
            className={cn(
              "h-5 w-5 text-primary transition-transform",
              shouldTrigger && "rotate-180"
            )} 
          />
        )}
      </div>
    </div>
  );
};
