import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Achievement } from '@/hooks/useAchievements';
import { cn } from '@/lib/utils';

interface AchievementNotificationProps {
  achievements: Achievement[];
  onComplete?: () => void;
}

export const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievements,
  onComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (achievements.length === 0) return;

    const showTimer = setTimeout(() => {
      if (currentIndex < achievements.length - 1) {
        setIsVisible(false);
        setTimeout(() => {
          setCurrentIndex(prev => prev + 1);
          setIsVisible(true);
        }, 300);
      } else {
        setIsVisible(false);
        setTimeout(() => {
          onComplete?.();
        }, 300);
      }
    }, 3000);

    return () => clearTimeout(showTimer);
  }, [currentIndex, achievements.length, onComplete]);

  if (achievements.length === 0 || currentIndex >= achievements.length) {
    return null;
  }

  const achievement = achievements[currentIndex];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <Card
        className={cn(
          'p-6 bg-gradient-to-br from-secondary/20 via-card to-primary/20 border-2 border-secondary shadow-2xl shadow-secondary/30 transition-all duration-300',
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        )}
      >
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">{achievement.icon}</div>
          <h3 className="text-xl font-bold text-foreground mb-1">
            🎉 Нова нагорода!
          </h3>
          <p className="text-2xl font-extrabold text-primary mb-2">
            {achievement.name}
          </p>
          <p className="text-muted-foreground mb-3">{achievement.description}</p>
          <div className="inline-flex items-center gap-1 bg-secondary/20 px-3 py-1 rounded-full">
            <span className="text-secondary font-bold">+{achievement.points}</span>
            <span className="text-muted-foreground text-sm">балів</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
