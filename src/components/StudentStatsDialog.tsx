import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, Clock, Target, TrendingUp, BookOpen, 
  Award, Loader2, Calendar
} from 'lucide-react';
import { useStudentProgress, StudentResult } from '@/hooks/useStudentProgress';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';

interface StudentStatsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  student: {
    id: string;
    nickname: string;
    avatar_emoji: string;
    photo_url?: string | null;
  } | null;
}

const formatTime = (seconds: number) => {
  if (seconds < 60) return `${seconds} сек`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${mins} хв ${secs} сек` : `${mins} хв`;
};

const difficultyLabels: Record<string, string> = {
  EASY: 'Легко',
  MEDIUM: 'Середньо',
  HARD: 'Складно',
};

export const StudentStatsDialog: React.FC<StudentStatsDialogProps> = ({
  isOpen,
  onClose,
  student,
}) => {
  const { progress, results, isLoading } = useStudentProgress(student?.id || null);

  if (!student) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
              {student.photo_url ? (
                <img 
                  src={student.photo_url} 
                  alt={student.nickname} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl">{student.avatar_emoji}</span>
              )}
            </div>
            <div>
              <span className="text-xl">{student.nickname}</span>
              <p className="text-sm text-muted-foreground font-normal">Статистика учня</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Немає результатів
            </h3>
            <p className="text-muted-foreground">
              Цей учень ще не виконав жодної вправи
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Card className="p-4 text-center">
                <Trophy className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{progress.averageScore}%</p>
                <p className="text-xs text-muted-foreground">Середній бал</p>
              </Card>
              <Card className="p-4 text-center">
                <Target className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{progress.completedExercises}</p>
                <p className="text-xs text-muted-foreground">Виконано вправ</p>
              </Card>
              <Card className="p-4 text-center">
                <Clock className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{formatTime(progress.totalTimeSpent)}</p>
                <p className="text-xs text-muted-foreground">Загальний час</p>
              </Card>
              <Card className="p-4 text-center">
                <TrendingUp className="h-6 w-6 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">
                  {Object.keys(progress.bySubject).length}
                </p>
                <p className="text-xs text-muted-foreground">Предметів</p>
              </Card>
            </div>

            {/* Progress by Subject */}
            {Object.keys(progress.bySubject).length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Прогрес за предметами
                </h3>
                <div className="space-y-3">
                  {Object.entries(progress.bySubject).map(([subjectId, subject]) => (
                    <Card key={subjectId} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{subject.subjectIcon}</span>
                          <span className="font-medium text-foreground">{subject.subjectName}</span>
                        </div>
                        <Badge variant="secondary">{subject.completed} вправ</Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Середній бал</span>
                          <span className="font-medium text-foreground">{subject.averageScore}%</span>
                        </div>
                        <Progress value={subject.averageScore} className="h-2" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Час: {formatTime(subject.totalTime)}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Results */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Останні результати
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {results.slice(0, 10).map((result) => (
                  <Card key={result.id} className="p-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl shrink-0">
                        {result.exercises?.thumbnail_emoji || '📝'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm truncate">
                          {result.exercises?.title || 'Вправа'}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{format(new Date(result.completed_at), 'd MMM yyyy, HH:mm', { locale: uk })}</span>
                          {result.exercises?.difficulty && (
                            <Badge variant="outline" className="text-xs py-0">
                              {difficultyLabels[result.exercises.difficulty]}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`text-lg font-bold ${
                          result.score >= 80 ? 'text-green-600' :
                          result.score >= 50 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {result.score}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatTime(result.time_spent)}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
