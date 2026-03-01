import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GraduationCap, ArrowLeft, Trophy, Star, Loader2, LayoutDashboard, User, Users, ChevronRight, RefreshCw } from 'lucide-react';
import { useExercise } from '@/hooks/useExercises';
import { useSaveResult } from '@/hooks/useResults';
import { useCheckAndAwardAchievements, Achievement } from '@/hooks/useAchievements';
import { useClasses, useStudentsByClass, StudentProfile } from '@/hooks/useClasses';
import { MemoryGame, QuizGame, DragDropGame, ExternalLinkViewer, CrosswordGame, FillInGame, RebusGame } from '@/components/games';
import { MatchingPair, QuizQuestion, DragDropItem, DragDropZone, FillInBlank } from '@/types';
import { CrosswordClue } from '@/components/games/CrosswordGame';
import { RebusItem } from '@/components/games/RebusGame';
import { AchievementNotification } from '@/components/AchievementNotification';
import { toast } from 'sonner';

interface LessonContext {
  lessonId: string;
  lessonTitle: string;
  exercises: string[];
  currentIndex: number;
  studentId: string;
  studentName: string;
  studentEmoji: string;
  assignmentId?: string;
}

const GamePage = () => {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [gameResult, setGameResult] = useState<{ score: number; timeSpent: number } | null>(null);
  const [isSavingResult, setIsSavingResult] = useState(false);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [attemptKey, setAttemptKey] = useState(0); // Force remount games on replay
  const hasSavedRef = useRef(false); // Prevent double-save
  
  const [lessonContext, setLessonContext] = useState<LessonContext | null>(null);
  
  const [switchStudentOpen, setSwitchStudentOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  
  const { data: classes = [] } = useClasses();
  const { data: studentsInClass = [] } = useStudentsByClass(selectedClassId || null);

  const { data: exercise, isLoading, error } = useExercise(exerciseId || '');
  const saveResult = useSaveResult();
  const checkAchievements = useCheckAndAwardAchievements();

  // Read student from URL query params for free play
  const urlStudentId = searchParams.get('student');

  // Load lesson context from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem('currentLesson');
    if (stored) {
      try {
        const context = JSON.parse(stored) as LessonContext;
        const currentIdx = context.exercises.indexOf(exerciseId || '');
        if (currentIdx !== -1) {
          context.currentIndex = currentIdx;
          sessionStorage.setItem('currentLesson', JSON.stringify(context));
        }
        setLessonContext(context);
      } catch (e) {
        console.error('Failed to parse lesson context', e);
      }
    }
  }, [exerciseId]);

  // Reset save guard when exercise changes or replay
  useEffect(() => {
    hasSavedRef.current = false;
  }, [exerciseId, attemptKey]);

  const updateLessonStudent = (student: StudentProfile) => {
    if (lessonContext) {
      const updatedContext = {
        ...lessonContext,
        studentId: student.id,
        studentName: student.nickname,
        studentEmoji: student.avatar_emoji
      };
      sessionStorage.setItem('currentLesson', JSON.stringify(updatedContext));
      setLessonContext(updatedContext);
      setSwitchStudentOpen(false);
      setSelectedStudent(null);
      setSelectedClassId('');
      toast.success(`Учня змінено на ${student.nickname}`);
    }
  };

  const goToNextExercise = () => {
    if (lessonContext && lessonContext.currentIndex < lessonContext.exercises.length - 1) {
      const nextExerciseId = lessonContext.exercises[lessonContext.currentIndex + 1];
      setGameResult(null);
      setAttemptKey(k => k + 1);
      navigate(`/play/game/${nextExerciseId}`);
    }
  };

  const exitLesson = () => {
    sessionStorage.removeItem('currentLesson');
    navigate('/dashboard');
  };

  // Determine effective studentId: lesson context takes priority, then URL param
  const effectiveStudentId = lessonContext?.studentId || urlStudentId || null;

  const handleComplete = useCallback((score: number, timeSpent: number) => {
    // Prevent double-save for the same attempt
    if (hasSavedRef.current) return;
    hasSavedRef.current = true;

    const studentId = effectiveStudentId;
    
    if (studentId && exerciseId) {
      setIsSavingResult(true);
      saveResult.mutate({
        studentId,
        exerciseId,
        score,
        maxScore: 100,
        timeSpent,
        mistakes: Math.round(Math.max(0, 100 - score) / 10),
        assignmentId: lessonContext?.assignmentId,
      }, {
        onSuccess: () => {
          // Only show result after confirmed save
          setGameResult({ score, timeSpent });
          setIsSavingResult(false);
          toast.success('Результат збережено!');
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
          setIsSavingResult(false);
          hasSavedRef.current = false; // Allow retry
          toast.error('Не вдалося зберегти результат. Спробуйте ще раз.');
        }
      });
    } else {
      // No student selected — show result immediately without saving
      setGameResult({ score, timeSpent });
    }
  }, [effectiveStudentId, exerciseId, saveResult, checkAchievements, lessonContext?.assignmentId]);

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

  // Saving indicator
  if (isSavingResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Зберігаємо результат...</p>
        </Card>
      </div>
    );
  }

  // Result screen
  if (gameResult) {
    const stars = Math.ceil(gameResult.score / 20);
    const hasNextExercise = lessonContext && lessonContext.currentIndex < lessonContext.exercises.length - 1;
    const isLastExercise = lessonContext && lessonContext.currentIndex === lessonContext.exercises.length - 1;
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary/20 via-primary/10 to-background flex items-center justify-center p-4">
        {newAchievements.length > 0 && (
          <AchievementNotification
            achievements={newAchievements}
            onComplete={() => setNewAchievements([])}
          />
        )}

        <Card className="max-w-md w-full p-8 text-center">
          {lessonContext && (
            <div className="mb-4 pb-4 border-b">
              <Badge variant="secondary" className="mb-2">
                {lessonContext.lessonTitle}
              </Badge>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <span className="text-lg">{lessonContext.studentEmoji}</span>
                <span>{lessonContext.studentName}</span>
                <span className="mx-2">•</span>
                <span>Завдання {lessonContext.currentIndex + 1} з {lessonContext.exercises.length}</span>
              </div>
            </div>
          )}

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
            {lessonContext && (
              <>
                {hasNextExercise && (
                  <Button size="lg" onClick={goToNextExercise} className="bg-primary">
                    Наступне завдання
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                )}
                
                {isLastExercise && (
                  <Button size="lg" onClick={exitLesson} className="bg-green-600 hover:bg-green-700">
                    <Trophy className="mr-2 h-5 w-5" />
                    Урок завершено!
                  </Button>
                )}
                
                <Button size="lg" variant="outline" onClick={() => setSwitchStudentOpen(true)}>
                  <RefreshCw className="mr-2 h-5 w-5" />
                  Інший учень (те ж завдання)
                </Button>
              </>
            )}
            
            <Button size="lg" variant="outline" onClick={() => {
              setGameResult(null);
              setAttemptKey(k => k + 1);
            }}>
              Грати ще раз
            </Button>
            
            {!lessonContext && (
              <>
                <Button size="lg" variant="outline" onClick={() => navigate('/play')}>
                  Обрати іншу гру
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/dashboard')}>
                  <LayoutDashboard className="mr-2 h-5 w-5" />
                  Меню вчителя
                </Button>
              </>
            )}
            
            {lessonContext && (
              <Button size="lg" variant="ghost" onClick={exitLesson}>
                Завершити урок достроково
              </Button>
            )}
          </div>
        </Card>

        {/* Switch Student Dialog */}
        <Dialog open={switchStudentOpen} onOpenChange={setSwitchStudentOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Обрати іншого учня
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Клас</label>
                <Select value={selectedClassId} onValueChange={(value) => { setSelectedClassId(value); setSelectedStudent(null); }}>
                  <SelectTrigger><SelectValue placeholder="Оберіть клас" /></SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>{cls.name} ({cls.grade} клас)</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedClassId && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Учень</label>
                  {studentsInClass.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-2">В цьому класі немає учнів</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                      {studentsInClass.map((student) => (
                        <button key={student.id} onClick={() => setSelectedStudent(student)}
                          className={`flex items-center gap-2 p-3 rounded-lg border transition-all text-left ${
                            selectedStudent?.id === student.id ? 'border-primary bg-primary/10 ring-2 ring-primary' : 'border-border hover:border-primary/50 hover:bg-muted/50'
                          }`}>
                          <span className="text-2xl">{student.avatar_emoji}</span>
                          <span className="font-medium text-sm truncate">{student.nickname}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setSwitchStudentOpen(false)}>Скасувати</Button>
              <Button className="flex-1" onClick={() => selectedStudent && updateLessonStudent(selectedStudent)} disabled={!selectedStudent}>Підтвердити</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  const contentJson = exercise.content_json as Record<string, unknown>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
      <header className="py-4 px-4 border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {lessonContext ? (
              <Button variant="ghost" size="sm" onClick={exitLesson}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Вийти з уроку
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => navigate('/play')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад
              </Button>
            )}
            <div className="hidden md:flex items-center gap-2">
              <span className="text-2xl">{exercise.thumbnail_emoji}</span>
              <span className="font-bold text-foreground">{exercise.title}</span>
            </div>
          </div>
          
          {lessonContext && (
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="hidden sm:flex">
                {lessonContext.lessonTitle}
              </Badge>
              <div className="flex items-center gap-2 text-sm">
                <span>{lessonContext.currentIndex + 1}/{lessonContext.exercises.length}</span>
              </div>
              <button onClick={() => setSwitchStudentOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors">
                <span className="text-lg">{lessonContext.studentEmoji}</span>
                <span className="font-medium text-sm hidden sm:inline">{lessonContext.studentName}</span>
                <RefreshCw className="h-3 w-3 text-muted-foreground" />
              </button>
            </div>
          )}
          
          {!lessonContext && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Меню вчителя</span>
                </Link>
              </Button>
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <GraduationCap className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-bold text-primary hidden md:block">УкрШкола</span>
              </Link>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="md:hidden text-center mb-6">
            <span className="text-4xl mb-2 block">{exercise.thumbnail_emoji}</span>
            <h1 className="text-xl font-bold text-foreground">{exercise.title}</h1>
          </div>

          {exercise.type === 'QUIZ' && contentJson.questions && (
            <QuizGame key={attemptKey} questions={contentJson.questions as QuizQuestion[]} onComplete={handleComplete} />
          )}

          {exercise.type === 'MATCHING' && contentJson.pairs && (
            <MemoryGame key={attemptKey} pairs={contentJson.pairs as MatchingPair[]} onComplete={handleComplete} />
          )}

          {exercise.type === 'DRAG_DROP' && contentJson.zones && contentJson.items && (
            <DragDropGame key={attemptKey} zones={contentJson.zones as DragDropZone[]} items={contentJson.items as DragDropItem[]} onComplete={handleComplete} />
          )}

          {exercise.type === 'EXTERNAL_LINK' && exercise.external_url && (
            <ExternalLinkViewer key={attemptKey} title={exercise.title} description={exercise.description || ''} url={exercise.external_url} onComplete={handleComplete} />
          )}

          {exercise.type === 'CROSSWORD' && (contentJson.variants || contentJson.clues) && (
            <CrosswordGame
              key={attemptKey}
              variants={contentJson.variants as any}
              clues={contentJson.clues as CrosswordClue[]}
              gridSize={(contentJson.gridSize as number) || 10}
              onComplete={handleComplete}
            />
          )}

          {exercise.type === 'FILL_IN' && contentJson.sentences && (
            <FillInGame key={attemptKey} sentences={contentJson.sentences as FillInBlank[]} onComplete={handleComplete} />
          )}

          {exercise.type === 'REBUS' && contentJson.items && (
            <RebusGame key={attemptKey} items={contentJson.items as RebusItem[]} onComplete={handleComplete} />
          )}

          {/* Fallback for unknown types */}
          {!['QUIZ', 'MATCHING', 'DRAG_DROP', 'EXTERNAL_LINK', 'CROSSWORD', 'FILL_IN', 'REBUS'].includes(exercise.type) && (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Тип вправи "{exercise.type}" не підтримується</p>
            </Card>
          )}
        </div>
      </main>

      {/* Switch Student Dialog (during game) */}
      <Dialog open={switchStudentOpen} onOpenChange={setSwitchStudentOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Обрати іншого учня
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Клас</label>
              <Select value={selectedClassId} onValueChange={(value) => { setSelectedClassId(value); setSelectedStudent(null); }}>
                <SelectTrigger><SelectValue placeholder="Оберіть клас" /></SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>{cls.name} ({cls.grade} клас)</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedClassId && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Учень</label>
                {studentsInClass.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-2">В цьому класі немає учнів</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {studentsInClass.map((student) => (
                      <button key={student.id} onClick={() => setSelectedStudent(student)}
                        className={`flex items-center gap-2 p-3 rounded-lg border transition-all text-left ${
                          selectedStudent?.id === student.id ? 'border-primary bg-primary/10 ring-2 ring-primary' : 'border-border hover:border-primary/50 hover:bg-muted/50'
                        }`}>
                        <span className="text-2xl">{student.avatar_emoji}</span>
                        <span className="font-medium text-sm truncate">{student.nickname}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setSwitchStudentOpen(false)}>Скасувати</Button>
            <Button className="flex-1" onClick={() => selectedStudent && updateLessonStudent(selectedStudent)} disabled={!selectedStudent}>Підтвердити</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GamePage;