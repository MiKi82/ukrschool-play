import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Trophy,
  Clock,
  Target,
  BookOpen,
  Loader2,
  User,
  Star,
  Award,
} from 'lucide-react';
import { useClasses, useStudentsByClass } from '@/hooks/useClasses';
import { useStudentProgress } from '@/hooks/useStudentProgress';
import { useSubjects } from '@/hooks/useExercises';
import { useAchievements, useStudentAchievements } from '@/hooks/useAchievements';
import { AchievementBadge } from '@/components/AchievementBadge';

const difficultyLabels: Record<string, string> = {
  EASY: 'Легко',
  MEDIUM: 'Середньо',
  HARD: 'Складно',
};

const StudentProgressTracker: React.FC = () => {
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

  const { data: classes = [], isLoading: classesLoading } = useClasses();
  const { data: students = [], isLoading: studentsLoading } = useStudentsByClass(selectedClassId);
  const { data: subjects = [] } = useSubjects();
  const { data: allAchievements = [] } = useAchievements();
  const { data: studentAchievements = [] } = useStudentAchievements(selectedStudentId);
  const { progress, results, isLoading: progressLoading } = useStudentProgress(selectedStudentId);

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  const earnedAchievementIds = new Set(studentAchievements.map(a => a.achievement_id));
  const totalPoints = studentAchievements.reduce(
    (acc, sa) => acc + (sa.achievements?.points || 0),
    0
  );

  const filteredResults = selectedSubjectId
    ? results.filter(r => r.exercises?.subject_id === selectedSubjectId)
    : results;

  const filteredProgress = selectedSubjectId && progress.bySubject[selectedSubjectId]
    ? progress.bySubject[selectedSubjectId]
    : null;

  if (classesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <Card className="p-8 text-center">
        <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">Немає класів</h3>
        <p className="text-muted-foreground">
          Спочатку створіть класи та додайте учнів у розділі "Класи"
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select
          value={selectedClassId || ''}
          onValueChange={(value) => {
            setSelectedClassId(value);
            setSelectedStudentId(null);
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Оберіть клас" />
          </SelectTrigger>
          <SelectContent>
            {classes.map((cls) => (
              <SelectItem key={cls.id} value={cls.id}>
                {cls.name} ({cls.grade} клас)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedClassId && (
          <Select
            value={selectedStudentId || ''}
            onValueChange={setSelectedStudentId}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Оберіть учня" />
            </SelectTrigger>
            <SelectContent>
              {studentsLoading ? (
                <div className="p-2 text-center">
                  <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                </div>
              ) : students.length === 0 ? (
                <div className="p-2 text-center text-muted-foreground">
                  Немає учнів
                </div>
              ) : (
                students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.avatar_emoji} {student.nickname}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        )}

        {selectedStudentId && (
          <Select
            value={selectedSubjectId || 'all'}
            onValueChange={(value) => setSelectedSubjectId(value === 'all' ? null : value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Всі предмети" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Всі предмети</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.icon} {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Student Progress */}
      {selectedStudentId && selectedStudent && (
        <div className="space-y-6">
          {/* Student Header */}
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{selectedStudent.avatar_emoji}</div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{selectedStudent.nickname}</h2>
                <p className="text-muted-foreground">
                  {classes.find(c => c.id === selectedClassId)?.name}
                </p>
              </div>
            </div>
          </Card>

          {progressLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Виконано вправ</p>
                      <p className="text-2xl font-bold text-foreground">
                        {selectedSubjectId ? filteredResults.length : progress.completedExercises}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-secondary/10">
                      <Trophy className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Середній бал</p>
                      <p className="text-2xl font-bold text-foreground">
                        {filteredProgress?.averageScore ?? progress.averageScore}%
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <Clock className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Час навчання</p>
                      <p className="text-2xl font-bold text-foreground">
                        {Math.round((filteredProgress?.totalTime ?? progress.totalTimeSpent) / 60)} хв
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Star className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Зірок зібрано</p>
                      <p className="text-2xl font-bold text-foreground">
                        {filteredResults.reduce((acc, r) => acc + Math.ceil(r.score / 20), 0)}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Achievements Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Нагороди
                    </div>
                    <Badge variant="secondary" className="text-lg">
                      {totalPoints} балів
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {allAchievements.map((achievement) => {
                      const earned = earnedAchievementIds.has(achievement.id);
                      const studentAchievement = studentAchievements.find(
                        sa => sa.achievement_id === achievement.id
                      );
                      return (
                        <AchievementBadge
                          key={achievement.id}
                          icon={achievement.icon}
                          name={achievement.name}
                          description={achievement.description}
                          points={achievement.points}
                          earned={earned}
                          earnedAt={studentAchievement?.earned_at}
                          size="md"
                        />
                      );
                    })}
                  </div>
                  {studentAchievements.length === 0 && (
                    <p className="text-muted-foreground text-center py-4 mt-4 border-t">
                      Ще немає нагород. Виконуйте вправи, щоб отримати нагороди!
                    </p>
                  )}
                </CardContent>
              </Card>

              {!selectedSubjectId && Object.keys(progress.bySubject).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Прогрес за предметами
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(progress.bySubject).map(([subjectId, data]) => (
                      <div key={subjectId} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span>{data.subjectIcon}</span>
                            <span className="font-medium">{data.subjectName}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{data.completed} вправ</span>
                            <span>{data.averageScore}%</span>
                          </div>
                        </div>
                        <Progress value={data.averageScore} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Recent Results */}
              <Card>
                <CardHeader>
                  <CardTitle>Історія виконання</CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredResults.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Ще немає результатів
                    </p>
                  ) : (
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-3">
                        {filteredResults.map((result) => (
                          <div
                            key={result.id}
                            className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
                          >
                            <div className="text-3xl">
                              {result.exercises?.thumbnail_emoji || '📝'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-foreground truncate">
                                {result.exercises?.title || 'Вправа'}
                              </h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>
                                  {new Date(result.completed_at).toLocaleDateString('uk-UA')}
                                </span>
                                <span>•</span>
                                <span>{Math.floor(result.time_spent / 60)}:{String(result.time_spent % 60).padStart(2, '0')}</span>
                                {result.exercises?.difficulty && (
                                  <>
                                    <span>•</span>
                                    <Badge variant={
                                      result.exercises.difficulty === 'EASY' ? 'easy' :
                                      result.exercises.difficulty === 'MEDIUM' ? 'medium' : 'hard'
                                    } className="text-xs">
                                      {difficultyLabels[result.exercises.difficulty]}
                                    </Badge>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1 mb-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < Math.ceil(result.score / 20)
                                        ? 'text-secondary fill-secondary'
                                        : 'text-muted'
                                    }`}
                                  />
                                ))}
                              </div>
                              <p className="text-lg font-bold text-foreground">
                                {result.score}%
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}

      {/* Empty State */}
      {!selectedStudentId && selectedClassId && (
        <Card className="p-8 text-center">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Оберіть учня</h3>
          <p className="text-muted-foreground">
            Виберіть учня зі списку, щоб переглянути його прогрес
          </p>
        </Card>
      )}

      {!selectedClassId && (
        <Card className="p-8 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Оберіть клас</h3>
          <p className="text-muted-foreground">
            Виберіть клас зі списку, щоб переглянути учнів та їх прогрес
          </p>
        </Card>
      )}
    </div>
  );
};

export default StudentProgressTracker;
