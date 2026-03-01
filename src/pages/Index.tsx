import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  Monitor,
  Globe,
  BookMarked,
  ArrowRight,
  Quote,
  Shield,
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10" />
        <div className="absolute top-20 left-10 text-6xl animate-float opacity-60 hidden md:block">📚</div>
        <div className="absolute top-40 right-20 text-5xl animate-float opacity-60 hidden md:block" style={{ animationDelay: "1s" }}>🎮</div>
        <div className="absolute bottom-20 left-1/4 text-4xl animate-float opacity-60 hidden md:block" style={{ animationDelay: "0.5s" }}>✏️</div>

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
                <Link to="/auth">Спробувати безкоштовно</Link>
              </Button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative z-10 container mx-auto px-4 py-16 md:py-28">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent-foreground mb-6 animate-fade-in">
              <Sparkles className="h-4 w-4" />
              <span className="font-bold text-sm">Інтерактивний урок за кілька хвилин</span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 animate-fade-in leading-tight">
              <span className="text-gradient">ClickClass</span> — конструктор інтерактивних уроків для 1–4 класів
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in max-w-3xl mx-auto" style={{ animationDelay: "0.1s" }}>
              Створюйте захопливі завдання з Математики та Української мови, надсилайте учням посилання й отримуйте результати без ручної перевірки.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in mb-4" style={{ animationDelay: "0.2s" }}>
              <Button size="xl" variant="hero" asChild>
                <Link to="/auth">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Спробувати безкоштовно
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/play">
                  Переглянути демо
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.3s" }}>
              Без встановлення програм. Працює з телефону, планшета та комп'ютера.
            </p>
          </div>

          {/* Product Preview Mockup */}
          <div className="max-w-5xl mx-auto mt-12 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Card variant="glass" className="p-4 md:p-6">
              <div className="rounded-xl bg-background border border-border overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
                  <div className="w-3 h-3 rounded-full bg-destructive/40" />
                  <div className="w-3 h-3 rounded-full bg-game-warning/40" />
                  <div className="w-3 h-3 rounded-full bg-game-success/40" />
                  <span className="ml-2 text-xs text-muted-foreground">ClickClass — Конструктор уроків</span>
                </div>
                <div className="p-6 md:p-8">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-3">
                      <div className="h-5 w-48 bg-primary/15 rounded-lg" />
                      <div className="h-4 w-64 bg-muted rounded-lg" />
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                          <div className="text-2xl mb-2">🧩</div>
                          <div className="h-3 w-20 bg-primary/15 rounded" />
                          <div className="h-2 w-28 bg-muted rounded mt-2" />
                        </div>
                        <div className="p-4 rounded-xl bg-accent/5 border border-accent/10">
                          <div className="text-2xl mb-2">📝</div>
                          <div className="h-3 w-20 bg-accent/15 rounded" />
                          <div className="h-2 w-28 bg-muted rounded mt-2" />
                        </div>
                        <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/10">
                          <div className="text-2xl mb-2">🔤</div>
                          <div className="h-3 w-20 bg-secondary/15 rounded" />
                          <div className="h-2 w-28 bg-muted rounded mt-2" />
                        </div>
                        <div className="p-4 rounded-xl bg-game-success/5 border border-game-success/10">
                          <div className="text-2xl mb-2">🎯</div>
                          <div className="h-3 w-20 bg-game-success/15 rounded" />
                          <div className="h-2 w-28 bg-muted rounded mt-2" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="p-4 rounded-xl bg-muted/50 border border-border">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm">👧</div>
                          <div>
                            <div className="h-3 w-16 bg-foreground/10 rounded" />
                            <div className="h-2 w-12 bg-game-success/30 rounded mt-1" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-sm">👦</div>
                          <div>
                            <div className="h-3 w-16 bg-foreground/10 rounded" />
                            <div className="h-2 w-10 bg-game-warning/30 rounded mt-1" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-sm">👧</div>
                          <div>
                            <div className="h-3 w-16 bg-foreground/10 rounded" />
                            <div className="h-2 w-14 bg-primary/30 rounded mt-1" />
                          </div>
                        </div>
                      </div>
                      <div className="h-3 w-24 bg-muted rounded mx-auto" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </header>

      {/* Problem/Solution Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">Знайома ситуація?</h2>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                <XCircle className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
                <p className="text-foreground">Витрачаєте багато часу на пошук та підготовку цікавих вправ.</p>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                <XCircle className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
                <p className="text-foreground">Отримуєте фотографії зошитів у Viber чи Telegram замість зручних результатів.</p>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                <XCircle className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
                <p className="text-foreground">Учні нудьгують від однотипних тестів і PDF-файлів.</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-primary mb-2">ClickClass допомагає спростити це:</h3>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20">
                <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-foreground">Швидке створення уроків</span>
                  <p className="text-muted-foreground">Збирайте урок із готових блоків — кросворди, тести, вправи на відповідність.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20">
                <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-foreground">Автоматична перевірка</span>
                  <p className="text-muted-foreground">Ви бачите результати одразу. Без фото зошитів і ручного підрахунку.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20">
                <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-foreground">Більше залучення дітей</span>
                  <p className="text-muted-foreground">Інтерактивні ігрові формати мотивують учнів виконувати завдання.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">Як це працює</h2>
          <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Три прості кроки від ідеї до готового уроку
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card variant="game" className="p-8 text-center relative overflow-hidden group">
              <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <CardContent className="p-0 pt-8">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📚</div>
                <h3 className="text-xl font-bold text-foreground mb-3">Оберіть предмет і тему</h3>
                <p className="text-muted-foreground">Оберіть Математику або Українську мову, клас та тему з бібліотеки за програмою НУШ.</p>
              </CardContent>
            </Card>

            <Card variant="game" className="p-8 text-center relative overflow-hidden group">
              <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <CardContent className="p-0 pt-8">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🎮</div>
                <h3 className="text-xl font-bold text-foreground mb-3">Додайте інтерактивні вправи</h3>
                <p className="text-muted-foreground">Комбінуйте кросворди, тести, з'єднання пар та інші вправи. Або додайте посилання на зовнішні ресурси.</p>
              </CardContent>
            </Card>

            <Card variant="game" className="p-8 text-center relative overflow-hidden group">
              <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <CardContent className="p-0 pt-8">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📤</div>
                <h3 className="text-xl font-bold text-foreground mb-3">Надішліть учням посилання</h3>
                <p className="text-muted-foreground">Учні переходять за лінком — без окремої реєстрації чи встановлення додатків.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
            Усе необхідне для сучасного уроку в одному місці
          </h2>
          <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Інструменти, які спрощують підготовку та роблять навчання цікавим
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card variant="game" className="p-6">
              <CardContent className="p-0">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Puzzle className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Інтерактивні вправи</h3>
                <p className="text-muted-foreground text-sm">Кросворди, тести, з'єднання пар, перетягування — різноманітні формати для кожної теми.</p>
              </CardContent>
            </Card>

            <Card variant="game" className="p-6">
              <CardContent className="p-0">
                <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center mb-4">
                  <BarChart3 className="h-7 w-7 text-accent-foreground" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Результати та прогрес</h3>
                <p className="text-muted-foreground text-sm">Бачте, хто виконав завдання, скільки часу витратив і де помилився — без зайвої комунікації.</p>
              </CardContent>
            </Card>

            <Card variant="game" className="p-6">
              <CardContent className="p-0">
                <div className="w-14 h-14 rounded-2xl bg-secondary/20 flex items-center justify-center mb-4">
                  <BookOpen className="h-7 w-7 text-secondary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Бібліотека шаблонів</h3>
                <p className="text-muted-foreground text-sm">Готові завдання, структуровані за предметами та темами. Використовуйте або адаптуйте під свої потреби.</p>
              </CardContent>
            </Card>

            <Card variant="game" className="p-6">
              <CardContent className="p-0">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Smartphone className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Зручний формат для дітей</h3>
                <p className="text-muted-foreground text-sm">Великі кнопки, зрозумілий інтерфейс, адаптований для телефонів та планшетів учнів.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Audience Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">Кому підійде ClickClass</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card variant="interactive" className="p-8 group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Для вчителів початкової школи</h3>
              </div>
              <p className="text-muted-foreground text-lg">
                Зменшіть час на підготовку матеріалів та перевірку домашніх завдань. Зробіть ваші уроки сучасними та цікавими для учнів.
              </p>
            </Card>

            <Card variant="interactive" className="p-8 group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Для репетиторів</h3>
              </div>
              <p className="text-muted-foreground text-lg">
                Давайте учням більше практики між заняттями. Інтерактивні домашні завдання підвищують залученість і допомагають закріпити матеріал.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
            Створено для українських освітян
          </h2>
          <p className="text-lg text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
            ClickClass розробляється з урахуванням реальних потреб вчителів та репетиторів, які щодня працюють з учнями початкової школи. Ми прагнемо зробити підготовку уроків простішою, а навчання — цікавішим.
          </p>

          {/* Trust badges */}
          <div className="flex justify-center gap-4 flex-wrap mb-16">
            <div className="flex items-center gap-2 px-5 py-3 bg-background rounded-full border border-border shadow-sm">
              <BookMarked className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground text-sm">Для 1–4 класів</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-3 bg-background rounded-full border border-border shadow-sm">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground text-sm">Математика та українська мова</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-3 bg-background rounded-full border border-border shadow-sm">
              <Globe className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground text-sm">Працює онлайн без встановлення</span>
            </div>
          </div>

          {/* Testimonials placeholders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: "Олена М.",
                role: "Вчителька, 2-й клас",
                text: "Нарешті зручний інструмент, де можна зібрати урок за кілька хвилин. Учні в захваті від інтерактивних завдань!",
              },
              {
                name: "Ірина К.",
                role: "Репетиторка з математики",
                text: "Тепер домашні завдання — не рутина для мене і не нудьга для дітей. Результати бачу одразу, без фото зошитів.",
              },
              {
                name: "Марина Д.",
                role: "Вчителька, 3-й клас",
                text: "Подобається, що все адаптовано під програму НУШ. Шаблони значно економлять час на підготовку.",
              },
            ].map((t, i) => (
              <Card key={i} variant="glass" className="p-6">
                <CardContent className="p-0">
                  <Quote className="h-6 w-6 text-primary/30 mb-3" />
                  <p className="text-foreground mb-4 text-sm leading-relaxed">{t.text}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                      👩‍🏫
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-sm">{t.name}</p>
                      <p className="text-muted-foreground text-xs">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">Часті запитання</h2>
          <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Відповіді на найпоширеніші питання про ClickClass
          </p>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-3">
              <AccordionItem value="q1" className="border rounded-xl px-6 bg-card">
                <AccordionTrigger className="text-left text-foreground hover:no-underline">
                  Чи потрібно дітям створювати акаунт?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Ні, учням не потрібно реєструватися. Вони переходять за посиланням від вчителя, вводять своє ім'я та одразу починають виконувати завдання.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q2" className="border rounded-xl px-6 bg-card">
                <AccordionTrigger className="text-left text-foreground hover:no-underline">
                  Чи працює сервіс на телефоні?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Так, ClickClass повністю адаптований для роботи на телефонах, планшетах і комп'ютерах. Спеціальне встановлення не потрібне — все працює через браузер.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q3" className="border rounded-xl px-6 bg-card">
                <AccordionTrigger className="text-left text-foreground hover:no-underline">
                  Для яких предметів підходить?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  На цей момент ClickClass підтримує Математику та Українську мову для 1–4 класів за програмою НУШ. Ми плануємо додавати нові предмети в майбутньому.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q4" className="border rounded-xl px-6 bg-card">
                <AccordionTrigger className="text-left text-foreground hover:no-underline">
                  Чи є готові шаблони?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Так, у бібліотеці є готові завдання, структуровані за предметами, класами та темами. Ви можете використовувати їх як є або адаптувати під свої потреби.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q5" className="border rounded-xl px-6 bg-card">
                <AccordionTrigger className="text-left text-foreground hover:no-underline">
                  Чи є безкоштовний доступ?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Так, ви можете зареєструватися та почати використовувати ClickClass безкоштовно. Це дозволяє ознайомитися з платформою та створити свої перші уроки.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Почніть створювати інтерактивні уроки вже сьогодні
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Спростіть підготовку до уроків, автоматизуйте перевірку домашніх завдань і зробіть навчання цікавішим для ваших учнів.
          </p>
          <Button size="xl" variant="hero" asChild>
            <Link to="/auth">
              <Sparkles className="mr-2 h-5 w-5" />
              Створити перший урок безкоштовно
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground mt-4">Швидкий старт. Без зайвих налаштувань.</p>
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
              <Link to="/privacy" className="hover:text-foreground transition-colors">Політика конфіденційності</Link>
              <Link to="/support" className="hover:text-foreground transition-colors">Підтримка</Link>
              <Link to="/contacts" className="hover:text-foreground transition-colors">Контакти</Link>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 ClickClass. Зроблено в Україні 🇺🇦</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
