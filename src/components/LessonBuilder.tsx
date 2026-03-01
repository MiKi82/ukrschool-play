import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GripVertical, X, Clock, Plus, Save, 
  ChevronUp, ChevronDown, BookOpen, Users, Search, Library, Loader2
} from 'lucide-react';
import { DbExercise, useExercises, useSubjects } from '@/hooks/useExercises';
import { useClasses } from '@/hooks/useClasses';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
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

export interface LessonEditData {
  id: string;
  title: string;
  exercises: DbExercise[];
  classGroupId?: string | null;
  dueDate?: string | null;
}

interface LessonBuilderProps {
  open: boolean;
  onClose: () => void;
  initialExercises?: DbExercise[];
  editLesson?: LessonEditData | null;
}

const LessonBuilder: React.FC<LessonBuilderProps> = ({ open, onClose, initialExercises = [], editLesson = null }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: classes = [] } = useClasses();
  const { data: allExercises = [], isLoading: exercisesLoading } = useExercises();
  const { data: subjects = [] } = useSubjects();
  
  const [lessonTitle, setLessonTitle] = useState('');
  const [exercises, setExercises] = useState<DbExercise[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Drag-and-drop: only commit reorder on drop, not on hover
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  
  // Library filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  // Track whether form has been initialized for this open cycle
  const initializedRef = useRef(false);

  // Initialize form state when dialog opens
  useEffect(() => {
    if (open && !initializedRef.current) {
      initializedRef.current = true;
      if (editLesson) {
        setLessonTitle(editLesson.title);
        setExercises(editLesson.exercises);
        setSelectedClassId(editLesson.classGroupId || null);
        setDueDate(editLesson.dueDate ? editLesson.dueDate.split('T')[0] : '');
      } else if (initialExercises.length > 0) {
        setExercises(initialExercises);
      }
    }
    if (!open) {
      initializedRef.current = false;
    }
  }, [open, editLesson, initialExercises]);

  const isEditMode = !!editLesson;

  const totalTime = exercises.reduce((sum, ex) => sum + ex.estimated_time, 0);

  // Filter available exercises (exclude already added)
  const availableExercises = useMemo(() => {
    const addedIds = new Set(exercises.map(e => e.id));
    let filtered = allExercises.filter(e => !addedIds.has(e.id));
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(e => 
        e.title.toLowerCase().includes(query) ||
        e.description?.toLowerCase().includes(query)
      );
    }
    
    if (selectedSubject) {
      filtered = filtered.filter(e => e.subject_id === selectedSubject);
    }
    
    return filtered;
  }, [allExercises, exercises, searchQuery, selectedSubject]);

  // Add exercise from library
  const addExercise = (exercise: DbExercise) => {
    setExercises(prev => [...prev, exercise]);
  };

  // Stable drag-and-drop: track drop target visually, reorder only on drop
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) {
      if (dropTargetIndex !== null && draggedIndex === index) setDropTargetIndex(null);
      return;
    }
    setDropTargetIndex(index);
  };

  const handleDrop = useCallback((e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDropTargetIndex(null);
      return;
    }
    setExercises(prev => {
      const next = [...prev];
      const [item] = next.splice(draggedIndex, 1);
      next.splice(targetIndex, 0, item);
      return next;
    });
    setDraggedIndex(null);
    setDropTargetIndex(null);
  }, [draggedIndex]);

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDropTargetIndex(null);
  };

  // Move exercise up/down
  const moveExercise = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= exercises.length) return;

    setExercises(prev => {
      const next = [...prev];
      [next[index], next[newIndex]] = [next[newIndex], next[index]];
      return next;
    });
  };

  // Remove exercise
  const removeExercise = (index: number) => {
    setExercises(prev => prev.filter((_, i) => i !== index));
  };

  // Save lesson (create or update) with rollback on failure
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
      if (isEditMode) {
        // --- UPDATE existing lesson ---
        const lessonId = editLesson!.id;

        // Update lesson title
        const { error: updateError } = await supabase
          .from('lessons')
          .update({ title: lessonTitle })
          .eq('id', lessonId);
        if (updateError) throw updateError;

        // Replace lesson_exercises: delete old, insert new
        const { error: deleteExError } = await supabase
          .from('lesson_exercises')
          .delete()
          .eq('lesson_id', lessonId);
        if (deleteExError) throw deleteExError;

        const lessonExercises = exercises.map((ex, index) => ({
          lesson_id: lessonId,
          exercise_id: ex.id,
          order_index: index,
        }));

        const { error: insertExError } = await supabase
          .from('lesson_exercises')
          .insert(lessonExercises);
        if (insertExError) throw insertExError;

        // Handle assignment: delete old assignments for this lesson, re-create if class selected
        const { error: deleteAssignError } = await supabase
          .from('assignments')
          .delete()
          .eq('lesson_id', lessonId);
        if (deleteAssignError) throw deleteAssignError;

        if (selectedClassId) {
          const { error: assignError } = await supabase
            .from('assignments')
            .insert({
              lesson_id: lessonId,
              class_group_id: selectedClassId,
              due_date: dueDate || null,
            });
          if (assignError) throw assignError;
        }

        toast.success('Урок успішно оновлено!');
      } else {
        // --- CREATE new lesson ---
        const { data: lesson, error: lessonError } = await supabase
          .from('lessons')
          .insert({
            title: lessonTitle,
            teacher_id: user.id,
          })
          .select()
          .single();
        if (lessonError) throw lessonError;

        const lessonExercises = exercises.map((ex, index) => ({
          lesson_id: lesson.id,
          exercise_id: ex.id,
          order_index: index,
        }));

        const { error: exercisesError } = await supabase
          .from('lesson_exercises')
          .insert(lessonExercises);

        if (exercisesError) {
          // Rollback: delete the partially created lesson
          await supabase.from('lessons').delete().eq('id', lesson.id);
          throw exercisesError;
        }

        if (selectedClassId) {
          const { error: assignmentError } = await supabase
            .from('assignments')
            .insert({
              lesson_id: lesson.id,
              class_group_id: selectedClassId,
              due_date: dueDate || null,
            });

          if (assignmentError) {
            // Rollback: delete exercises and lesson
            await supabase.from('lesson_exercises').delete().eq('lesson_id', lesson.id);
            await supabase.from('lessons').delete().eq('id', lesson.id);
            throw assignmentError;
          }
        }

        toast.success('Урок успішно створено!');
      }

      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      resetAndClose();
    } catch (error) {
      console.error('Error saving lesson:', error);
      toast.error(isEditMode ? 'Помилка при оновленні уроку' : 'Помилка при створенні уроку');
    } finally {
      setIsSaving(false);
    }
  };

  const resetAndClose = () => {
    setLessonTitle('');
    setExercises([]);
    setSelectedClassId(null);
    setDueDate('');
    setSearchQuery('');
    setSelectedSubject(null);
    onClose();
  };

  // Prevent accidental close: only close on explicit cancel/save
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      // User clicked overlay or pressed Escape — only close, don't reset yet
      // We reset in resetAndClose which is called from cancel button and after save
      resetAndClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {isEditMode ? 'Редагувати урок' : 'Конструктор уроку'}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="lesson" className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2 flex-shrink-0">
            <TabsTrigger value="lesson" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Урок ({exercises.length})
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center gap-2">
              <Library className="h-4 w-4" />
              Бібліотека
            </TabsTrigger>
          </TabsList>

          {/* Lesson Tab */}
          <TabsContent value="lesson" className="flex-1 min-h-0 overflow-y-auto space-y-6 py-4 pr-1">
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
                    <p className="text-sm">Перейдіть у вкладку "Бібліотека" щоб додати</p>
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
                      onDrop={(e) => handleDrop(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`cursor-move transition-all ${
                        draggedIndex === index ? 'opacity-50 scale-95' : ''
                      } ${
                        dropTargetIndex === index ? 'border-primary border-2' : ''
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
          </TabsContent>

          {/* Library Tab */}
          <TabsContent value="library" className="flex-1 min-h-0 overflow-hidden flex flex-col space-y-4 py-4">
            {/* Search and Filter */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Пошук вправ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedSubject || 'all'} onValueChange={(v) => setSelectedSubject(v === 'all' ? null : v)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Предмет" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Всі предмети</SelectItem>
                  {subjects.map(subject => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Available Exercises */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              {exercisesLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : availableExercises.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Вправ не знайдено</p>
                </div>
              ) : (
                <div className="space-y-2 pr-2">
                  {availableExercises.map(exercise => (
                    <Card 
                      key={exercise.id} 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => addExercise(exercise)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{exercise.thumbnail_emoji}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{exercise.title}</p>
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
                                {exercise.grade_number} клас
                              </Badge>
                            </div>
                          </div>
                          <Button size="sm" variant="ghost">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2 pt-4 border-t">
          <Button variant="outline" onClick={resetAndClose}>
            Скасувати
          </Button>
          <Button onClick={handleSave} disabled={isSaving || exercises.length === 0}>
            {isSaving ? (
              <>Збереження...</>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {isEditMode ? 'Оновити урок' : 'Зберегти урок'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LessonBuilder;
