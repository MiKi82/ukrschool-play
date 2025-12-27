import React from 'react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AchievementBadgeProps {
  icon: string;
  name: string;
  description: string;
  points: number;
  earned?: boolean;
  earnedAt?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  icon,
  name,
  description,
  points,
  earned = false,
  earnedAt,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10 text-xl',
    md: 'w-14 h-14 text-2xl',
    lg: 'w-20 h-20 text-4xl',
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            'rounded-full flex items-center justify-center transition-all cursor-pointer',
            sizeClasses[size],
            earned
              ? 'bg-gradient-to-br from-secondary/30 to-primary/20 border-2 border-secondary shadow-lg shadow-secondary/20 hover:scale-110'
              : 'bg-muted/50 border-2 border-muted grayscale opacity-50 hover:opacity-70'
          )}
        >
          <span className={earned ? '' : 'grayscale'}>{icon}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <div className="text-center">
          <p className="font-bold text-foreground">{name}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
          <p className="text-xs text-primary mt-1">+{points} балів</p>
          {earned && earnedAt && (
            <p className="text-xs text-muted-foreground mt-1">
              Отримано: {new Date(earnedAt).toLocaleDateString('uk-UA')}
            </p>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};
