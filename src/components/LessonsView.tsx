import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  BookOpen, Calendar, Clock, Users, Trash2, Play, Edit2,
  GripVertical, Loader2, FileText, User 
} from 'lucide-react';
import { useLessons, useDeleteLesson, Lesson } from '@/hooks/useLessons';
import { useClasses, useStudentsByClass, StudentProfile } from '@/hooks/useClasses';
import { useExercises, DbExercise } from '@/hooks/useExercises';
import { LessonEditData } from '@/components/LessonBuilder';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';

interface LessonsViewProps {
  onEditLesson?: (lesson: LessonEditData) => void;
}

const LessonsView: React.FC<LessonsViewProps> = ({ onEditLesson }) => {
  const navigate = useNavigate();
  const { data: lessons = [], isLoading } = useLessons();
  const { data: classes = [] } = useClasses();
  const { data: allExercises = [] } = useExercises();
  const deleteLesson = useDeleteLesson();
  
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [lessonToDelete, setLessonToDelete] = useState<Lesson | null>(null);
  
  // Student selection state
  const [studentSelectOpen, setStudentSelectOpen] = useState(false);
  const [lessonToStart, setLessonToStart] = useState<Lesson | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  
  const { data: studentsInClass = [] } = useStudentsByClass(selectedClassId || null);

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

  const handleEdit = (lesson: Lesson) => {
    if (!onEditLesson) return;

    // Build exercise list from lesson_exercises, sorted by order_index
    const sorted = [...(lesson.lesson_exercises || [])].sort((a, b) => a.order_index - b.order_index);
    const exerciseObjects: DbExercise[] = sorted
      .map(le => {
        // Try to find full exercise data from allExercises cache
        const full = allExercises.find(e => e.id === le.exercise_id);
        if (full) return full;
        // Fallback to partial data from the join
        if (le.exercise) {
          return {
            id: le.exercise.id,
            title: le.exercise.title,
            thumbnail_emoji: le.exercise.thumbnail_emoji,
            type: le.exercise.type as DbExercise['type'],
            difficulty: le.exercise.difficulty as DbExercise['difficulty'],
            estimated_time: le.exercise.estimated_time,
            description: null,
            subject_id: '',
            topic_id: null,
            grade_number: 0,
            content_json: {},
            external_url: null,
            created_at: '',
            updated_at: '',
          } as DbExercise;
        }
        return null;
      })
      .filter(Boolean) as DbExercise[];

    // Get first assignment's class and due date
    const firstAssignment = lesson.assignments?.[0];

    onEditLesson({
      id: lesson.id,
      title: lesson.title,
      exercises: exerciseObjects,
      classGroupId: firstAssignment?.class_group_id || null,
      dueDate: firstAssignment?.due_date || null,
    });
  };

  const openStudentSelection = (lesson: Lesson) => {
    const sortedExercises = lesson.lesson_exercises
      ?.sort((a, b) => a.order_index - b.order_index) || [];
    
    if (sortedExercises.length === 0) {
      toast.error('В уроці немає вправ');
      return;
    }
    
    setLessonToStart(lesson);
    setSelectedClassId('');
    setSelectedStudent(null);
    setStudentSelectOpen(true);
  };

  const handleStartLesson = () => {
    if (!lessonToStart || !selectedStudent) {
      toast.error('Оберіть учня');
      return;
    }

    const sortedExercises = lessonToStart.lesson_exercises
      ?.sort((a, b) => a.order_index - b.order_index) || [];
    
    if (sortedExercises.length === 0) {
      toast.error('В уроці немає вправ');
      return;
    }

    const firstExercise = sortedExercises[0].exercise;
    if (firstExercise) {
      // Find assignment for the selected student's class (if any)
      const studentClassId = selectedStudent.class_group_id;
      const matchingAssignment = studentClassId 
        ? lessonToStart.assignments?.find(a => a.class_group_id === studentClassId)
        : undefined;

      sessionStorage.setItem('currentLesson', JSON.stringify({
        lessonId: lessonToStart.id,
        lessonTitle: lessonToStart.title,
        exercises: sortedExercises.map(le => le.exercise?.id).filter(Boolean),
        currentIndex: 0,
        studentId: selectedStudent.id,
        studentName: selectedStudent.nickname,
        studentEmoji: selectedStudent.avatar_emoji,
        assignmentId: matchingAssignment?.id || undefined,
      }));
      
      setStudentSelectOpen(false);
      setSelectedLesson(null);
      navigate(`/play/game/${firstExercise.id}`);
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
              className="p-5 hover:shadow-lg transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div 
                  className="flex items-center gap-3 cursor-pointer flex-1"
                  onClick={() => setSelectedLesson(lesson)}
                >
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
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {onEditLesson && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(lesson);
                      }}
                    >
                      <Edit2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLessonToDelete(lesson);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
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
              <div className="flex items-center justify-between">
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
                <Button 
                  size="sm" 
                  onClick={() => openStudentSelection(lesson)}
                  disabled={exerciseCount === 0}
                >
                  <Play className="h-4 w-4 mr-1" />
                  Почати
                </Button>
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
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            if (le.exercise) {
                              navigate(`/play/game/${le.exercise.id}`);
                              setSelectedLesson(null);
                            }
                          }}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t flex gap-2">
                {onEditLesson && (
                  <Button 
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      handleEdit(selectedLesson);
                      setSelectedLesson(null);
                    }}
                  >
                    <Edit2 className="h-5 w-5 mr-2" />
                    Редагувати
                  </Button>
                )}
                <Button 
                  className="flex-1" 
                  size="lg"
                  onClick={() => {
                    openStudentSelection(selectedLesson);
                  }}
                  disabled={(selectedLesson.lesson_exercises?.length || 0) === 0}
                >
                  <Play className="h-5 w-5 mr-2" />
                  Почати урок
                </Button>
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

      {/* Student Selection Dialog */}
      <Dialog open={studentSelectOpen} onOpenChange={setStudentSelectOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Оберіть учня
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Class Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Клас</label>
              <Select
                value={selectedClassId}
                onValueChange={(value) => {
                  setSelectedClassId(value);
                  setSelectedStudent(null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Оберіть клас" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name} ({cls.grade} клас)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Student Selection */}
            {selectedClassId && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Учень</label>
                {studentsInClass.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-2">
                    В цьому класі немає учнів
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {studentsInClass.map((student) => (
                      <button
                        key={student.id}
                        onClick={() => setSelectedStudent(student)}
                        className={`flex items-center gap-2 p-3 rounded-lg border transition-all text-left ${
                          selectedStudent?.id === student.id
                            ? 'border-primary bg-primary/10 ring-2 ring-primary'
                            : 'border-border hover:border-primary/50 hover:bg-muted/50'
                        }`}
                      >
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
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setStudentSelectOpen(false)}
            >
              Скасувати
            </Button>
            <Button
              className="flex-1"
              onClick={handleStartLesson}
              disabled={!selectedStudent}
            >
              <Play className="h-4 w-4 mr-2" />
              Почати
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LessonsView;
