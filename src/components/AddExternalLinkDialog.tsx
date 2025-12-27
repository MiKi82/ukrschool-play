import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSubjects, useTopics } from '@/hooks/useExercises';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Link2, ExternalLink } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

const GRADES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

const EMOJI_OPTIONS = ['🔗', '📚', '🎮', '✏️', '🧩', '📖', '🎯', '⭐', '🌟', '📝'];

const formSchema = z.object({
  url: z.string().url('Введіть коректну URL-адресу'),
  title: z.string().min(3, 'Мінімум 3 символи'),
  description: z.string().optional(),
  subjectId: z.string().min(1, 'Оберіть предмет'),
  gradeNumber: z.number().min(1).max(11),
  topicId: z.string().optional(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  thumbnailEmoji: z.string().min(1),
  estimatedTime: z.number().min(1).max(60),
});

type FormValues = z.infer<typeof formSchema>;

interface AddExternalLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddExternalLinkDialog: React.FC<AddExternalLinkDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: subjects = [] } = useSubjects();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
      title: '',
      description: '',
      subjectId: '',
      gradeNumber: 3,
      topicId: '',
      difficulty: 'MEDIUM',
      thumbnailEmoji: '🔗',
      estimatedTime: 5,
    },
  });

  const selectedSubject = form.watch('subjectId');
  const selectedGrade = form.watch('gradeNumber');

  const { data: topics = [] } = useTopics(
    selectedSubject || undefined,
    selectedGrade || undefined
  );

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('exercises').insert({
        type: 'EXTERNAL_LINK',
        external_url: values.url,
        title: values.title,
        description: values.description || null,
        subject_id: values.subjectId,
        grade_number: values.gradeNumber,
        topic_id: values.topicId || null,
        difficulty: values.difficulty,
        thumbnail_emoji: values.thumbnailEmoji,
        estimated_time: values.estimatedTime,
        content_json: { url: values.url },
      });

      if (error) throw error;

      toast.success('Завдання додано до бібліотеки!');
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error adding exercise:', error);
      toast.error('Помилка при додаванні: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Додати зовнішнє завдання
          </DialogTitle>
          <DialogDescription>
            Додайте посилання на завдання з Learning.ua, LearningApps чи інших платформ
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* URL */}
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Посилання на завдання *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...field}
                        placeholder="https://learning.ua/mova/..."
                        className="pl-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Назва завдання *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Дописуємо префікси" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Опис (необов'язково)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Короткий опис завдання..."
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Subject & Grade Row */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="subjectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Предмет *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Оберіть" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.icon} {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gradeNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Клас *</FormLabel>
                    <Select
                      onValueChange={(v) => field.onChange(parseInt(v))}
                      value={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {GRADES.map((grade) => (
                          <SelectItem key={grade} value={grade.toString()}>
                            {grade} клас
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Topic - optional, shows if subject & grade selected */}
            {selectedSubject && selectedGrade && topics.length > 0 && (
              <FormField
                control={form.control}
                name="topicId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Тема (необов'язково)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Оберіть тему" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {topics.map((topic) => (
                          <SelectItem key={topic.id} value={topic.id}>
                            {topic.icon} {topic.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Difficulty & Time Row */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Складність</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="EASY">Легко</SelectItem>
                        <SelectItem value="MEDIUM">Середньо</SelectItem>
                        <SelectItem value="HARD">Складно</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estimatedTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Час (хв)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={60}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 5)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Emoji Picker */}
            <FormField
              control={form.control}
              name="thumbnailEmoji"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Іконка</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-2">
                      {EMOJI_OPTIONS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => field.onChange(emoji)}
                          className={`text-2xl p-2 rounded-lg transition-all ${
                            field.value === emoji
                              ? 'bg-primary/20 ring-2 ring-primary'
                              : 'hover:bg-muted'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Скасувати
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Додаємо...
                  </>
                ) : (
                  'Додати завдання'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExternalLinkDialog;
