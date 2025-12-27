import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Gamepad2, Users, BookOpen, Star, Sparkles } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10" />
        <div className="absolute top-20 left-10 text-6xl animate-float">📚</div>
        <div className="absolute top-40 right-20 text-5xl animate-float" style={{ animationDelay: '1s' }}>✏️</div>
        <div className="absolute bottom-20 left-1/4 text-4xl animate-float" style={{ animationDelay: '0.5s' }}>🎯</div>
        <div className="absolute bottom-40 right-1/3 text-5xl animate-float" style={{ animationDelay: '1.5s' }}>🌟</div>
        
        <nav className="relative z-10 container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-hero flex items-center justify-center">
                <GraduationCap className="h-7 w-7 text-primary-foreground" />
              </div>
              <span className="text-2xl font-extrabold text-primary">УкрШкола</span>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" asChild>
                <Link to="/auth">Увійти</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/dashboard">Для вчителів</Link>
              </Button>
              <Button variant="default" asChild>
                <Link to="/play">
                  <Gamepad2 className="mr-2 h-5 w-5" />
                  Грати
                </Link>
              </Button>
            </div>
          </div>
        </nav>

        <div className="relative z-10 container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent-foreground mb-6 animate-fade-in">
              <Sparkles className="h-4 w-4" />
              <span className="font-bold">Навчання через гру</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-6 animate-fade-in">
              Інтерактивне навчання для{' '}
              <span className="text-gradient">українських школярів</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Математика та Українська мова для 1-4 класів. 
              Цікаві ігри, вікторини та завдання для кожної теми.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Button size="xl" variant="hero" asChild>
                <Link to="/play">
                  <Gamepad2 className="mr-2 h-6 w-6" />
                  Почати грати
                </Link>
              </Button>
              <Button size="xl" variant="outline" asChild>
                <Link to="/dashboard">
                  <Users className="mr-2 h-6 w-6" />
                  Панель вчителя
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
            Чому обирають УкрШколу?
          </h2>
          <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Сучасний підхід до навчання, що поєднує найкращі педагогічні практики з інтерактивними технологіями.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="game" className="p-6">
              <CardContent className="p-0">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Відповідає програмі</h3>
                <p className="text-muted-foreground">
                  Всі завдання створені відповідно до Державного стандарту початкової освіти.
                </p>
              </CardContent>
            </Card>

            <Card variant="game" className="p-6">
              <CardContent className="p-0">
                <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mb-4">
                  <Gamepad2 className="h-8 w-8 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Ігрова форма</h3>
                <p className="text-muted-foreground">
                  Пазли, вікторини, картки памʼяті — діти вчаться граючись!
                </p>
              </CardContent>
            </Card>

            <Card variant="game" className="p-6">
              <CardContent className="p-0">
                <div className="w-16 h-16 rounded-2xl bg-secondary/20 flex items-center justify-center mb-4">
                  <Star className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Відстеження прогресу</h3>
                <p className="text-muted-foreground">
                  Вчителі бачать результати кожного учня в реальному часі.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Subjects Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            Наші предмети
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card variant="interactive" className="p-8 group">
              <div className="text-6xl mb-4 group-hover:animate-wiggle">🔢</div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Математика</h3>
              <p className="text-muted-foreground mb-4">
                Арифметика, геометрія, логічні задачі та багато іншого для 1-4 класів.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  Додавання
                </span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  Віднімання
                </span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  Множення
                </span>
              </div>
            </Card>

            <Card variant="interactive" className="p-8 group">
              <div className="text-6xl mb-4 group-hover:animate-wiggle">📚</div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Українська мова</h3>
              <p className="text-muted-foreground mb-4">
                Фонетика, лексика, граматика та правопис для молодших школярів.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-secondary/20 text-secondary rounded-full text-sm font-medium">
                  Голосні
                </span>
                <span className="px-3 py-1 bg-secondary/20 text-secondary rounded-full text-sm font-medium">
                  Антоніми
                </span>
                <span className="px-3 py-1 bg-secondary/20 text-secondary rounded-full text-sm font-medium">
                  Правопис
                </span>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Готові почати?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Приєднуйтесь до тисяч вчителів та учнів, які вже використовують УкрШколу!
          </p>
          <Button size="xl" variant="hero" asChild>
            <Link to="/play">
              <Sparkles className="mr-2 h-6 w-6" />
              Спробувати безкоштовно
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="font-bold text-foreground">УкрШкола</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 УкрШкола. Створено з 💚 для українських школярів.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
