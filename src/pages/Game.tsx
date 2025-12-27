import React, { useState, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GraduationCap, Home, ArrowLeft, Trophy, Star } from 'lucide-react';
import { exercises } from '@/data/seedData';
import { MemoryGame, QuizGame, DragDropGame, ExternalLinkViewer } from '@/components/games';
import { MatchingPair, QuizQuestion, DragDropItem, DragDropZone } from '@/types';

const GamePage = () => {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const navigate = useNavigate();
  const [gameResult, setGameResult] = useState<{ score: number; timeSpent: number } | null>(null);

  const exercise = exercises.find(e => e.id === exerciseId);

  const handleComplete = useCallback((score: number, timeSpent: number) => {
    setGameResult({ score, timeSpent });
  }, []);

  if (!exercise) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Вправу не знайдено</h1>
          <Button asChild>
            <Link to="/play">Повернутися</Link>
          </Button>
        </Card>
      </div>
    );
  }

  if (gameResult) {
    const stars = Math.ceil(gameResult.score / 20);
    return (
      <div className="min-h-screen bg-gradient-to-b from-accent/20 via-primary-light/30 to-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center animate-scale-in">
          <Trophy className="h-20 w-20 text-accent mx-auto mb-4 animate-bounce-slow" />
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {gameResult.score >= 80 ? 'Чудово!' : gameResult.score >= 50 ? 'Добре!' : 'Спробуй ще!'}
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            Ви набрали {gameResult.score} балів!
          </p>
          
          <div className="flex justify-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-10 w-10 transition-all animate-pop ${
                  i < stars ? 'text-accent fill-accent' : 'text-muted'
                }`}
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            Час: {Math.floor(gameResult.timeSpent / 60)}:{String(gameResult.timeSpent % 60).padStart(2, '0')}
          </p>

          <div className="flex flex-col gap-3">
            <Button size="lg" variant="hero" onClick={() => {
              setGameResult(null);
            }}>
              Грати ще раз
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/play')}>
              Обрати іншу гру
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary-light/20">
      {/* Header */}
      <header className="py-4 px-4 border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/play')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад
            </Button>
            <div className="hidden md:flex items-center gap-2">
              <span className="text-2xl">{exercise.thumbnailEmoji}</span>
              <span className="font-bold text-foreground">{exercise.title}</span>
            </div>
          </div>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-primary hidden md:block">УкрШкола</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Game Title (Mobile) */}
          <div className="md:hidden text-center mb-6">
            <span className="text-4xl mb-2 block">{exercise.thumbnailEmoji}</span>
            <h1 className="text-xl font-bold text-foreground">{exercise.title}</h1>
          </div>

          {/* Game Component */}
          {exercise.type === 'QUIZ' && (
            <QuizGame
              questions={exercise.contentJson.questions as QuizQuestion[]}
              onComplete={handleComplete}
            />
          )}

          {exercise.type === 'MATCHING' && (
            <MemoryGame
              pairs={exercise.contentJson.pairs as MatchingPair[]}
              onComplete={handleComplete}
            />
          )}

          {exercise.type === 'DRAG_DROP' && (
            <DragDropGame
              zones={exercise.contentJson.zones as DragDropZone[]}
              items={exercise.contentJson.items as DragDropItem[]}
              onComplete={handleComplete}
            />
          )}

          {exercise.type === 'EXTERNAL_LINK' && exercise.externalUrl && (
            <ExternalLinkViewer
              title={exercise.title}
              description={exercise.description}
              url={exercise.externalUrl}
              onComplete={handleComplete}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default GamePage;
