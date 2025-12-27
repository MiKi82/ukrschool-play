import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, CheckCircle2 } from 'lucide-react';

interface ExternalLinkViewerProps {
  title: string;
  description: string;
  url: string;
  onComplete: (score: number, timeSpent: number) => void;
}

export const ExternalLinkViewer: React.FC<ExternalLinkViewerProps> = ({
  title,
  description,
  url,
  onComplete,
}) => {
  const [isOpened, setIsOpened] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime] = useState(Date.now());

  const handleOpen = () => {
    window.open(url, '_blank');
    setIsOpened(true);
  };

  const handleMarkDone = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    setIsCompleted(true);
    onComplete(100, timeSpent);
  };

  return (
    <Card className="p-8 max-w-2xl mx-auto text-center">
      <div className="text-6xl mb-6">🌐</div>
      <h2 className="text-2xl font-bold text-foreground mb-3">{title}</h2>
      <p className="text-muted-foreground mb-6">{description}</p>

      {!isCompleted ? (
        <div className="space-y-4">
          <Button 
            size="xl" 
            variant="game" 
            onClick={handleOpen}
            className="w-full max-w-xs"
          >
            <ExternalLink className="mr-2 h-5 w-5" />
            Відкрити вправу
          </Button>

          {isOpened && (
            <div className="animate-fade-in">
              <p className="text-sm text-muted-foreground mb-4">
                Після виконання вправи натисніть кнопку нижче:
              </p>
              <Button 
                size="lg" 
                variant="success"
                onClick={handleMarkDone}
                className="w-full max-w-xs"
              >
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Виконано!
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="animate-scale-in">
          <CheckCircle2 className="h-16 w-16 text-game-success mx-auto mb-4" />
          <p className="text-xl font-bold text-primary">Вправу виконано! 🎉</p>
        </div>
      )}
    </Card>
  );
};
