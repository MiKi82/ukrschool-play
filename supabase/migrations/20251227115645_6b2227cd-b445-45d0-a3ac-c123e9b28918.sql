-- Add photo_url column to student_profiles
ALTER TABLE public.student_profiles 
ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Create storage bucket for student photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('student-photos', 'student-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for student photos
CREATE POLICY "Student photos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'student-photos');

CREATE POLICY "Authenticated users can upload student photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'student-photos');

CREATE POLICY "Authenticated users can update student photos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'student-photos');

CREATE POLICY "Authenticated users can delete student photos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'student-photos');

-- Insert new exercises for grade 3 (1 easy, 2 medium, 1 hard)
INSERT INTO public.exercises (title, description, type, difficulty, subject_id, grade_number, thumbnail_emoji, estimated_time, content_json)
SELECT 
  'Додавання до 100',
  'Прості приклади на додавання двозначних чисел',
  'QUIZ',
  'EASY',
  id,
  3,
  '➕',
  5,
  '{"questions": [
    {"id": "q1", "question": "25 + 34 = ?", "options": ["49", "59", "69", "39"], "correctIndex": 1},
    {"id": "q2", "question": "42 + 18 = ?", "options": ["50", "60", "70", "80"], "correctIndex": 1},
    {"id": "q3", "question": "67 + 23 = ?", "options": ["80", "90", "100", "70"], "correctIndex": 1}
  ]}'::jsonb
FROM public.subjects WHERE name = 'Математика';

INSERT INTO public.exercises (title, description, type, difficulty, subject_id, grade_number, thumbnail_emoji, estimated_time, content_json)
SELECT 
  'Віднімання до 100',
  'Приклади на віднімання двозначних чисел',
  'QUIZ',
  'MEDIUM',
  id,
  3,
  '➖',
  6,
  '{"questions": [
    {"id": "q1", "question": "85 - 37 = ?", "options": ["48", "58", "38", "68"], "correctIndex": 0},
    {"id": "q2", "question": "92 - 45 = ?", "options": ["37", "47", "57", "67"], "correctIndex": 1},
    {"id": "q3", "question": "71 - 28 = ?", "options": ["33", "43", "53", "63"], "correctIndex": 1},
    {"id": "q4", "question": "100 - 56 = ?", "options": ["34", "44", "54", "64"], "correctIndex": 1}
  ]}'::jsonb
FROM public.subjects WHERE name = 'Математика';

INSERT INTO public.exercises (title, description, type, difficulty, subject_id, grade_number, thumbnail_emoji, estimated_time, content_json)
SELECT 
  'Синоніми та антоніми',
  'Підбери правильні пари слів',
  'MATCHING',
  'MEDIUM',
  id,
  3,
  '🔄',
  7,
  '{"pairs": [
    {"id": "p1", "left": "великий", "right": "малий"},
    {"id": "p2", "left": "веселий", "right": "сумний"},
    {"id": "p3", "left": "швидкий", "right": "повільний"},
    {"id": "p4", "left": "гарячий", "right": "холодний"}
  ]}'::jsonb
FROM public.subjects WHERE name = 'Українська мова';

INSERT INTO public.exercises (title, description, type, difficulty, subject_id, grade_number, thumbnail_emoji, estimated_time, content_json)
SELECT 
  'Множення та ділення',
  'Складні приклади на множення та ділення',
  'QUIZ',
  'HARD',
  id,
  3,
  '✖️',
  10,
  '{"questions": [
    {"id": "q1", "question": "7 × 8 = ?", "options": ["54", "56", "64", "48"], "correctIndex": 1},
    {"id": "q2", "question": "63 ÷ 9 = ?", "options": ["6", "7", "8", "9"], "correctIndex": 1},
    {"id": "q3", "question": "9 × 6 = ?", "options": ["45", "54", "63", "72"], "correctIndex": 1},
    {"id": "q4", "question": "72 ÷ 8 = ?", "options": ["7", "8", "9", "10"], "correctIndex": 2},
    {"id": "q5", "question": "6 × 7 + 12 = ?", "options": ["44", "54", "64", "42"], "correctIndex": 1}
  ]}'::jsonb
FROM public.subjects WHERE name = 'Математика';

