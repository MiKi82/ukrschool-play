import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Puzzle,
  BarChart3,
  BookOpen,
  Smartphone,
  GraduationCap,
  Users,
  CheckCircle2,
  XCircle,
  Sparkles,
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10" />
        <div className="absolute top-20 left-10 text-6xl animate-float opacity-60">📚</div>
        <div className="absolute top-40 right-20 text-5xl animate-float opacity-60" style={{ animationDelay: "1s" }}>
          🎮
        </div>
        <div
          className="absolute bottom-20 left-1/4 text-4xl animate-float opacity-60"
          style={{ animationDelay: "0.5s" }}
        >
          📊
        </div>
        <div
          className="absolute bottom-40 right-1/3 text-5xl animate-float opacity-60"
          style={{ animationDelay: "1.5s" }}
        >
          ✨
        </div>

        <nav className="relative z-10 container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-hero flex items-center justify-center">
                <GraduationCap className="h-7 w-7 text-primary-foreground" />
              </div>
              <span className="text-2xl font-extrabold text-primary">ClickClass</span>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" asChild>
                <Link to="/auth">Увійти</Link>
              </Button>
              <Button variant="default" asChild>
                <Link to="/dashboard">Розпочати роботу</Link>
              </Button>
            </div>
          </div>
        </nav>

        <div className="relative z-10 container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent-foreground mb-6 animate-fade-in">
              <Sparkles className="h-4 w-4" />
              <span className="font-bold">Урок за 3 кліки</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 animate-fade-in leading-tight">
              <span className="text-gradient">ClickClass:</span> Твій урок за 3 кліки.{" "}
              <span className="block mt-2">Перетворіть нудну домашку на захопливу гру.</span>
            </h1>

            <p
              className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in max-w-3xl mx-auto"
              style={{ animationDelay: "0.1s" }}
            >
              Перша українська платформа для вчителів 1–4 класів та репетиторів. Створюйте інтерактивні завдання з
              Математики та Української мови, які діти виконують з радістю, а система перевіряє сама.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <Button size="xl" variant="hero" asChild>
                <Link to="/dashboard">
                  <Sparkles className="mr-2 h-6 w-6" />
                  Створити перший урок безкоштовно
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Problem/Solution Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">Знайома ситуація?</h2>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Problems */}
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                <XCircle className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
                <p className="text-foreground">Витрачаєте години на пошук цікавих вправ в інтернеті.</p>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                <XCircle className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
                <p className="text-foreground">Отримуєте сотні фотографій зошитів у Viber/Telegram на перевірку.</p>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                <XCircle className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
                <p className="text-foreground">Учні нудьгують від однотипних тестів та PDF-файлів.</p>
              </div>
            </div>

            {/* Solutions */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-primary mb-2">ClickClass змінює це:</h3>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20">
                <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-foreground">Конструктор:</span>
                  <p className="text-muted-foreground">
                    Збирайте урок як LEGO — перетягніть гру, додайте кросворд, готово.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20">
                <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-foreground">Автоперевірка:</span>
                  <p className="text-muted-foreground">Ви бачите лише результат. Ніяких фото зошитів.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20">
                <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-foreground">Гейміфікація:</span>
                  <p className="text-muted-foreground">Діти змагаються, отримують нагороди й просять «ще».</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - 3 Clicks */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
            Всього 3 кроки до ідеального уроку
          </h2>
          <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Обіцяємо — це дійсно просто!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card variant="game" className="p-8 text-center relative overflow-hidden group">
              <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <CardContent className="p-0 pt-8">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📚</div>
                <h3 className="text-xl font-bold text-foreground mb-3">Оберіть тему</h3>
                <p className="text-muted-foreground">
                  Оберіть предмет (Математика/Укр. мова), клас та тему з нашої бібліотеки, що відповідає програмі НУШ.
                </p>
              </CardContent>
            </Card>

            <Card variant="game" className="p-8 text-center relative overflow-hidden group">
              <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <CardContent className="p-0 pt-8">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🎮</div>
                <h3 className="text-xl font-bold text-foreground mb-3">Додайте інтерактив</h3>
                <p className="text-muted-foreground">
                  Міксуйте вправи: з'єднання пар, ребуси, кросворди, драг-ен-дроп. Або додайте посилання на Znaiemo чи
                  LearningApps.
                </p>
              </CardContent>
            </Card>

            <Card variant="game" className="p-8 text-center relative overflow-hidden group">
              <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <CardContent className="p-0 pt-8">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📤</div>
                <h3 className="text-xl font-bold text-foreground mb-3">Надішліть посилання</h3>
                <p className="text-muted-foreground">
                  Учні переходять за QR-кодом або лінком. Ніяких складних реєстрацій для дітей.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
            Все необхідне для 1–4 класів
          </h2>
          <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Повний набір інструментів для сучасного вчителя
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card variant="game" className="p-6">
              <CardContent className="p-0">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Puzzle className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Розумні ігри</h3>
                <p className="text-muted-foreground text-sm">
                  Генератор кросвордів, ребусів та вправ на відповідність.
                </p>
              </CardContent>
            </Card>

            <Card variant="game" className="p-6">
              <CardContent className="p-0">
                <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center mb-4">
                  <BarChart3 className="h-7 w-7 text-accent-foreground" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Журнал успішності</h3>
                <p className="text-muted-foreground text-sm">
                  Бачте, хто виконав завдання, скільки часу витратив і де помилився.
                </p>
              </CardContent>
            </Card>

            <Card variant="game" className="p-6">
              <CardContent className="p-0">
                <div className="w-14 h-14 rounded-2xl bg-secondary/20 flex items-center justify-center mb-4">
                  <BookOpen className="h-7 w-7 text-secondary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Бібліотека контенту</h3>
                <p className="text-muted-foreground text-sm">База готових шаблонів, структурована по семестрах.</p>
              </CardContent>
            </Card>

            <Card variant="game" className="p-6">
              <CardContent className="p-0">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Smartphone className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Дитячий режим</h3>
                <p className="text-muted-foreground text-sm">
                  Великі кнопки, мінімум тексту, адаптовано для планшетів та телефонів.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">Для кого це?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card variant="interactive" className="p-8 group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Для Вчителів</h3>
              </div>
              <p className="text-muted-foreground text-lg">
                Економте до 5 годин на тиждень на підготовці та перевірці. Зробіть свої уроки найсучаснішими в школі.
              </p>
            </Card>

            <Card variant="interactive" className="p-8 group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Для Репетиторів</h3>
              </div>
              <p className="text-muted-foreground text-lg">
                Давайте учням більше цінності. Інтерактивні домашки підвищують залученість та виправдовують вартість
                заняття.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Приєднуйтесь до спільноти сучасних освітян
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Станьте одними з перших, хто протестує ClickClass. Ваші відгуки допоможуть зробити ідеальний інструмент для
            української освіти.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 bg-background rounded-full border border-border">
              <span className="text-2xl">👩‍🏫</span>
              <span className="text-muted-foreground">Вчителі</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-background rounded-full border border-border">
              <span className="text-2xl">🎓</span>
              <span className="text-muted-foreground">Репетитори</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-background rounded-full border border-border">
              <span className="text-2xl">👶</span>
              <span className="text-muted-foreground">1–4 класи</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Готові спробувати?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Не потребує встановлення програм. Почніть створювати уроки прямо зараз.
          </p>
          <Button size="xl" variant="hero" asChild>
            <Link to="/dashboard">
              <Sparkles className="mr-2 h-6 w-6" />
              Розпочати роботу
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="font-bold text-foreground">ClickClass</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Політика конфіденційності
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Контакти підтримки
              </a>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 ClickClass. Зроблено в Україні 🇺🇦</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
