import { Subject, Topic, Exercise, ClassGroup, StudentProfile, User } from '@/types';

// Subjects
export const subjects: Subject[] = [
  {
    id: 'math',
    name: 'Математика',
    icon: '🔢',
    color: 'hsl(199, 89%, 48%)',
  },
  {
    id: 'ukr',
    name: 'Українська мова',
    icon: '📚',
    color: 'hsl(142, 76%, 36%)',
  },
];

// Topics
export const topics: Topic[] = [
  // Math Topics
  { id: 'arithmetic', name: 'Арифметика', gradeId: 'math-2', icon: '➕' },
  { id: 'geometry', name: 'Геометрія', gradeId: 'math-2', icon: '📐' },
  { id: 'time', name: 'Час', gradeId: 'math-2', icon: '⏰' },
  { id: 'multiplication', name: 'Множення', gradeId: 'math-3', icon: '✖️' },
  { id: 'division', name: 'Ділення', gradeId: 'math-3', icon: '➗' },
  // Ukrainian Topics
  { id: 'phonetics', name: 'Фонетика', gradeId: 'ukr-2', icon: '🔤' },
  { id: 'lexics', name: 'Лексика', gradeId: 'ukr-2', icon: '📖' },
  { id: 'syntax', name: 'Синтаксис', gradeId: 'ukr-3', icon: '✍️' },
  { id: 'morphology', name: 'Морфологія', gradeId: 'ukr-3', icon: '🔠' },
  { id: 'spelling', name: 'Правопис', gradeId: 'ukr-2', icon: '📝' },
];

// Exercises
export const exercises: Exercise[] = [
  // Internal Math Exercises
  {
    id: 'math-quiz-1',
    title: 'Додавання до 20',
    description: 'Вирішіть приклади на додавання чисел до 20',
    type: 'QUIZ',
    difficulty: 'EASY',
    subjectId: 'math',
    gradeNumber: 2,
    topicId: 'arithmetic',
    thumbnailEmoji: '🎯',
    estimatedTime: 5,
    contentJson: {
      questions: [
        { id: 'q1', question: '5 + 3 = ?', options: ['6', '7', '8', '9'], correctIndex: 2, explanation: '5 + 3 = 8' },
        { id: 'q2', question: '7 + 6 = ?', options: ['12', '13', '14', '15'], correctIndex: 1, explanation: '7 + 6 = 13' },
        { id: 'q3', question: '9 + 8 = ?', options: ['15', '16', '17', '18'], correctIndex: 2, explanation: '9 + 8 = 17' },
        { id: 'q4', question: '4 + 9 = ?', options: ['11', '12', '13', '14'], correctIndex: 2, explanation: '4 + 9 = 13' },
        { id: 'q5', question: '6 + 5 = ?', options: ['10', '11', '12', '13'], correctIndex: 1, explanation: '6 + 5 = 11' },
      ],
    },
  },
  {
    id: 'math-matching-1',
    title: 'Знайди пару: результати',
    description: 'Зʼєднай приклади з їх відповідями',
    type: 'MATCHING',
    difficulty: 'EASY',
    subjectId: 'math',
    gradeNumber: 2,
    topicId: 'arithmetic',
    thumbnailEmoji: '🧩',
    estimatedTime: 5,
    contentJson: {
      pairs: [
        { id: 'p1', left: '2 + 2', right: '4' },
        { id: 'p2', left: '3 + 5', right: '8' },
        { id: 'p3', left: '6 + 4', right: '10' },
        { id: 'p4', left: '7 + 3', right: '10' },
        { id: 'p5', left: '9 + 1', right: '10' },
        { id: 'p6', left: '5 + 6', right: '11' },
      ],
    },
  },
  {
    id: 'math-dragdrop-1',
    title: 'Сортування чисел',
    description: 'Розподіли числа на парні та непарні',
    type: 'DRAG_DROP',
    difficulty: 'MEDIUM',
    subjectId: 'math',
    gradeNumber: 2,
    topicId: 'arithmetic',
    thumbnailEmoji: '🎲',
    estimatedTime: 7,
    contentJson: {
      zones: [
        { id: 'even', label: 'Парні' },
        { id: 'odd', label: 'Непарні' },
      ],
      items: [
        { id: 'n2', content: '2', targetZone: 'even' },
        { id: 'n4', content: '4', targetZone: 'even' },
        { id: 'n6', content: '6', targetZone: 'even' },
        { id: 'n8', content: '8', targetZone: 'even' },
        { id: 'n1', content: '1', targetZone: 'odd' },
        { id: 'n3', content: '3', targetZone: 'odd' },
        { id: 'n5', content: '5', targetZone: 'odd' },
        { id: 'n7', content: '7', targetZone: 'odd' },
      ],
    },
  },
  // Ukrainian Exercises
  {
    id: 'ukr-quiz-1',
    title: 'Голосні та приголосні',
    description: 'Визначте голосні та приголосні звуки',
    type: 'QUIZ',
    difficulty: 'EASY',
    subjectId: 'ukr',
    gradeNumber: 2,
    topicId: 'phonetics',
    thumbnailEmoji: '🔊',
    estimatedTime: 5,
    contentJson: {
      questions: [
        { id: 'q1', question: 'Яка літера голосна?', options: ['Б', 'А', 'В', 'Г'], correctIndex: 1 },
        { id: 'q2', question: 'Скільки голосних у слові "мама"?', options: ['1', '2', '3', '4'], correctIndex: 1 },
        { id: 'q3', question: 'Яка літера приголосна?', options: ['О', 'У', 'К', 'И'], correctIndex: 2 },
        { id: 'q4', question: 'Скільки складів у слові "школа"?', options: ['1', '2', '3', '4'], correctIndex: 1 },
      ],
    },
  },
  {
    id: 'ukr-matching-1',
    title: 'Антоніми',
    description: 'Знайди слова з протилежним значенням',
    type: 'MATCHING',
    difficulty: 'MEDIUM',
    subjectId: 'ukr',
    gradeNumber: 2,
    topicId: 'lexics',
    thumbnailEmoji: '🔄',
    estimatedTime: 6,
    contentJson: {
      pairs: [
        { id: 'p1', left: 'великий', right: 'маленький' },
        { id: 'p2', left: 'день', right: 'ніч' },
        { id: 'p3', left: 'гарячий', right: 'холодний' },
        { id: 'p4', left: 'швидкий', right: 'повільний' },
        { id: 'p5', left: 'веселий', right: 'сумний' },
      ],
    },
  },
  {
    id: 'ukr-fillin-1',
    title: 'Вставте пропущені літери',
    description: 'Заповніть пропуски правильними літерами',
    type: 'FILL_IN',
    difficulty: 'MEDIUM',
    subjectId: 'ukr',
    gradeNumber: 2,
    topicId: 'spelling',
    thumbnailEmoji: '✏️',
    estimatedTime: 8,
    contentJson: {
      sentences: [
        { id: 's1', text: 'С_нце світить яскраво.', blanks: [{ index: 1, answer: 'о' }] },
        { id: 's2', text: 'Діти гра_ться на подвір_і.', blanks: [{ index: 6, answer: 'ю' }, { index: 18, answer: "''" }] },
        { id: 's3', text: 'Моя мама най_раща.', blanks: [{ index: 10, answer: 'к' }] },
      ],
    },
  },
  // External Link Exercises
  {
    id: 'external-math-1',
    title: 'Переміщення додавання (Знаємо Математику)',
    description: 'Інтерактивна вправа на сайті znaiemomatematyku.org',
    type: 'EXTERNAL_LINK',
    difficulty: 'EASY',
    subjectId: 'math',
    gradeNumber: 2,
    topicId: 'arithmetic',
    thumbnailEmoji: '🌐',
    estimatedTime: 10,
    externalUrl: 'https://www.znaiemomatematyku.org/peremishchennia-dodavannia-za-dopomohoiu-kartynok-1?source=explicitKC&topic=vpravy-aryfmetyka',
    contentJson: {},
  },
  {
    id: 'external-ukr-1',
    title: 'Особливості правопису (Знаємо Українську)',
    description: 'Інтерактивна вправа на сайті znaiemoukrainsku.org',
    type: 'EXTERNAL_LINK',
    difficulty: 'MEDIUM',
    subjectId: 'ukr',
    gradeNumber: 2,
    topicId: 'phonetics',
    thumbnailEmoji: '🌐',
    estimatedTime: 10,
    externalUrl: 'https://www.znaiemoukrainsku.org/dopovnennia-osoblyvosti-pravopysu-ukrainskykh-sliv-1?source=explicitKC&topic=fonetyka-pravopys',
    contentJson: {},
  },
];

