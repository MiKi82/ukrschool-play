import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QuizQuestion } from '@/types';
import { CheckCircle2, XCircle, ArrowRight, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizGameProps {
  questions: QuizQuestion[];
  onComplete: (score: number, timeSpent: number) => void;
}

export const QuizGame: React.FC<QuizGameProps> = ({ questions, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [startTime] = useState(Date.now());
  const [isComplete, setIsComplete] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleAnswer = useCallback((optionIndex: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(optionIndex);
    setIsAnswered(true);
    
    if (optionIndex === currentQuestion.correctIndex) {
      setCorrectAnswers(prev => prev + 1);
    }
  }, [isAnswered, currentQuestion]);

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setIsComplete(true);
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      const finalCorrect = selectedAnswer === currentQuestion.correctIndex 
        ? correctAnswers 
        : correctAnswers;
      const score = Math.floor((finalCorrect / questions.length) * 100);
      onComplete(score, timeSpent);
    }
  }, [currentIndex, questions.length, startTime, onComplete, selectedAnswer, currentQuestion, correctAnswers]);

  if (isComplete) {
    const score = Math.floor((correctAnswers / questions.length) * 100);
    return (
      <Card className="p-8 text-center animate-scale-in bg-gradient-to-br from-primary-light to-accent/20 max-w-xl mx-auto">
        <Trophy className="h-16 w-16 text-accent mx-auto mb-4 animate-bounce-slow" />
        <h2 className="text-3xl font-bold text-primary mb-2">
          {score >= 80 ? 'Чудово! 🎉' : score >= 50 ? 'Непогано! 👍' : 'Спробуй ще раз! 💪'}
        </h2>
        <p className="text-xl text-muted-foreground mb-4">
          Правильних відповідей: {correctAnswers} з {questions.length}
        </p>
        <div className="flex justify-center gap-2 mb-4">
          {[...Array(5)].map((_, i) => (
            <span 
              key={i} 
              className={cn(
                "text-3xl transition-all",
                i < Math.ceil(score / 20) ? "animate-pop" : "opacity-30"
              )}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              ⭐
            </span>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <Badge variant="info">
            Питання {currentIndex + 1} з {questions.length}
          </Badge>
          <span className="text-lg font-bold text-primary">
            ✓ {correctAnswers}
          </span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <Card className="p-6 mb-6">
        <h2 className="text-2xl font-bold text-center mb-8">
          {currentQuestion.question}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.options.map((option, index) => (
            <Button
              key={index}
              variant={
                isAnswered
                  ? index === currentQuestion.correctIndex
                    ? "success"
                    : index === selectedAnswer
                    ? "destructive"
                    : "outline"
                  : selectedAnswer === index
                  ? "default"
                  : "outline"
              }
              size="lg"
              className={cn(
                "h-auto py-4 px-6 text-lg justify-start",
                isAnswered && index === currentQuestion.correctIndex && "animate-wiggle"
              )}
              onClick={() => handleAnswer(index)}
              disabled={isAnswered}
            >
              <span className="mr-3 font-bold text-xl">
                {String.fromCharCode(65 + index)}
              </span>
              {option}
              {isAnswered && index === currentQuestion.correctIndex && (
                <CheckCircle2 className="ml-auto h-6 w-6" />
              )}
              {isAnswered && index === selectedAnswer && index !== currentQuestion.correctIndex && (
                <XCircle className="ml-auto h-6 w-6" />
              )}
            </Button>
          ))}
        </div>

        {isAnswered && currentQuestion.explanation && (
          <div className="mt-6 p-4 bg-muted rounded-xl animate-fade-in">
            <p className="text-muted-foreground">
              💡 {currentQuestion.explanation}
            </p>
          </div>
        )}
      </Card>

      {isAnswered && (
        <div className="flex justify-center animate-fade-in">
          <Button size="lg" variant="game" onClick={handleNext}>
            {currentIndex < questions.length - 1 ? 'Далі' : 'Завершити'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
};
