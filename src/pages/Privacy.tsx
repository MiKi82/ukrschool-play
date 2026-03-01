import { Link } from "react-router-dom";
import { GraduationCap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Privacy = () => (
  <div className="min-h-screen bg-background">
    <nav className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-hero flex items-center justify-center">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-extrabold text-primary">ClickClass</span>
        </Link>
        <Button variant="ghost" asChild>
          <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" />На головну</Link>
        </Button>
      </div>
    </nav>
    <main className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold text-foreground mb-6">Політика конфіденційності</h1>
      <p className="text-muted-foreground mb-4">Ця сторінка знаходиться в розробці. Повний текст політики конфіденційності буде опублікований найближчим часом.</p>
      <p className="text-muted-foreground">Якщо у вас є запитання щодо обробки персональних даних, зверніться на сторінку <Link to="/contacts" className="text-primary hover:underline">Контакти</Link>.</p>
    </main>
  </div>
);

export default Privacy;