-- Insert new exercises for grade 4 (1 easy, 2 medium, 1 hard)
INSERT INTO public.exercises (title, description, type, difficulty, subject_id, grade_number, thumbnail_emoji, estimated_time, content_json)
SELECT 
  'Дроби - основи',
  'Познайомся з простими дробами',
  'QUIZ',
  'EASY',
  id,
  4,
  '🥧',
  5,
  '{"questions": [
    {"id": "q1", "question": "Яка частина кола зафарбована, якщо зафарбовано 1 з 4 частин?", "options": ["1/2", "1/4", "1/3", "2/4"], "correctIndex": 1},
    {"id": "q2", "question": "Що більше: 1/2 чи 1/4?", "options": ["1/2", "1/4", "Однаково", "Не можна порівняти"], "correctIndex": 0},
    {"id": "q3", "question": "Скільки четвертих у цілому?", "options": ["2", "3", "4", "5"], "correctIndex": 2}
  ]}'::jsonb
FROM public.subjects WHERE name = 'Математика';

INSERT INTO public.exercises (title, description, type, difficulty, subject_id, grade_number, thumbnail_emoji, estimated_time, content_json)
SELECT 
  'Частини мови',
  'Визнач частини мови у реченнях',
  'DRAG_DROP',
  'MEDIUM',
  id,
  4,
  '📝',
  8,
  '{"zones": [
    {"id": "noun", "label": "Іменник"},
    {"id": "verb", "label": "Дієслово"},
    {"id": "adj", "label": "Прикметник"}
  ], "items": [
    {"id": "i1", "content": "сонце", "targetZone": "noun"},
    {"id": "i2", "content": "біжить", "targetZone": "verb"},
    {"id": "i3", "content": "гарний", "targetZone": "adj"},
    {"id": "i4", "content": "книга", "targetZone": "noun"},
    {"id": "i5", "content": "читає", "targetZone": "verb"},
    {"id": "i6", "content": "великий", "targetZone": "adj"}
  ]}'::jsonb
FROM public.subjects WHERE name = 'Українська мова';

INSERT INTO public.exercises (title, description, type, difficulty, subject_id, grade_number, thumbnail_emoji, estimated_time, content_json)
SELECT 
  'Площа та периметр',
  'Обчисли площу та периметр прямокутників',
  'QUIZ',
  'MEDIUM',
  id,
  4,
  '📐',
  8,
  '{"questions": [
    {"id": "q1", "question": "Периметр квадрата зі стороною 5 см дорівнює:", "options": ["10 см", "15 см", "20 см", "25 см"], "correctIndex": 2},
    {"id": "q2", "question": "Площа прямокутника 3×4 см дорівнює:", "options": ["7 см²", "12 см²", "14 см²", "24 см²"], "correctIndex": 1},
    {"id": "q3", "question": "Периметр прямокутника 5×3 см дорівнює:", "options": ["8 см", "15 см", "16 см", "30 см"], "correctIndex": 2},
    {"id": "q4", "question": "Площа квадрата зі стороною 6 см:", "options": ["12 см²", "24 см²", "36 см²", "48 см²"], "correctIndex": 2}
  ]}'::jsonb
FROM public.subjects WHERE name = 'Математика';

INSERT INTO public.exercises (title, description, type, difficulty, subject_id, grade_number, thumbnail_emoji, estimated_time, content_json)
SELECT 
  'Розряди чисел',
  'Робота з багатозначними числами',
  'FILL_IN',
  'HARD',
  id,
  4,
  '🔢',
  10,
  '{"sentences": [
    {"id": "s1", "text": "У числі 4567 цифра 5 означає ___ сотень", "blanks": [{"index": 0, "answer": "5"}]},
    {"id": "s2", "text": "Число 3 тисячі 4 сотні 2 десятки 1 одиниця записується як ___", "blanks": [{"index": 0, "answer": "3421"}]},
    {"id": "s3", "text": "У числі 8903 ___ одиниць, ___ десятків", "blanks": [{"index": 0, "answer": "3"}, {"index": 1, "answer": "0"}]}
  ]}'::jsonb
FROM public.subjects WHERE name = 'Математика';

