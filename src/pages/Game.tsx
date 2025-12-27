import React, { useState, useCallback } from 'react';
import { Link, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GraduationCap, ArrowLeft, Trophy, Star, Loader2 } from 'lucide-react';
import { useExercise } from '@/hooks/useExercises';
import { useSaveResult } from '@/hooks/useResults';
import { useCheckAndAwardAchievements, Achievement } from '@/hooks/useAchievements';
import { MemoryGame, QuizGame, DragDropGame, ExternalLinkViewer } from '@/components/games';
import { MatchingPair, QuizQuestion, DragDropItem, DragDropZone } from '@/types';
import { AchievementNotification } from '@/components/AchievementNotification';
import { toast } from 'sonner';

const GamePage = () => {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const [searchParams] = useSearchParams();
  const studentId = searchParams.get('student');
  const navigate = useNavigate();
  const [gameResult, setGameResult] = useState<{ score: number; timeSpent: number } | null>(null);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);

  const { data: exercise, isLoading, error } = useExercise(exerciseId || '');
  const saveResult = useSaveResult();
  const checkAchievements = useCheckAndAwardAchievements();

  const handleComplete = useCallback((score: number, timeSpent: number) => {
    setGameResult({ score, timeSpent });
    
    // Save result to database if student is selected
    if (studentId && exerciseId) {
      saveResult.mutate({
        studentId,
        exerciseId,
        score,
        maxScore: 100,
        timeSpent,
        mistakes: Math.max(0, 100 - score) / 10,
      }, {
        onSuccess: () => {
          toast.success('Результат збережено!');
          // Check for new achievements
          checkAchievements.mutate(
            { studentId, score, timeSpent },
            {
              onSuccess: (achievements) => {
                if (achievements.length > 0) {
                  setNewAchievements(achievements);
                }
              },
            }
          );
        },
        onError: () => {
          toast.error('Не вдалося зберегти результат');
        }
      });
    }
  }, [studentId, exerciseId, saveResult, checkAchievements]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !exercise) {
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
      <div className="min-h-screen bg-gradient-to-b from-secondary/20 via-primary/10 to-background flex items-center justify-center p-4">
        {/* Achievement Notification */}
        {newAchievements.length > 0 && (
          <AchievementNotification
            achievements={newAchievements}
            onComplete={() => setNewAchievements([])}
          />
        )}

        <Card className="max-w-md w-full p-8 text-center">
          <Trophy className="h-20 w-20 text-secondary mx-auto mb-4 animate-bounce" />
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
                className={`h-10 w-10 transition-all ${
                  i < stars ? 'text-secondary fill-secondary' : 'text-muted'
                }`}
              />
            ))}
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            Час: {Math.floor(gameResult.timeSpent / 60)}:{String(gameResult.timeSpent % 60).padStart(2, '0')}
          </p>

          <div className="flex flex-col gap-3">
            <Button size="lg" onClick={() => setGameResult(null)}>
              Грати ще раз
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/play')}>
              Обрати іншу гру
            </Button>
            <Button size="lg" variant="ghost" onClick={() => navigate(-1)}>
              Повернутися назад
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const contentJson = exercise.content_json as Record<string, unknown>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
      {/* Header */}
      <header className="py-4 px-4 border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/play')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад
            </Button>
            <div className="hidden md:flex items-center gap-2">
              <span className="text-2xl">{exercise.thumbnail_emoji}</span>
              <span className="font-bold text-foreground">{exercise.title}</span>
            </div>
          </div>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
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
            <span className="text-4xl mb-2 block">{exercise.thumbnail_emoji}</span>
            <h1 className="text-xl font-bold text-foreground">{exercise.title}</h1>
          </div>

          {/* Game Component */}
          {exercise.type === 'QUIZ' && contentJson.questions && (
            <QuizGame
              questions={contentJson.questions as QuizQuestion[]}
              onComplete={handleComplete}
            />
          )}

          {exercise.type === 'MATCHING' && contentJson.pairs && (
            <MemoryGame
              pairs={contentJson.pairs as MatchingPair[]}
              onComplete={handleComplete}
            />
          )}

          {exercise.type === 'DRAG_DROP' && contentJson.zones && contentJson.items && (
            <DragDropGame
              zones={contentJson.zones as DragDropZone[]}
              items={contentJson.items as DragDropItem[]}
              onComplete={handleComplete}
            />
          )}

          {exercise.type === 'EXTERNAL_LINK' && exercise.external_url && (
            <ExternalLinkViewer
              title={exercise.title}
              description={exercise.description || ''}
              url={exercise.external_url}
              onComplete={handleComplete}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default GamePage;
