import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  BookOpen, Calendar, Clock, Users, Trash2, Eye, 
  GripVertical, Loader2, FileText 
} from 'lucide-react';
import { useLessons, useDeleteLesson, Lesson } from '@/hooks/useLessons';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';

const LessonsView: React.FC = () => {
  const { data: lessons = [], isLoading } = useLessons();
  const deleteLesson = useDeleteLesson();
  
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [lessonToDelete, setLessonToDelete] = useState<Lesson | null>(null);

  const handleDelete = async () => {
    if (!lessonToDelete) return;
    
    try {
      await deleteLesson.mutateAsync(lessonToDelete.id);
      toast.success('Урок видалено');
      setLessonToDelete(null);
    } catch (error) {
      toast.error('Помилка при видаленні уроку');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'MEDIUM': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      case 'HARD': return 'bg-red-500/20 text-red-700 border-red-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'Легко';
      case 'MEDIUM': return 'Середньо';
      case 'HARD': return 'Складно';
      default: return difficulty;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className="text-center py-20">
        <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Ще немає уроків</h2>
        <p className="text-muted-foreground">
          Створіть урок у Бібліотеці, обравши вправи та натиснувши "Створити урок"
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lessons.map((lesson) => {
          const exerciseCount = lesson.lesson_exercises?.length || 0;
          const totalTime = lesson.lesson_exercises?.reduce(
            (acc, le) => acc + (le.exercise?.estimated_time || 0), 
            0
          ) || 0;
          const assignedClasses = lesson.assignments?.filter(a => a.class_group)?.length || 0;

          return (
            <Card 
              key={lesson.id}
              className="p-5 hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => setSelectedLesson(lesson)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground line-clamp-1">{lesson.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(lesson.created_at), 'd MMM yyyy', { locale: uk })}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLessonToDelete(lesson);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="text-xs">
                  <GripVertical className="h-3 w-3 mr-1" />
                  {exerciseCount} {exerciseCount === 1 ? 'вправа' : 'вправ'}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {totalTime} хв
                </Badge>
                {assignedClasses > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    <Users className="h-3 w-3 mr-1" />
                    {assignedClasses} {assignedClasses === 1 ? 'клас' : 'класів'}
                  </Badge>
                )}
              </div>

              {/* Exercise previews */}
              <div className="flex -space-x-2">
                {lesson.lesson_exercises?.slice(0, 5).map((le) => (
                  <div
                    key={le.id}
                    className="w-8 h-8 rounded-full bg-muted flex items-center justify-center border-2 border-background text-sm"
                    title={le.exercise?.title}
                  >
                    {le.exercise?.thumbnail_emoji || '📝'}
                  </div>
                ))}
                {exerciseCount > 5 && (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center border-2 border-background text-xs font-medium">
                    +{exerciseCount - 5}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Lesson Detail Dialog */}
      <Dialog open={!!selectedLesson} onOpenChange={() => setSelectedLesson(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-primary" />
              {selectedLesson?.title}
            </DialogTitle>
          </DialogHeader>

          {selectedLesson && (
            <div className="space-y-6">
              {/* Meta info */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Створено: {format(new Date(selectedLesson.created_at), 'd MMMM yyyy', { locale: uk })}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {selectedLesson.lesson_exercises?.reduce((acc, le) => acc + (le.exercise?.estimated_time || 0), 0)} хв
                </div>
              </div>

              {/* Assigned classes */}
              {selectedLesson.assignments && selectedLesson.assignments.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Призначено класам
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedLesson.assignments.map((assignment) => (
                      <Badge key={assignment.id} variant="outline">
                        {assignment.class_group?.name || 'Індивідуальне'}
                        {assignment.due_date && (
                          <span className="ml-1 text-muted-foreground">
                            до {format(new Date(assignment.due_date), 'd MMM', { locale: uk })}
                          </span>
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Exercises list */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <GripVertical className="h-4 w-4" />
                  Вправи ({selectedLesson.lesson_exercises?.length || 0})
                </h4>
                <div className="space-y-2">
                  {selectedLesson.lesson_exercises
                    ?.sort((a, b) => a.order_index - b.order_index)
                    .map((le, index) => (
                      <div
                        key={le.id}
                        className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                      >
                        <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                          {index + 1}
                        </span>
                        <span className="text-xl">{le.exercise?.thumbnail_emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{le.exercise?.title}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{le.exercise?.estimated_time} хв</span>
                            <Badge 
                              variant="outline" 
                              className={`text-[10px] ${getDifficultyColor(le.exercise?.difficulty || '')}`}
                            >
                              {getDifficultyLabel(le.exercise?.difficulty || '')}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!lessonToDelete} onOpenChange={() => setLessonToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Видалити урок?</AlertDialogTitle>
            <AlertDialogDescription>
              Ви впевнені, що хочете видалити урок "{lessonToDelete?.title}"? 
              Цю дію неможливо скасувати.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Скасувати</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteLesson.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Видалити'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LessonsView;
