import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  GraduationCap, Home, Users, BookOpen, BarChart3, Settings,
  Plus, Play, CheckCircle2, Menu, X, LogOut, Loader2, FileText
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useExercises, DbExercise } from '@/hooks/useExercises';
import { useClasses } from '@/hooks/useClasses';
import { useAllStudents } from '@/hooks/useStudentProgress';
import { useLessons } from '@/hooks/useLessons';
import ClassesManager from '@/components/ClassesManager';
import StudentProgressTracker from '@/components/StudentProgressTracker';
import LibraryView from '@/components/LibraryView';
import LessonBuilder, { LessonEditData } from '@/components/LessonBuilder';
import LessonsView from '@/components/LessonsView';

type SidebarItem = 'dashboard' | 'classes' | 'library' | 'lessons' | 'analytics' | 'settings';

const Dashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<SidebarItem>('dashboard');
  
  // Lesson builder state
  const [lessonBuilderOpen, setLessonBuilderOpen] = useState(false);
  const [selectedExercisesForLesson, setSelectedExercisesForLesson] = useState<DbExercise[]>([]);
  const [editLessonData, setEditLessonData] = useState<LessonEditData | null>(null);

  const { data: exercises = [] } = useExercises();
  const { data: classes = [] } = useClasses();
  const { data: allStudents = [] } = useAllStudents();
  const { data: lessons = [] } = useLessons();
  
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
    { id: 'lessons', label: 'Уроки', icon: <FileText className="h-5 w-5" /> },
    { id: 'analytics', label: 'Аналітика', icon: <BarChart3 className="h-5 w-5" /> },
    { id: 'settings', label: 'Налаштування', icon: <Settings className="h-5 w-5" /> },
  ];

  const handleOpenLessonBuilder = (exercises: DbExercise[]) => {
    setEditLessonData(null);
    setSelectedExercisesForLesson(exercises);
    setLessonBuilderOpen(true);
  };

  const handleEditLesson = (lesson: LessonEditData) => {
    setSelectedExercisesForLesson([]);
    setEditLessonData(lesson);
    setLessonBuilderOpen(true);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Overlay when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        bg-sidebar text-sidebar-foreground transition-all duration-300 fixed inset-y-0 left-0 z-50 flex flex-col w-64
      `}>
        <div className="p-4 flex items-center gap-3 border-b border-sidebar-border">
          <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center shrink-0">
            <GraduationCap className="h-6 w-6 text-sidebar-primary-foreground" />
          </div>
          <span className="text-xl font-extrabold text-sidebar-foreground">УкрШкола</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveItem(item.id);
                setSidebarOpen(false);
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
          <button onClick={() => setSidebarOpen(false)} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl hover:bg-sidebar-accent/50 transition-colors">
            <X className="h-5 w-5" />
            <span className="text-sm">Закрити</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 transition-all duration-300">
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
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
              <Button size="sm" className="hidden sm:flex" onClick={() => setLessonBuilderOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />Нове завдання
              </Button>
              <Button size="icon" className="sm:hidden" onClick={() => setLessonBuilderOpen(true)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6">
          {activeItem === 'dashboard' && (
            <DashboardView 
              exercises={exercises} 
              classCount={classes.length} 
              studentCount={totalStudents}
              lessonCount={lessons.length}
              onNavigate={(view) => setActiveItem(view)} 
            />
          )}
          {activeItem === 'classes' && <ClassesManager />}
          {activeItem === 'library' && <LibraryView onOpenLessonBuilder={handleOpenLessonBuilder} />}
          {activeItem === 'lessons' && <LessonsView onEditLesson={handleEditLesson} />}
          {activeItem === 'analytics' && <StudentProgressTracker />}
          {activeItem === 'settings' && <SettingsView />}
        </div>
      </main>

      {/* Lesson Builder Modal */}
      <LessonBuilder 
        open={lessonBuilderOpen} 
        onClose={() => {
          setLessonBuilderOpen(false);
          setSelectedExercisesForLesson([]);
          setEditLessonData(null);
        }}
        initialExercises={selectedExercisesForLesson}
        editLesson={editLessonData}
      />
    </div>
  );
};

const DashboardView: React.FC<{ 
  exercises: DbExercise[]; 
  classCount: number; 
  studentCount: number;
  lessonCount: number;
  onNavigate: (view: 'classes' | 'library' | 'lessons' | 'analytics') => void;
}> = ({ exercises, classCount, studentCount, lessonCount, onNavigate }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card 
        className="p-5 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all"
        onClick={() => onNavigate('classes')}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Класи</p>
            <p className="text-2xl font-bold text-foreground">{classCount}</p>
          </div>
        </div>
      </Card>
      
      <Card 
        className="p-5 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all"
        onClick={() => onNavigate('classes')}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
            <GraduationCap className="h-6 w-6 text-secondary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Учні</p>
            <p className="text-2xl font-bold text-foreground">{studentCount}</p>
          </div>
        </div>
      </Card>
      
      <Card 
        className="p-5 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all"
        onClick={() => onNavigate('library')}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Вправи</p>
            <p className="text-2xl font-bold text-foreground">{exercises.length}</p>
          </div>
        </div>
      </Card>
      
      <Card 
        className="p-5 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all"
        onClick={() => onNavigate('lessons')}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
            <FileText className="h-6 w-6 text-accent-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Уроки</p>
            <p className="text-2xl font-bold text-foreground">{lessonCount}</p>
          </div>
        </div>
      </Card>

      <Card 
        className="p-5 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all"
        onClick={() => onNavigate('analytics')}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Аналітика</p>
            <p className="text-2xl font-bold text-foreground">→</p>
          </div>
        </div>
      </Card>
    </div>
  </div>
);

const SettingsView = () => (
  <div className="text-center py-20">
    <Settings className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
    <h2 className="text-2xl font-bold text-foreground mb-2">Налаштування</h2>
    <p className="text-muted-foreground">Налаштування профілю та системи.</p>
  </div>
);

export default Dashboard;
