import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, Home, Star, ArrowRight, Sparkles,
  BookOpen, Calculator
} from 'lucide-react';
import { subjects, exercises, students, difficultyLabels, exerciseTypeLabels } from '@/data/seedData';
import { Exercise } from '@/types';

const PlayPage = () => {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const filteredExercises = selectedSubject 
    ? exercises.filter(e => e.subjectId === selectedSubject)
    : exercises;

  if (selectedExercise) {
    return (
      <Link to={`/play/game/${selectedExercise.id}`} className="block">
        <GamePreview 
          exercise={selectedExercise} 
          onBack={() => setSelectedExercise(null)}
        />
      </Link>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary-light/30 to-accent/10">
      {/* Header */}
      <header className="py-4 px-4 border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-extrabold text-primary">УкрШкола</span>
          </Link>
          <Button variant="outline" size="sm" asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Головна
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Student Selection */}
        {!selectedStudent ? (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-extrabold text-foreground mb-2">
                Привіт! 👋
              </h1>
              <p className="text-xl text-muted-foreground">
                Хто буде грати сьогодні?
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {students.map(student => (
                <Card
                  key={student.id}
                  variant="interactive"
                  className="p-6 text-center cursor-pointer group"
                  onClick={() => setSelectedStudent(student.id)}
                >
                  <div className="text-5xl mb-3 group-hover:animate-bounce-slow">
                    {student.avatarEmoji}
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{student.nickname}</h3>
                </Card>
              ))}
              <Card
                variant="interactive"
                className="p-6 text-center cursor-pointer group border-dashed"
                onClick={() => setSelectedStudent('guest')}
              >
                <div className="text-5xl mb-3 group-hover:animate-bounce-slow">🎮</div>
                <h3 className="text-lg font-bold text-foreground">Гість</h3>
              </Card>
            </div>
          </div>
        ) : (
          <>
            {/* Welcome & Subject Selection */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">
                    {students.find(s => s.id === selectedStudent)?.avatarEmoji || '🎮'}
                  </span>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">
                      Вітаємо, {students.find(s => s.id === selectedStudent)?.nickname || 'Гість'}!
                    </h1>
                    <p className="text-muted-foreground">Обери предмет та почни грати</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedStudent(null)}>
                  Змінити гравця
                </Button>
              </div>

              {/* Subject Pills */}
              <div className="flex flex-wrap gap-3 mb-6">
                <Button
                  variant={selectedSubject === null ? "default" : "outline"}
                  size="lg"
                  onClick={() => setSelectedSubject(null)}
                  className="rounded-full"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Всі предмети
                </Button>
                {subjects.map(subject => (
                  <Button
                    key={subject.id}
                    variant={selectedSubject === subject.id ? "default" : "outline"}
                    size="lg"
                    onClick={() => setSelectedSubject(subject.id)}
                    className="rounded-full"
                  >
                    {subject.id === 'math' ? (
                      <Calculator className="mr-2 h-5 w-5" />
                    ) : (
                      <BookOpen className="mr-2 h-5 w-5" />
                    )}
                    {subject.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Exercises Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExercises.map(exercise => (
                <Card
                  key={exercise.id}
                  variant="game"
                  className="overflow-hidden cursor-pointer group"
                  onClick={() => setSelectedExercise(exercise)}
                >
                  <div className="h-32 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <span className="text-6xl group-hover:animate-bounce-slow">
                      {exercise.thumbnailEmoji}
                    </span>
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-foreground line-clamp-2">
                        {exercise.title}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {exercise.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
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
                        <span>~{exercise.estimatedTime} хв</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

// Game Preview Component
const GamePreview: React.FC<{ exercise: Exercise; onBack: () => void }> = ({ exercise }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light/50 to-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="text-7xl mb-6 animate-bounce-slow">{exercise.thumbnailEmoji}</div>
        <h1 className="text-2xl font-bold text-foreground mb-2">{exercise.title}</h1>
        <p className="text-muted-foreground mb-6">{exercise.description}</p>
        <div className="flex justify-center gap-2 mb-6">
          <Badge variant={
            exercise.difficulty === 'EASY' ? 'easy' :
            exercise.difficulty === 'MEDIUM' ? 'medium' : 'hard'
          }>
            {difficultyLabels[exercise.difficulty]}
          </Badge>
          <Badge variant="info">~{exercise.estimatedTime} хв</Badge>
        </div>
        <div className="flex items-center justify-center gap-2 text-accent-foreground mb-6">
          {[...Array(3)].map((_, i) => (
            <Star key={i} className="h-6 w-6 text-accent fill-accent" />
          ))}
        </div>
        <Button size="xl" variant="hero" className="w-full">
          <Sparkles className="mr-2 h-6 w-6" />
          Почати гру
          <ArrowRight className="ml-2 h-6 w-6" />
        </Button>
      </Card>
    </div>
  );
};

export default PlayPage;
