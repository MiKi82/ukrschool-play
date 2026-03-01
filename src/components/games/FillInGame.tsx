import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';

export interface FillInBlank {
  id: string;
  text: string;
  blanks: {
    index: number;
    answer: string;
  }[];
}

interface FillInGameProps {
  sentences: FillInBlank[];
  onComplete: (score: number, timeSpent: number) => void;
}

export const FillInGame: React.FC<FillInGameProps> = ({ sentences, onComplete }) => {
  const [answers, setAnswers] = useState<Record<string, Record<number, string>>>({});
  const [showResults, setShowResults] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  const handleInputChange = (sentenceId: string, blankIndex: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [sentenceId]: {
        ...prev[sentenceId],
        [blankIndex]: value,
      },
    }));
  };

  const checkAnswers = () => {
    setShowResults(true);
  };

  const handleComplete = () => {
    let correct = 0;
    let total = 0;

    sentences.forEach((sentence) => {
      sentence.blanks.forEach((blank) => {
        total++;
        const userAnswer = answers[sentence.id]?.[blank.index]?.trim().toLowerCase() || '';
        if (userAnswer === blank.answer.toLowerCase()) {
          correct++;
        }
      });
    });

    const score = total > 0 ? Math.round((correct / total) * 100) : 0;
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    setIsComplete(true);
    onComplete(score, timeSpent);
  };

  const isBlankCorrect = (sentenceId: string, blank: { index: number; answer: string }) => {
    const userAnswer = answers[sentenceId]?.[blank.index]?.trim().toLowerCase() || '';
    return userAnswer === blank.answer.toLowerCase();
  };

  const resetGame = () => {
    setAnswers({});
    setShowResults(false);
    setIsComplete(false);
    setStartTime(Date.now());
  };

  const renderSentence = (sentence: FillInBlank) => {
    // Support both "___" delimiter and "{blank}" delimiter formats
    let parts: string[];
    if (sentence.text.includes('___')) {
      parts = sentence.text.split('___');
    } else if (sentence.text.includes('{blank}')) {
      parts = sentence.text.split('{blank}');
    } else {
      // Fallback: treat the whole text as one part with no blanks rendered inline
      parts = [sentence.text];
    }
    
    const elements: React.ReactNode[] = [];

    parts.forEach((part, i) => {
      elements.push(<span key={`text-${i}`}>{part}</span>);

      if (i < sentence.blanks.length) {
        // Find the blank that corresponds to this gap position
        const blank = sentence.blanks.find((b) => b.index === i) 
          || (i < sentence.blanks.length ? sentence.blanks[i] : undefined);
        if (blank) {
          const isCorrect = isBlankCorrect(sentence.id, blank);
          elements.push(
            <span key={`blank-${i}`} className="inline-flex items-center mx-1">
              <Input
                className={`w-24 sm:w-32 inline-block text-center ${
                  showResults
                    ? isCorrect
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/30'
                      : 'border-red-500 bg-red-50 dark:bg-red-900/30'
                    : ''
                }`}
                value={answers[sentence.id]?.[blank.index] || ''}
                onChange={(e) => handleInputChange(sentence.id, blank.index, e.target.value)}
                disabled={isComplete}
              />
              {showResults && (
                <span className="ml-1">
                  {isCorrect ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </span>
              )}
            </span>
          );
        }
      }
    });

    return elements;
  };

  if (isComplete) {
    let correct = 0;
    let total = 0;
    sentences.forEach((sentence) => {
      sentence.blanks.forEach((blank) => {
        total++;
        if (isBlankCorrect(sentence.id, blank)) correct++;
      });
    });

    return (
      <Card className="p-8 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Завдання виконано!</h2>
        <p className="text-muted-foreground mb-4">
          Правильних відповідей: {correct} з {total}
        </p>
        <Button onClick={resetGame} variant="outline">
          <RotateCcw className="mr-2 h-4 w-4" />
          Спробувати знову
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Заповніть пропуски</h2>
        <div className="space-y-6">
          {sentences.map((sentence, index) => (
            <div key={sentence.id} className="p-4 rounded-lg bg-muted/50">
              <p className="text-lg leading-relaxed">
                <span className="font-medium text-muted-foreground mr-2">{index + 1}.</span>
                {renderSentence(sentence)}
              </p>
              {showResults && !sentence.blanks.every((b) => isBlankCorrect(sentence.id, b)) && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Правильні відповіді:{' '}
                  {sentence.blanks.map((b) => b.answer).join(', ')}
                </p>
              )}
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={resetGame}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Скинути
        </Button>
        {!showResults ? (
          <Button onClick={checkAnswers}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Перевірити
          </Button>
        ) : (
          <Button onClick={handleComplete}>Завершити</Button>
        )}
      </div>
    </div>
  );
};