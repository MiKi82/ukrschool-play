import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  GraduationCap, Home, Users, BookOpen, BarChart3, Settings,
  Plus, Play, Clock, CheckCircle2, Search,
  Menu, X, Calculator, LogOut, Loader2, Eye, ExternalLink
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useExercises, useSubjects, DbExercise } from '@/hooks/useExercises';
import { useClasses, useStudentsByClass } from '@/hooks/useClasses';
import { useAllStudents } from '@/hooks/useStudentProgress';
import ClassesManager from '@/components/ClassesManager';
import StudentProgressTracker from '@/components/StudentProgressTracker';

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
  const { data: allStudents = [] } = useAllStudents();
  
  // Calculate total students
  const totalStudents = allStudents.length;

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
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside className={`
        ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 lg:w-20'} 
        bg-sidebar text-sidebar-foreground transition-all duration-300 fixed inset-y-0 left-0 z-50 flex flex-col w-64
      `}>
        <div className="p-4 flex items-center gap-3 border-b border-sidebar-border">
          <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center shrink-0">
            <GraduationCap className="h-6 w-6 text-sidebar-primary-foreground" />
          </div>
          {(sidebarOpen || window.innerWidth < 1024) && <span className="text-xl font-extrabold text-sidebar-foreground">УкрШкола</span>}
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveItem(item.id);
                if (window.innerWidth < 1024) setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeItem === item.id ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'hover:bg-sidebar-accent/50 text-sidebar-foreground/70 hover:text-sidebar-foreground'}`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-2">
          <button onClick={() => signOut()} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl hover:bg-destructive/20 text-destructive transition-colors">
            <LogOut className="h-5 w-5" />
            <span className="text-sm">Вийти</span>
          </button>
          <button onClick={() => setSidebarOpen(false)} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl hover:bg-sidebar-accent/50 transition-colors lg:hidden">
            <X className="h-5 w-5" />
            <span className="text-sm">Закрити</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-20 transition-all duration-300">
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">{sidebarItems.find(i => i.id === activeItem)?.label}</h1>
                <p className="text-sm text-muted-foreground hidden sm:block">Вітаємо! 👋</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Button variant="outline" size="sm" asChild className="hidden sm:flex">
                <Link to="/play"><Play className="mr-2 h-4 w-4" />Режим гри</Link>
              </Button>
              <Button variant="outline" size="icon" asChild className="sm:hidden">
                <Link to="/play"><Play className="h-4 w-4" /></Link>
              </Button>
              <Button size="sm" className="hidden sm:flex"><Plus className="mr-2 h-4 w-4" />Нове завдання</Button>
              <Button size="icon" className="sm:hidden"><Plus className="h-4 w-4" /></Button>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6">
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

const LibraryView: React.FC<{ exercises: DbExercise[]; subjects: { id: string; name: string }[]; selectedSubject: string | null; onSubjectChange: (s: string | null) => void; isLoading: boolean }> = ({ exercises, subjects, selectedSubject, onSubjectChange, isLoading }) => {
  const navigate = useNavigate();
  const [previewExercise, setPreviewExercise] = useState<DbExercise | null>(null);

  return (
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
            <Card key={exercise.id} className="overflow-hidden group hover:shadow-lg transition-all">
              <div 
                className="h-24 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center cursor-pointer"
                onClick={() => setPreviewExercise(exercise)}
              >
                <span className="text-5xl group-hover:scale-110 transition-transform">{exercise.thumbnail_emoji}</span>
              </div>
              <CardContent className="p-5">
                <h3 
                  className="text-lg font-bold text-foreground mb-2 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => setPreviewExercise(exercise)}
                >
                  {exercise.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{exercise.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant={exercise.difficulty === 'EASY' ? 'easy' : exercise.difficulty === 'MEDIUM' ? 'medium' : 'hard'}>{difficultyLabels[exercise.difficulty]}</Badge>
                  <Badge variant="secondary">{exerciseTypeLabels[exercise.type]}</Badge>
                  <Badge variant="outline">{exercise.grade_number} клас</Badge>
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

const AnalyticsView = () => <StudentProgressTracker />;
const SettingsView = () => (<div className="text-center py-20"><Settings className="h-16 w-16 text-muted-foreground mx-auto mb-4" /><h2 className="text-2xl font-bold text-foreground mb-2">Налаштування</h2><p className="text-muted-foreground">Налаштування профілю та системи.</p></div>);

export default Dashboard;
