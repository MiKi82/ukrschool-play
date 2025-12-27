import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, Home, Users, BookOpen, BarChart3, Settings,
  Plus, Play, Clock, CheckCircle2, Search,
  Menu, X, Calculator, LogOut, Loader2
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useExercises, useSubjects, DbExercise } from '@/hooks/useExercises';
import { useClasses, useStudentsByClass } from '@/hooks/useClasses';
import ClassesManager from '@/components/ClassesManager';

type SidebarItem = 'dashboard' | 'classes' | 'library' | 'analytics' | 'settings';

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


const Dashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState<SidebarItem>('dashboard');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const { data: exercises = [], isLoading: exercisesLoading } = useExercises(
    selectedSubject ? { subjectId: selectedSubject } : undefined
  );
  const { data: subjects = [] } = useSubjects();
  const { data: classes = [] } = useClasses();
  
  // Calculate total students across all classes
  const totalStudents = classes.reduce((acc, cls) => acc, 0);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const sidebarItems: { id: SidebarItem; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Головна', icon: <Home className="h-5 w-5" /> },
    { id: 'classes', label: 'Класи', icon: <Users className="h-5 w-5" /> },
    { id: 'library', label: 'Бібліотека', icon: <BookOpen className="h-5 w-5" /> },
    { id: 'analytics', label: 'Аналітика', icon: <BarChart3 className="h-5 w-5" /> },
    { id: 'settings', label: 'Налаштування', icon: <Settings className="h-5 w-5" /> },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-sidebar text-sidebar-foreground transition-all duration-300 fixed inset-y-0 left-0 z-50 flex flex-col`}>
        <div className="p-4 flex items-center gap-3 border-b border-sidebar-border">
          <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center shrink-0">
            <GraduationCap className="h-6 w-6 text-sidebar-primary-foreground" />
          </div>
          {sidebarOpen && <span className="text-xl font-extrabold text-sidebar-foreground">УкрШкола</span>}
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeItem === item.id ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'hover:bg-sidebar-accent/50 text-sidebar-foreground/70 hover:text-sidebar-foreground'}`}
            >
              {item.icon}
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-2">
          <button onClick={() => signOut()} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl hover:bg-destructive/20 text-destructive transition-colors">
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span className="text-sm">Вийти</span>}
          </button>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl hover:bg-sidebar-accent/50 transition-colors">
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            {sidebarOpen && <span className="text-sm">Згорнути</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{sidebarItems.find(i => i.id === activeItem)?.label}</h1>
              <p className="text-sm text-muted-foreground">Вітаємо! 👋</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" asChild><Link to="/play"><Play className="mr-2 h-4 w-4" />Режим гри</Link></Button>
              <Button><Plus className="mr-2 h-4 w-4" />Нове завдання</Button>
            </div>
          </div>
        </header>

        <div className="p-6">
          {activeItem === 'dashboard' && <DashboardView exercises={exercises} classCount={classes.length} studentCount={totalStudents} />}
          {activeItem === 'classes' && <ClassesView />}
          {activeItem === 'library' && <LibraryView exercises={exercises} subjects={subjects} selectedSubject={selectedSubject} onSubjectChange={setSelectedSubject} isLoading={exercisesLoading} />}
          {activeItem === 'analytics' && <AnalyticsView />}
          {activeItem === 'settings' && <SettingsView />}
        </div>
      </main>
    </div>
  );
};

const DashboardView: React.FC<{ exercises: DbExercise[]; classCount: number; studentCount: number }> = ({ exercises, classCount, studentCount }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-5"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><Users className="h-6 w-6 text-primary" /></div><div><p className="text-sm text-muted-foreground">Класи</p><p className="text-2xl font-bold text-foreground">{classCount}</p></div></div></Card>
      <Card className="p-5"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center"><GraduationCap className="h-6 w-6 text-secondary" /></div><div><p className="text-sm text-muted-foreground">Учні</p><p className="text-2xl font-bold text-foreground">{studentCount}</p></div></div></Card>
      <Card className="p-5"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><BookOpen className="h-6 w-6 text-primary" /></div><div><p className="text-sm text-muted-foreground">Вправи</p><p className="text-2xl font-bold text-foreground">{exercises.length}</p></div></div></Card>
      <Card className="p-5"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center"><CheckCircle2 className="h-6 w-6 text-green-600" /></div><div><p className="text-sm text-muted-foreground">Виконано сьогодні</p><p className="text-2xl font-bold text-foreground">0</p></div></div></Card>
    </div>
  </div>
);

const ClassesView = () => <ClassesManager />;

const LibraryView: React.FC<{ exercises: DbExercise[]; subjects: { id: string; name: string }[]; selectedSubject: string | null; onSubjectChange: (s: string | null) => void; isLoading: boolean }> = ({ exercises, subjects, selectedSubject, onSubjectChange, isLoading }) => (
  <div className="space-y-6">
    <div className="flex flex-wrap gap-4 items-center">
      <div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /><input type="text" placeholder="Пошук вправ..." className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary transition-all" /></div>
      <div className="flex gap-2">
        <Button variant={selectedSubject === null ? "default" : "outline"} onClick={() => onSubjectChange(null)}>Всі</Button>
        {subjects.map(subject => (<Button key={subject.id} variant={selectedSubject === subject.id ? "default" : "outline"} onClick={() => onSubjectChange(subject.id)}>{subject.name === 'Математика' ? <Calculator className="mr-2 h-4 w-4" /> : <BookOpen className="mr-2 h-4 w-4" />}{subject.name}</Button>))}
      </div>
    </div>
    {isLoading ? <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exercises.map(exercise => (
          <Card key={exercise.id} className="overflow-hidden">
            <div className="h-24 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center"><span className="text-5xl">{exercise.thumbnail_emoji}</span></div>
            <CardContent className="p-5">
              <h3 className="text-lg font-bold text-foreground mb-2">{exercise.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{exercise.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant={exercise.difficulty === 'EASY' ? 'easy' : exercise.difficulty === 'MEDIUM' ? 'medium' : 'hard'}>{difficultyLabels[exercise.difficulty]}</Badge>
                <Badge variant="secondary">{exerciseTypeLabels[exercise.type]}</Badge>
                <Badge variant="outline">{exercise.grade_number} клас</Badge>
              </div>
              <div className="flex gap-2"><Button variant="outline" size="sm" className="flex-1">Переглянути</Button><Button size="sm" className="flex-1">Призначити</Button></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )}
  </div>
);

const AnalyticsView = () => (<div className="text-center py-20"><BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" /><h2 className="text-2xl font-bold text-foreground mb-2">Аналітика</h2><p className="text-muted-foreground">Статистика з'явиться після виконання завдань учнями.</p></div>);
const SettingsView = () => (<div className="text-center py-20"><Settings className="h-16 w-16 text-muted-foreground mx-auto mb-4" /><h2 className="text-2xl font-bold text-foreground mb-2">Налаштування</h2><p className="text-muted-foreground">Налаштування профілю та системи.</p></div>);

export default Dashboard;
