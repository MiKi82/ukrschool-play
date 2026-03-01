import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CheckCircle, XCircle, RotateCcw, ArrowRight } from 'lucide-react';

export interface RebusItem {
  id: string;
  emoji: string;
  hint?: string;
  answer: string;
}

interface RebusGameProps {
  items: RebusItem[];
  onComplete: (score: number, timeSpent: number) => void;
}

export const RebusGame: React.FC<RebusGameProps> = ({ items, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [isComplete, setIsComplete] = useState(false);

  if (!items || items.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Немає ребусів для відображення</p>
      </Card>
    );
  }

  const currentItem = items[currentIndex];
  const isCorrect = userAnswer.trim().toLowerCase() === currentItem.answer.toLowerCase();

  const handleCheck = () => {
    setIsAnswered(true);
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setUserAnswer('');
      setIsAnswered(false);
    } else {
      const finalCorrect = isCorrect ? correctCount : correctCount;
      const score = Math.round((finalCorrect / items.length) * 100);
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      setIsComplete(true);
      onComplete(score, timeSpent);
    }
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setUserAnswer('');
    setIsAnswered(false);
    setCorrectCount(0);
    setStartTime(Date.now());
    setIsComplete(false);
  };

  if (isComplete) {
    return (
      <Card className="p-8 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Ребуси розгадано!</h2>
        <p className="text-muted-foreground mb-4">
          Правильних відповідей: {correctCount} з {items.length}
        </p>
        <Button onClick={resetGame} variant="outline">
          <RotateCcw className="mr-2 h-4 w-4" />
          Спробувати знову
        </Button>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Progress */}
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-muted-foreground">
          Ребус {currentIndex + 1} з {items.length}
        </span>
        <span className="text-sm font-bold text-primary">✓ {correctCount}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
          style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
        />
      </div>

      {/* Rebus display */}
      <Card className="p-8 text-center">
        <div className="text-7xl mb-6">{currentItem.emoji}</div>
        {currentItem.hint && (
          <p className="text-muted-foreground mb-4 italic">Підказка: {currentItem.hint}</p>
        )}

        <div className="max-w-xs mx-auto space-y-4">
          <Input
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Введіть відповідь..."
            className="text-center text-lg"
            disabled={isAnswered}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isAnswered && userAnswer.trim()) {
                handleCheck();
              }
            }}
          />

          {isAnswered && (
            <div className="flex items-center justify-center gap-2 animate-fade-in">
              {isCorrect ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-green-600 font-medium">Правильно!</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span className="text-red-600 font-medium">
                    Відповідь: {currentItem.answer}
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      </Card>

      <div className="flex justify-center gap-4">
        {!isAnswered ? (
          <Button onClick={handleCheck} disabled={!userAnswer.trim()}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Перевірити
          </Button>
        ) : (
          <Button onClick={handleNext}>
            {currentIndex < items.length - 1 ? 'Далі' : 'Завершити'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};