-- Add crossword exercises for each grade
INSERT INTO public.exercises (title, description, type, difficulty, subject_id, grade_number, thumbnail_emoji, estimated_time, content_json)
SELECT 
  'Математичний кросворд (3 клас)',
  'Розв''яжи математичний кросворд з простими прикладами',
  'CROSSWORD',
  'MEDIUM',
  id,
  3,
  '🧩',
  10,
  '{"gridSize": 8, "clues": [
    {"id": "c1", "number": 1, "direction": "across", "clue": "5 + 3 = ?", "answer": "ВІСІМ", "row": 0, "col": 0},
    {"id": "c2", "number": 2, "direction": "down", "clue": "10 - 4 = ?", "answer": "ШІСТЬ", "row": 0, "col": 0},
    {"id": "c3", "number": 3, "direction": "across", "clue": "3 × 3 = ?", "answer": "ДЕВЯТЬ", "row": 2, "col": 1},
    {"id": "c4", "number": 4, "direction": "down", "clue": "2 + 2 = ?", "answer": "ЧОТИРИ", "row": 2, "col": 3}
  ]}'::jsonb
FROM public.subjects WHERE name = 'Математика';

INSERT INTO public.exercises (title, description, type, difficulty, subject_id, grade_number, thumbnail_emoji, estimated_time, content_json)
SELECT 
  'Кросворд зі словами (3 клас)',
  'Відгадай слова за їх значенням',
  'CROSSWORD',
  'MEDIUM',
  id,
  3,
  '📚',
  10,
  '{"gridSize": 10, "clues": [
    {"id": "c1", "number": 1, "direction": "across", "clue": "Пора року після зими", "answer": "ВЕСНА", "row": 0, "col": 0},
    {"id": "c2", "number": 2, "direction": "down", "clue": "Тварина, що гавкає", "answer": "СОБАКА", "row": 0, "col": 0},
    {"id": "c3", "number": 3, "direction": "across", "clue": "Найбільша планета", "answer": "ЮПІТЕР", "row": 3, "col": 1},
    {"id": "c4", "number": 4, "direction": "down", "clue": "Столиця України", "answer": "КИЇВ", "row": 1, "col": 4}
  ]}'::jsonb
FROM public.subjects WHERE name = 'Українська мова';

INSERT INTO public.exercises (title, description, type, difficulty, subject_id, grade_number, thumbnail_emoji, estimated_time, content_json)
SELECT 
  'Математичний кросворд (4 клас)',
  'Складніший математичний кросворд',
  'CROSSWORD',
  'HARD',
  id,
  4,
  '🧮',
  12,
  '{"gridSize": 10, "clues": [
    {"id": "c1", "number": 1, "direction": "across", "clue": "7 × 8 = ?", "answer": "ПЯТДЕСЯТШІСТЬ", "row": 0, "col": 0},
    {"id": "c2", "number": 2, "direction": "down", "clue": "100 ÷ 4 = ?", "answer": "ДВАДЦЯТЬПЯТЬ", "row": 0, "col": 0},
    {"id": "c3", "number": 3, "direction": "across", "clue": "Скільки місяців у році?", "answer": "ДВАНАДЦЯТЬ", "row": 3, "col": 0},
    {"id": "c4", "number": 4, "direction": "down", "clue": "15 × 2 = ?", "answer": "ТРИДЦЯТЬ", "row": 1, "col": 5}
  ]}'::jsonb
FROM public.subjects WHERE name = 'Математика';

INSERT INTO public.exercises (title, description, type, difficulty, subject_id, grade_number, thumbnail_emoji, estimated_time, content_json)
SELECT 
  'Кросворд з української мови (4 клас)',
  'Літературні терміни та поняття',
  'CROSSWORD',
  'HARD',
  id,
  4,
  '📖',
  12,
  '{"gridSize": 10, "clues": [
    {"id": "c1", "number": 1, "direction": "across", "clue": "Слово, протилежне за значенням", "answer": "АНТОНІМ", "row": 0, "col": 0},
    {"id": "c2", "number": 2, "direction": "down", "clue": "Слово, схоже за значенням", "answer": "СИНОНІМ", "row": 0, "col": 0},
    {"id": "c3", "number": 3, "direction": "across", "clue": "Частина мови, що означає дію", "answer": "ДІЄСЛОВО", "row": 3, "col": 0},
    {"id": "c4", "number": 4, "direction": "down", "clue": "Частина мови, що означає предмет", "answer": "ІМЕННИК", "row": 1, "col": 5}
  ]}'::jsonb
FROM public.subjects WHERE name = 'Українська мова';