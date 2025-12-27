import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, Home, Star, ArrowRight, Sparkles,
  BookOpen, Calculator, Loader2, Users, Play, Eye, ExternalLink, LayoutDashboard
} from 'lucide-react';
import { useExercises, useSubjects, DbExercise } from '@/hooks/useExercises';
import { useAllStudents } from '@/hooks/useStudentProgress';

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

interface StudentWithClass {
  id: string;
  nickname: string;
  avatar_emoji: string;
  photo_url: string | null;
  class_group_id: string | null;
  class_groups?: { name: string; grade: number } | null;
}

const PlayPage = () => {
  const [selectedStudent, setSelectedStudent] = useState<StudentWithClass | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<DbExercise | null>(null);
  const navigate = useNavigate();

  const { data: allStudents = [], isLoading: studentsLoading } = useAllStudents();
  const { data: subjects = [], isLoading: subjectsLoading } = useSubjects();
  const { data: exercises = [], isLoading: exercisesLoading } = useExercises(
    selectedSubject ? { subjectId: selectedSubject } : undefined
  );

  const isLoading = subjectsLoading || exercisesLoading || studentsLoading;

  if (selectedExercise) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="text-7xl mb-6 animate-bounce">{selectedExercise.thumbnail_emoji}</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">{selectedExercise.title}</h1>
          <p className="text-muted-foreground mb-6">{selectedExercise.description}</p>
          <div className="flex justify-center gap-2 mb-6">
            <Badge variant={
              selectedExercise.difficulty === 'EASY' ? 'easy' :
              selectedExercise.difficulty === 'MEDIUM' ? 'medium' : 'hard'
            }>
              {difficultyLabels[selectedExercise.difficulty]}
            </Badge>
            <Badge variant="secondary">~{selectedExercise.estimated_time} хв</Badge>
          </div>
          <div className="flex items-center justify-center gap-2 text-secondary mb-6">
            {[...Array(3)].map((_, i) => (
              <Star key={i} className="h-6 w-6 fill-secondary" />
            ))}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setSelectedExercise(null)} className="flex-1">
              Назад
            </Button>
            <Button 
              size="lg" 
              className="flex-1"
              onClick={() => navigate(`/play/game/${selectedExercise.id}?student=${selectedStudent?.id}`)}
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Почати гру
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-secondary/10">
      {/* Header */}
      <header className="py-3 sm:py-4 px-3 sm:px-4 border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between gap-2">
          <Link to="/" className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary flex items-center justify-center">
              <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
            </div>
            <span className="text-lg sm:text-xl font-extrabold text-primary">УкрШкола</span>
          </Link>
          <Button variant="outline" size="sm" asChild className="hidden sm:flex">
            <Link to="/dashboard">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Меню вчителя
            </Link>
          </Button>
          <Button variant="outline" size="icon" asChild className="sm:hidden h-8 w-8">
            <Link to="/dashboard">
              <LayoutDashboard className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Student Selection */}
        {!selectedStudent ? (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground mb-2">
                Привіт! 👋
              </h1>
              <p className="text-base sm:text-xl text-muted-foreground">
                Хто буде грати сьогодні?
              </p>
            </div>

            {studentsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : allStudents.length === 0 ? (
              <Card className="p-8 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Немає зареєстрованих учнів
                </h3>
                <p className="text-muted-foreground mb-4">
                  Щоб грати та зберігати прогрес, попросіть вчителя додати учнів у систему
                </p>
                <Button variant="outline" asChild>
                  <Link to="/dashboard">Перейти до панелі вчителя</Link>
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {allStudents.map((student) => (
                  <Card
                    key={student.id}
                    className="p-6 text-center cursor-pointer hover:shadow-lg hover:scale-105 transition-all"
                    onClick={() => setSelectedStudent(student as StudentWithClass)}
                  >
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                      {student.photo_url ? (
                        <img 
                          src={student.photo_url} 
                          alt={student.nickname} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl">{student.avatar_emoji}</span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{student.nickname}</h3>
                    {student.class_groups && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {student.class_groups.name}
                      </p>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Welcome & Subject Selection */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
                    {selectedStudent.photo_url ? (
                      <img 
                        src={selectedStudent.photo_url} 
                        alt={selectedStudent.nickname} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl sm:text-3xl">{selectedStudent.avatar_emoji}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-lg sm:text-2xl font-bold text-foreground truncate">
                      Вітаємо, {selectedStudent.nickname}!
                    </h1>
                    <p className="text-sm sm:text-base text-muted-foreground">Обери предмет та почни грати</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedStudent(null)} className="self-start sm:self-center">
                  Змінити гравця
                </Button>
              </div>

              {/* Subject Pills */}
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 overflow-x-auto pb-2">
                <Button
                  variant={selectedSubject === null ? "default" : "outline"}
                  size="default"
                  onClick={() => setSelectedSubject(null)}
                  className="rounded-full shrink-0 text-sm sm:text-base"
                >
                  <Sparkles className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Всі
                </Button>
                {subjects.map(subject => (
                  <Button
                    key={subject.id}
                    variant={selectedSubject === subject.id ? "default" : "outline"}
                    size="default"
                    onClick={() => setSelectedSubject(subject.id)}
                    className="rounded-full shrink-0 text-sm sm:text-base"
                  >
                    {subject.name === 'Математика' ? (
                      <Calculator className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <BookOpen className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                    <span className="hidden xs:inline">{subject.name}</span>
                    <span className="xs:hidden">{subject.name.slice(0, 4)}.</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Завантаження...</span>
              </div>
            ) : exercises.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Вправи не знайдено</p>
              </div>
            ) : (
              /* Exercises Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exercises.map(exercise => (
                  <Card
                    key={exercise.id}
                    className="overflow-hidden hover:shadow-lg transition-all group"
                  >
                    <div 
                      className="h-32 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center cursor-pointer"
                      onClick={() => setSelectedExercise(exercise)}
                    >
                      <span className="text-6xl group-hover:scale-110 transition-transform">{exercise.thumbnail_emoji}</span>
                    </div>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-2">
                        <h3 
                          className="text-lg font-bold text-foreground line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                          onClick={() => setSelectedExercise(exercise)}
                        >
                          {exercise.title}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {exercise.description}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex gap-2 flex-wrap">
                          <Badge variant={
                            exercise.difficulty === 'EASY' ? 'easy' :
                            exercise.difficulty === 'MEDIUM' ? 'medium' : 'hard'
                          }>
                            {difficultyLabels[exercise.difficulty]}
                          </Badge>
                          <Badge variant="secondary">
                            {exerciseTypeLabels[exercise.type]}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground text-sm">
                          <span>~{exercise.estimated_time} хв</span>
                        </div>
                      </div>
                      
                      {/* Interactive Buttons */}
                      <div className="flex gap-2 pt-3 border-t border-border">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => navigate(`/play/game/${exercise.id}?student=${selectedStudent?.id}`)}
                        >
                          <Play className="mr-1 h-4 w-4" />
                          Грати
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedExercise(exercise)}
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
          </>
        )}
      </main>
    </div>
  );
};

export default PlayPage;
