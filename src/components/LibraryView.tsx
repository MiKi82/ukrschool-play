import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Search, Play, Eye, ExternalLink, Calculator, BookOpen, 
  Loader2, Filter, X, Plus, GripVertical
} from 'lucide-react';
import { useExercises, useSubjects, useTopics, DbExercise } from '@/hooks/useExercises';

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

const GRADES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

interface LibraryViewProps {
  onOpenLessonBuilder?: (selectedExercises: DbExercise[]) => void;
}

const LibraryView: React.FC<LibraryViewProps> = ({ onOpenLessonBuilder }) => {
  const navigate = useNavigate();
  
  // Filter state
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selection state for lesson builder
  const [selectedExercises, setSelectedExercises] = useState<Set<string>>(new Set());
  const [selectionMode, setSelectionMode] = useState(false);
  
  // Preview state
  const [previewExercise, setPreviewExercise] = useState<DbExercise | null>(null);

  // Data fetching with filters
  const { data: subjects = [] } = useSubjects();
  const { data: topics = [] } = useTopics(selectedSubject || undefined, selectedGrade || undefined);
  const { data: exercises = [], isLoading } = useExercises({
    subjectId: selectedSubject || undefined,
    gradeNumber: selectedGrade || undefined,
    topicId: selectedTopic || undefined,
  });

  // Filter exercises by search query
  const filteredExercises = useMemo(() => {
    if (!searchQuery.trim()) return exercises;
    const query = searchQuery.toLowerCase();
    return exercises.filter(e => 
      e.title.toLowerCase().includes(query) ||
      e.description?.toLowerCase().includes(query)
    );
  }, [exercises, searchQuery]);

  // Reset dependent filters when parent changes
  const handleSubjectChange = (value: string) => {
    const newValue = value === 'all' ? null : value;
    setSelectedSubject(newValue);
    setSelectedGrade(null);
    setSelectedTopic(null);
  };

  const handleGradeChange = (value: string) => {
    const newValue = value === 'all' ? null : parseInt(value);
    setSelectedGrade(newValue);
    setSelectedTopic(null);
  };

  const handleTopicChange = (value: string) => {
    setSelectedTopic(value === 'all' ? null : value);
  };

  const clearFilters = () => {
    setSelectedSubject(null);
    setSelectedGrade(null);
    setSelectedTopic(null);
    setSearchQuery('');
  };

  const hasActiveFilters = selectedSubject || selectedGrade || selectedTopic || searchQuery;

  // Selection handlers
  const toggleExerciseSelection = (exerciseId: string) => {
    setSelectedExercises(prev => {
      const next = new Set(prev);
      if (next.has(exerciseId)) {
        next.delete(exerciseId);
      } else {
        next.add(exerciseId);
      }
      return next;
    });
  };

  const handleCreateLesson = () => {
    const selected = exercises.filter(e => selectedExercises.has(e.id));
    if (onOpenLessonBuilder) {
      onOpenLessonBuilder(selected);
    }
  };

  const getSubjectIcon = (subjectName: string) => {
    if (subjectName === 'Математика') return <Calculator className="h-4 w-4" />;
    return <BookOpen className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Filters Row */}
      <div className="flex flex-wrap gap-4 items-start">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Пошук вправ..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary transition-all" 
          />
        </div>

        {/* Cascading Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          <Filter className="h-4 w-4 text-muted-foreground" />
          
          {/* Subject Filter */}
          <Select value={selectedSubject || 'all'} onValueChange={handleSubjectChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Предмет" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Всі предмети</SelectItem>
              {subjects.map(subject => (
                <SelectItem key={subject.id} value={subject.id}>
                  <span className="flex items-center gap-2">
                    {getSubjectIcon(subject.name)}
                    {subject.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Grade Filter */}
          <Select 
            value={selectedGrade?.toString() || 'all'} 
            onValueChange={handleGradeChange}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Клас" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Всі класи</SelectItem>
              {GRADES.map(grade => (
                <SelectItem key={grade} value={grade.toString()}>
                  {grade} клас
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Topic Filter - only show if subject and grade are selected */}
          {selectedSubject && selectedGrade && topics.length > 0 && (
            <Select value={selectedTopic || 'all'} onValueChange={handleTopicChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Тема" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Всі теми</SelectItem>
                {topics.map(topic => (
                  <SelectItem key={topic.id} value={topic.id}>
                    <span className="flex items-center gap-2">
                      <span>{topic.icon}</span>
                      {topic.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Очистити
            </Button>
          )}
        </div>
      </div>

      {/* Selection Mode Toggle & Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant={selectionMode ? "default" : "outline"} 
            size="sm"
            onClick={() => {
              setSelectionMode(!selectionMode);
              if (selectionMode) setSelectedExercises(new Set());
            }}
          >
            <GripVertical className="h-4 w-4 mr-2" />
            {selectionMode ? 'Вимкнути вибір' : 'Вибрати для уроку'}
          </Button>
          
          {selectionMode && selectedExercises.size > 0 && (
            <span className="text-sm text-muted-foreground">
              Обрано: {selectedExercises.size}
            </span>
          )}
        </div>

        {selectionMode && selectedExercises.size > 0 && (
          <Button onClick={handleCreateLesson}>
            <Plus className="h-4 w-4 mr-2" />
            Створити урок ({selectedExercises.size})
          </Button>
        )}
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Знайдено: {filteredExercises.length} вправ
      </div>

      {/* Exercise Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredExercises.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium text-foreground mb-2">Вправ не знайдено</p>
          <p className="text-muted-foreground">Спробуйте змінити фільтри</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map(exercise => (
            <Card 
              key={exercise.id} 
              className={`overflow-hidden group hover:shadow-lg transition-all ${
                selectionMode && selectedExercises.has(exercise.id) 
                  ? 'ring-2 ring-primary' 
                  : ''
              }`}
            >
              <div 
                className="h-24 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center cursor-pointer relative"
                onClick={() => selectionMode ? toggleExerciseSelection(exercise.id) : setPreviewExercise(exercise)}
              >
                {selectionMode && (
                  <div className="absolute top-2 left-2">
                    <Checkbox 
                      checked={selectedExercises.has(exercise.id)}
                      onCheckedChange={() => toggleExerciseSelection(exercise.id)}
                      className="h-5 w-5"
                    />
                  </div>
                )}
                <span className="text-5xl group-hover:scale-110 transition-transform">
                  {exercise.thumbnail_emoji}
                </span>
              </div>
              <CardContent className="p-5">
                <h3 
                  className="text-lg font-bold text-foreground mb-2 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => setPreviewExercise(exercise)}
                >
                  {exercise.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {exercise.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant={exercise.difficulty === 'EASY' ? 'easy' : exercise.difficulty === 'MEDIUM' ? 'medium' : 'hard'}>
                    {difficultyLabels[exercise.difficulty]}
                  </Badge>
                  <Badge variant="secondary">{exerciseTypeLabels[exercise.type]}</Badge>
                  <Badge variant="outline">{exercise.grade_number} клас</Badge>
                  {exercise.subjects && (
                    <Badge variant="outline">{exercise.subjects.name}</Badge>
                  )}
                </div>
                <div className="flex gap-2 pt-3 border-t border-border">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => navigate(`/play/game/${exercise.id}`)}
                  >
                    <Play className="mr-1 h-4 w-4" />
                    Грати
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setPreviewExercise(exercise)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {exercise.type === 'EXTERNAL_LINK' && exercise.external_url && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open(exercise.external_url!, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={!!previewExercise} onOpenChange={() => setPreviewExercise(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <span className="text-4xl">{previewExercise?.thumbnail_emoji}</span>
              <span>{previewExercise?.title}</span>
            </DialogTitle>
          </DialogHeader>
          {previewExercise && (
            <div className="space-y-4">
              <p className="text-muted-foreground">{previewExercise.description}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant={previewExercise.difficulty === 'EASY' ? 'easy' : previewExercise.difficulty === 'MEDIUM' ? 'medium' : 'hard'}>
                  {difficultyLabels[previewExercise.difficulty]}
                </Badge>
                <Badge variant="secondary">{exerciseTypeLabels[previewExercise.type]}</Badge>
                <Badge variant="outline">{previewExercise.grade_number} клас</Badge>
                <Badge variant="outline">~{previewExercise.estimated_time} хв</Badge>
                {previewExercise.subjects && (
                  <Badge variant="outline">{previewExercise.subjects.name}</Badge>
                )}
                {previewExercise.topics && (
                  <Badge variant="outline">{previewExercise.topics.icon} {previewExercise.topics.name}</Badge>
                )}
              </div>
              <div className="flex gap-3 pt-4">
                <Button className="flex-1" onClick={() => {
                  setPreviewExercise(null);
                  navigate(`/play/game/${previewExercise.id}`);
                }}>
                  <Play className="mr-2 h-4 w-4" />
                  Почати гру
                </Button>
                {previewExercise.type === 'EXTERNAL_LINK' && previewExercise.external_url && (
                  <Button variant="outline" onClick={() => window.open(previewExercise.external_url!, '_blank')}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Відкрити
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LibraryView;
