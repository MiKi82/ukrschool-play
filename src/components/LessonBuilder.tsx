import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  GripVertical, X, Clock, Plus, Save, Trash2, 
  ChevronUp, ChevronDown, BookOpen, Users
} from 'lucide-react';
import { DbExercise } from '@/hooks/useExercises';
import { useClasses } from '@/hooks/useClasses';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const difficultyLabels: Record<string, string> = {
  EASY: 'Легко',
  MEDIUM: 'Середньо', 
  HARD: 'Складно',
};

const exerciseTypeLabels: Record<string, string> = {
  MATCHING: 'Пари',
  DRAG_DROP: 'Перетягування',
  QUIZ: 'Тест',
  FILL_IN: 'Заповнення',
  EXTERNAL_LINK: 'Зовнішнє',
  CROSSWORD: 'Кросворд',
  REBUS: 'Ребус',
};

interface LessonBuilderProps {
  open: boolean;
  onClose: () => void;
  initialExercises?: DbExercise[];
}

const LessonBuilder: React.FC<LessonBuilderProps> = ({ open, onClose, initialExercises = [] }) => {
  const { user } = useAuth();
  const { data: classes = [] } = useClasses();
  
  const [lessonTitle, setLessonTitle] = useState('');
  const [exercises, setExercises] = useState<DbExercise[]>(initialExercises);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Update exercises when initialExercises changes
  React.useEffect(() => {
    if (initialExercises.length > 0) {
      setExercises(initialExercises);
    }
  }, [initialExercises]);

  const totalTime = exercises.reduce((sum, ex) => sum + ex.estimated_time, 0);

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newExercises = [...exercises];
    const [draggedItem] = newExercises.splice(draggedIndex, 1);
    newExercises.splice(index, 0, draggedItem);
    setExercises(newExercises);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Move exercise up/down
  const moveExercise = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= exercises.length) return;

    const newExercises = [...exercises];
    [newExercises[index], newExercises[newIndex]] = [newExercises[newIndex], newExercises[index]];
    setExercises(newExercises);
  };

  // Remove exercise
  const removeExercise = (index: number) => {
    setExercises(prev => prev.filter((_, i) => i !== index));
  };

  // Save lesson and create assignment
  const handleSave = async () => {
    if (!lessonTitle.trim()) {
      toast.error('Введіть назву уроку');
      return;
    }
    if (exercises.length === 0) {
      toast.error('Додайте хоча б одну вправу');
      return;
    }
    if (!user) {
      toast.error('Потрібно увійти в систему');
      return;
    }

    setIsSaving(true);
    try {
      // Create lesson
      const { data: lesson, error: lessonError } = await supabase
        .from('lessons')
        .insert({
          title: lessonTitle,
          teacher_id: user.id,
        })
        .select()
        .single();

      if (lessonError) throw lessonError;

      // Add exercises to lesson
      const lessonExercises = exercises.map((ex, index) => ({
        lesson_id: lesson.id,
        exercise_id: ex.id,
        order_index: index,
      }));

      const { error: exercisesError } = await supabase
        .from('lesson_exercises')
        .insert(lessonExercises);

      if (exercisesError) throw exercisesError;

      // Create assignment if class is selected
      if (selectedClassId) {
        const { error: assignmentError } = await supabase
          .from('assignments')
          .insert({
            lesson_id: lesson.id,
            class_group_id: selectedClassId,
            due_date: dueDate || null,
          });

        if (assignmentError) throw assignmentError;
      }

      toast.success('Урок успішно створено!');
      handleClose();
    } catch (error) {
      console.error('Error creating lesson:', error);
      toast.error('Помилка при створенні уроку');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setLessonTitle('');
    setExercises([]);
    setSelectedClassId(null);
    setDueDate('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Конструктор уроку
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Lesson Title */}
          <div className="space-y-2">
            <Label htmlFor="lessonTitle">Назва уроку</Label>
            <Input
              id="lessonTitle"
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
              placeholder="Введіть назву уроку..."
            />
          </div>

          {/* Exercises List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Вправи ({exercises.length})</Label>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Загальний час: ~{totalTime} хв
              </div>
            </div>

            {exercises.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-8 text-center text-muted-foreground">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Вправи не додано</p>
                  <p className="text-sm">Виберіть вправи з бібліотеки</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {exercises.map((exercise, index) => (
                  <Card
                    key={`${exercise.id}-${index}`}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`cursor-move transition-all ${
                      draggedIndex === index ? 'opacity-50 scale-95' : ''
                    }`}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <GripVertical className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        
                        <span className="text-2xl flex-shrink-0">{exercise.thumbnail_emoji}</span>
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {index + 1}. {exercise.title}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {exerciseTypeLabels[exercise.type]}
                            </Badge>
                            <Badge 
                              variant={exercise.difficulty === 'EASY' ? 'easy' : exercise.difficulty === 'MEDIUM' ? 'medium' : 'hard'}
                              className="text-xs"
                            >
                              {difficultyLabels[exercise.difficulty]}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              ~{exercise.estimated_time} хв
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => moveExercise(index, 'up')}
                            disabled={index === 0}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => moveExercise(index, 'down')}
                            disabled={index === exercises.length - 1}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => removeExercise(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Assignment Settings */}
          <div className="space-y-4 pt-4 border-t border-border">
            <Label className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Призначити класу (опціонально)
            </Label>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="class">Клас</Label>
                <Select value={selectedClassId || ''} onValueChange={setSelectedClassId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Виберіть клас" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map(cls => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name} ({cls.grade} клас)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Дата виконання</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            Скасувати
          </Button>
          <Button onClick={handleSave} disabled={isSaving || exercises.length === 0}>
            {isSaving ? (
              <>Збереження...</>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Зберегти урок
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LessonBuilder;
