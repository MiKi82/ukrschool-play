-- Create role enum for users
CREATE TYPE public.app_role AS ENUM ('teacher', 'parent', 'admin');

-- Create user_roles table for role management (security best practice)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Create profiles table for user data
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create subjects table
CREATE TABLE public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT '📚',
    color TEXT NOT NULL DEFAULT '#22c55e',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create topics table
CREATE TABLE public.topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
    grade_number INTEGER NOT NULL CHECK (grade_number >= 1 AND grade_number <= 4),
    icon TEXT NOT NULL DEFAULT '📖',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create exercise type enum
CREATE TYPE public.exercise_type AS ENUM ('MATCHING', 'DRAG_DROP', 'CROSSWORD', 'REBUS', 'QUIZ', 'FILL_IN', 'EXTERNAL_LINK');

-- Create difficulty enum
CREATE TYPE public.difficulty_level AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- Create exercises table
CREATE TABLE public.exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    type exercise_type NOT NULL,
    difficulty difficulty_level NOT NULL DEFAULT 'MEDIUM',
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
    topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
    grade_number INTEGER NOT NULL CHECK (grade_number >= 1 AND grade_number <= 4),
    content_json JSONB NOT NULL DEFAULT '{}',
    external_url TEXT,
    thumbnail_emoji TEXT NOT NULL DEFAULT '🎮',
    estimated_time INTEGER NOT NULL DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create class_groups table
CREATE TABLE public.class_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    teacher_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    grade INTEGER NOT NULL CHECK (grade >= 1 AND grade <= 4),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student_profiles table
CREATE TABLE public.student_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nickname TEXT NOT NULL,
    avatar_emoji TEXT NOT NULL DEFAULT '🧒',
    class_group_id UUID REFERENCES public.class_groups(id) ON DELETE SET NULL,
    parent_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lessons table
CREATE TABLE public.lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    teacher_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lesson_exercises junction table
CREATE TABLE public.lesson_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
    exercise_id UUID REFERENCES public.exercises(id) ON DELETE CASCADE NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (lesson_id, exercise_id)
);

-- Create assignments table
CREATE TABLE public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
    class_group_id UUID REFERENCES public.class_groups(id) ON DELETE CASCADE,
    student_profile_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE,
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create assignment_results table
CREATE TABLE public.assignment_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE NOT NULL,
    exercise_id UUID REFERENCES public.exercises(id) ON DELETE CASCADE NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    max_score INTEGER NOT NULL DEFAULT 100,
    time_spent INTEGER NOT NULL DEFAULT 0,
    mistakes INTEGER NOT NULL DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (assignment_id, student_id, exercise_id)
);

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_results ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for subjects (public read)
CREATE POLICY "Anyone can view subjects"
ON public.subjects FOR SELECT
USING (true);

CREATE POLICY "Admins can manage subjects"
ON public.subjects FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for topics (public read)
CREATE POLICY "Anyone can view topics"
ON public.topics FOR SELECT
USING (true);

CREATE POLICY "Admins can manage topics"
ON public.topics FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for exercises (public read)
CREATE POLICY "Anyone can view exercises"
ON public.exercises FOR SELECT
USING (true);

CREATE POLICY "Teachers and admins can manage exercises"
ON public.exercises FOR ALL
TO authenticated
USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'teacher')
);

-- RLS Policies for class_groups
CREATE POLICY "Teachers can view their own classes"
ON public.class_groups FOR SELECT
TO authenticated
USING (teacher_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can manage their own classes"
ON public.class_groups FOR ALL
TO authenticated
USING (teacher_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- RLS Policies for student_profiles
CREATE POLICY "Teachers can view students in their classes"
ON public.student_profiles FOR SELECT
TO authenticated
USING (
    class_group_id IN (
        SELECT id FROM public.class_groups WHERE teacher_id = auth.uid()
    ) OR 
    parent_id = auth.uid() OR
    public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Teachers can manage students in their classes"
ON public.student_profiles FOR ALL
TO authenticated
USING (
    class_group_id IN (
        SELECT id FROM public.class_groups WHERE teacher_id = auth.uid()
    ) OR
    public.has_role(auth.uid(), 'admin')
);

-- RLS Policies for lessons
CREATE POLICY "Teachers can view their own lessons"
ON public.lessons FOR SELECT
TO authenticated
USING (teacher_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can manage their own lessons"
ON public.lessons FOR ALL
TO authenticated
USING (teacher_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- RLS Policies for lesson_exercises
CREATE POLICY "View lesson exercises for accessible lessons"
ON public.lesson_exercises FOR SELECT
TO authenticated
USING (
    lesson_id IN (
        SELECT id FROM public.lessons WHERE teacher_id = auth.uid()
    ) OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Manage lesson exercises for own lessons"
ON public.lesson_exercises FOR ALL
TO authenticated
USING (
    lesson_id IN (
        SELECT id FROM public.lessons WHERE teacher_id = auth.uid()
    ) OR public.has_role(auth.uid(), 'admin')
);

-- RLS Policies for assignments
CREATE POLICY "View assignments for own classes or students"
ON public.assignments FOR SELECT
TO authenticated
USING (
    class_group_id IN (
        SELECT id FROM public.class_groups WHERE teacher_id = auth.uid()
    ) OR
    student_profile_id IN (
        SELECT id FROM public.student_profiles WHERE parent_id = auth.uid()
    ) OR
    public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Teachers can manage assignments"
ON public.assignments FOR ALL
TO authenticated
USING (
    class_group_id IN (
        SELECT id FROM public.class_groups WHERE teacher_id = auth.uid()
    ) OR public.has_role(auth.uid(), 'admin')
);

-- RLS Policies for assignment_results
CREATE POLICY "View results for own classes or children"
ON public.assignment_results FOR SELECT
TO authenticated
USING (
    student_id IN (
        SELECT id FROM public.student_profiles 
        WHERE class_group_id IN (
            SELECT id FROM public.class_groups WHERE teacher_id = auth.uid()
        ) OR parent_id = auth.uid()
    ) OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Anyone can insert results"
ON public.assignment_results FOR INSERT
WITH CHECK (true);

CREATE POLICY "Results can be updated by teachers"
ON public.assignment_results FOR UPDATE
TO authenticated
USING (
    student_id IN (
        SELECT id FROM public.student_profiles 
        WHERE class_group_id IN (
            SELECT id FROM public.class_groups WHERE teacher_id = auth.uid()
        )
    ) OR public.has_role(auth.uid(), 'admin')
);

-- Create trigger for profile creation on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, name)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)));
  
  -- Default new users to teacher role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'teacher');
  
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_exercises_updated_at
  BEFORE UPDATE ON public.exercises
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_class_groups_updated_at
  BEFORE UPDATE ON public.class_groups
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_profiles_updated_at
  BEFORE UPDATE ON public.student_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();