// Sample Teacher
export const sampleTeacher: User = {
  id: 'teacher-1',
  email: 'teacher@ukrschool.ua',
  name: 'Оксана Петрівна',
  role: 'TEACHER',
  avatarUrl: undefined,
};

// Sample Classes
export const classGroups: ClassGroup[] = [
  { id: 'class-2a', name: '2-А клас', teacherId: 'teacher-1', grade: 2, studentCount: 25 },
  { id: 'class-2b', name: '2-Б клас', teacherId: 'teacher-1', grade: 2, studentCount: 23 },
  { id: 'class-3a', name: '3-А клас', teacherId: 'teacher-1', grade: 3, studentCount: 24 },
];

// Sample Students
export const students: StudentProfile[] = [
  { id: 'student-1', nickname: 'Марійка', avatarEmoji: '🦋', classGroupId: 'class-2a' },
  { id: 'student-2', nickname: 'Петрик', avatarEmoji: '🚀', classGroupId: 'class-2a' },
  { id: 'student-3', nickname: 'Оленка', avatarEmoji: '🌻', classGroupId: 'class-2a' },
  { id: 'student-4', nickname: 'Василько', avatarEmoji: '⚽', classGroupId: 'class-2a' },
  { id: 'student-5', nickname: 'Софійка', avatarEmoji: '🎨', classGroupId: 'class-2b' },
];

// Difficulty labels in Ukrainian
export const difficultyLabels = {
  EASY: 'Легко',
  MEDIUM: 'Середньо',
  HARD: 'Складно',
};

// Exercise type labels in Ukrainian
export const exerciseTypeLabels = {
  MATCHING: 'Знайди пару',
  DRAG_DROP: 'Перетягни',
  CROSSWORD: 'Кросворд',
  REBUS: 'Ребус',
  QUIZ: 'Тест',
  FILL_IN: 'Заповни пропуски',
  EXTERNAL_LINK: 'Зовнішнє посилання',
};
