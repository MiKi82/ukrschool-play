import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, Home, Users, BookOpen, BarChart3, Settings,
  ChevronRight, Plus, Play, Clock, CheckCircle2, Search, Filter,
  Menu, X, Calculator
} from 'lucide-react';
import { 
  subjects, exercises, classGroups, students, 
  difficultyLabels, exerciseTypeLabels, topics 
} from '@/data/seedData';
import { Exercise } from '@/types';

type SidebarItem = 'dashboard' | 'classes' | 'library' | 'analytics' | 'settings';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState<SidebarItem>('dashboard');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const sidebarItems: { id: SidebarItem; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Головна', icon: <Home className="h-5 w-5" /> },
    { id: 'classes', label: 'Класи', icon: <Users className="h-5 w-5" /> },
    { id: 'library', label: 'Бібліотека', icon: <BookOpen className="h-5 w-5" /> },
    { id: 'analytics', label: 'Аналітика', icon: <BarChart3 className="h-5 w-5" /> },
    { id: 'settings', label: 'Налаштування', icon: <Settings className="h-5 w-5" /> },
  ];

  const filteredExercises = selectedSubject 
    ? exercises.filter(e => e.subjectId === selectedSubject)
    : exercises;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`
        ${sidebarOpen ? 'w-64' : 'w-20'} 
        bg-sidebar text-sidebar-foreground transition-all duration-300
        fixed inset-y-0 left-0 z-50 flex flex-col
      `}>
        {/* Logo */}
        <div className="p-4 flex items-center gap-3 border-b border-sidebar-border">
          <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center shrink-0">
            <GraduationCap className="h-6 w-6 text-sidebar-primary-foreground" />
          </div>
          {sidebarOpen && (
            <span className="text-xl font-extrabold text-sidebar-foreground">УкрШкола</span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                ${activeItem === item.id 
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                  : 'hover:bg-sidebar-accent/50 text-sidebar-foreground/70 hover:text-sidebar-foreground'
                }
              `}
            >
              {item.icon}
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Toggle Button */}
        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl hover:bg-sidebar-accent/50 transition-colors"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            {sidebarOpen && <span className="text-sm">Згорнути</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {sidebarItems.find(i => i.id === activeItem)?.label}
              </h1>
              <p className="text-sm text-muted-foreground">
                Вітаємо, Оксано Петрівно! 👋
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" asChild>
                <Link to="/play">
                  <Play className="mr-2 h-4 w-4" />
                  Режим гри
                </Link>
              </Button>
              <Button variant="default">
                <Plus className="mr-2 h-4 w-4" />
                Нове завдання
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6">
          {activeItem === 'dashboard' && (
            <DashboardView classGroups={classGroups} students={students} exercises={exercises} />
          )}
          {activeItem === 'classes' && (
            <ClassesView classGroups={classGroups} students={students} />
          )}
          {activeItem === 'library' && (
            <LibraryView 
              exercises={filteredExercises} 
              selectedSubject={selectedSubject}
              onSubjectChange={setSelectedSubject}
            />
          )}
          {activeItem === 'analytics' && (
            <AnalyticsView />
          )}
          {activeItem === 'settings' && (
            <SettingsView />
          )}
        </div>
      </main>
    </div>
  );
};

// Dashboard View
const DashboardView: React.FC<{
  classGroups: typeof classGroups;
  students: typeof students;
  exercises: Exercise[];
}> = ({ classGroups, students, exercises }) => {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="glass" className="p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Класи</p>
              <p className="text-2xl font-bold text-foreground">{classGroups.length}</p>
            </div>
          </div>
        </Card>
        <Card variant="glass" className="p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Учні</p>
              <p className="text-2xl font-bold text-foreground">{students.length}</p>
            </div>
          </div>
        </Card>
        <Card variant="glass" className="p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Вправи</p>
              <p className="text-2xl font-bold text-foreground">{exercises.length}</p>
            </div>
          </div>
        </Card>
        <Card variant="glass" className="p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-game-success/20 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-game-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Виконано сьогодні</p>
              <p className="text-2xl font-bold text-foreground">24</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Останні результати</CardTitle>
            <CardDescription>Результати учнів за сьогодні</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {students.slice(0, 4).map(student => (
                <div key={student.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{student.avatarEmoji}</span>
                    <div>
                      <p className="font-medium text-foreground">{student.nickname}</p>
                      <p className="text-sm text-muted-foreground">Додавання до 20</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="success">95%</Badge>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">3 хв</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Швидкі дії</CardTitle>
            <CardDescription>Часто використовувані функції</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Card variant="interactive" className="p-4 cursor-pointer">
                <Plus className="h-8 w-8 text-primary mb-2" />
                <h4 className="font-bold text-foreground">Нове завдання</h4>
                <p className="text-sm text-muted-foreground">Створити та призначити</p>
              </Card>
              <Card variant="interactive" className="p-4 cursor-pointer">
                <Users className="h-8 w-8 text-secondary mb-2" />
                <h4 className="font-bold text-foreground">Додати клас</h4>
                <p className="text-sm text-muted-foreground">Новий клас учнів</p>
              </Card>
              <Card variant="interactive" className="p-4 cursor-pointer">
                <BarChart3 className="h-8 w-8 text-accent-foreground mb-2" />
                <h4 className="font-bold text-foreground">Звіт</h4>
                <p className="text-sm text-muted-foreground">Переглянути статистику</p>
              </Card>
              <Card variant="interactive" className="p-4 cursor-pointer">
                <BookOpen className="h-8 w-8 text-game-success mb-2" />
                <h4 className="font-bold text-foreground">Бібліотека</h4>
                <p className="text-sm text-muted-foreground">Всі вправи</p>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Classes View
const ClassesView: React.FC<{
  classGroups: typeof classGroups;
  students: typeof students;
}> = ({ classGroups, students }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-foreground">Мої класи</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Додати клас
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classGroups.map(classGroup => {
          const classStudents = students.filter(s => s.classGroupId === classGroup.id);
          return (
            <Card key={classGroup.id} variant="game" className="overflow-hidden cursor-pointer">
              <div className="h-24 bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                <span className="text-4xl font-bold text-primary">{classGroup.name}</span>
              </div>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary">{classGroup.grade} клас</Badge>
                  <span className="text-sm text-muted-foreground">
                    {classGroup.studentCount} учнів
                  </span>
                </div>
                <div className="flex -space-x-2">
                  {classStudents.slice(0, 5).map(student => (
                    <div 
                      key={student.id}
                      className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border-2 border-card"
                    >
                      <span className="text-lg">{student.avatarEmoji}</span>
                    </div>
                  ))}
                  {classStudents.length > 5 && (
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center border-2 border-card">
                      <span className="text-xs font-bold text-primary-foreground">
                        +{classStudents.length - 5}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

// Library View
const LibraryView: React.FC<{
  exercises: Exercise[];
  selectedSubject: string | null;
  onSubjectChange: (subject: string | null) => void;
}> = ({ exercises, selectedSubject, onSubjectChange }) => {
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Пошук вправ..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedSubject === null ? "default" : "outline"}
            onClick={() => onSubjectChange(null)}
          >
            Всі
          </Button>
          {subjects.map(subject => (
            <Button
              key={subject.id}
              variant={selectedSubject === subject.id ? "default" : "outline"}
              onClick={() => onSubjectChange(subject.id)}
            >
              {subject.id === 'math' ? <Calculator className="mr-2 h-4 w-4" /> : <BookOpen className="mr-2 h-4 w-4" />}
              {subject.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Exercises Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exercises.map(exercise => (
          <Card key={exercise.id} variant="game" className="overflow-hidden">
            <div className="h-24 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <span className="text-5xl">{exercise.thumbnailEmoji}</span>
            </div>
            <CardContent className="p-5">
              <h3 className="text-lg font-bold text-foreground mb-2">{exercise.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {exercise.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant={
                  exercise.difficulty === 'EASY' ? 'easy' :
                  exercise.difficulty === 'MEDIUM' ? 'medium' : 'hard'
                }>
                  {difficultyLabels[exercise.difficulty]}
                </Badge>
                <Badge variant="secondary">{exerciseTypeLabels[exercise.type]}</Badge>
                <Badge variant="outline">{exercise.gradeNumber} клас</Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Переглянути
                </Button>
                <Button size="sm" className="flex-1">
                  Призначити
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Analytics View (Placeholder)
const AnalyticsView = () => {
  return (
    <div className="text-center py-20">
      <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-foreground mb-2">Аналітика</h2>
      <p className="text-muted-foreground">
        Детальна статистика буде доступна після підключення бази даних.
      </p>
    </div>
  );
};

// Settings View (Placeholder)
const SettingsView = () => {
  return (
    <div className="text-center py-20">
      <Settings className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-foreground mb-2">Налаштування</h2>
      <p className="text-muted-foreground">
        Налаштування профілю та системи.
      </p>
    </div>
  );
};

export default Dashboard;
