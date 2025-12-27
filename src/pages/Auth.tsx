import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { GraduationCap, Mail, Lock, User } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Невірний email або пароль');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Успішний вхід!');
          navigate('/dashboard');
        }
      } else {
        if (password.length < 6) {
          toast.error('Пароль має містити мінімум 6 символів');
          setLoading(false);
          return;
        }
        
        const { error } = await signUp(email, password, name);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('Цей email вже зареєстрований');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Реєстрація успішна! Ви можете увійти.');
          navigate('/dashboard');
        }
      }
    } catch (err) {
      toast.error('Сталася помилка. Спробуйте ще раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-2 border-primary/20">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
            <GraduationCap className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-heading text-foreground">
            {isLogin ? 'Вхід' : 'Реєстрація'}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {isLogin 
              ? 'Увійдіть до свого облікового запису UkrSchool' 
              : 'Створіть новий обліковий запис вчителя'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Ваше ім'я"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required={!isLogin}
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
                minLength={6}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={loading}
            >
              {loading ? 'Завантаження...' : (isLogin ? 'Увійти' : 'Зареєструватися')}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-primary hover:underline"
            >
              {isLogin 
                ? 'Немає облікового запису? Зареєструватися' 
                : 'Вже маєте обліковий запис? Увійти'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
