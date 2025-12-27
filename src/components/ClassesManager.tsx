import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Users, ArrowLeft, Pencil, Trash2, Loader2, UserPlus, Upload, X, Camera } from 'lucide-react';
import { useClasses, useStudentsByClass, useCreateClass, useUpdateClass, useDeleteClass, useCreateStudent, useUpdateStudent, useDeleteStudent, ClassGroup, StudentProfile } from '@/hooks/useClasses';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AVATAR_EMOJIS = ['🧒', '👧', '👦', '👩', '🧑', '👨', '👶', '🧒🏻', '👧🏻', '👦🏻', '🧒🏽', '👧🏽', '👦🏽', '🧒🏿', '👧🏿', '👦🏿'];

export const ClassesManager = () => {
  const { data: classes = [], isLoading } = useClasses();
  const [selectedClass, setSelectedClass] = useState<ClassGroup | null>(null);
  const [isClassDialogOpen, setIsClassDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassGroup | null>(null);

  const handleAddClass = () => {
    setEditingClass(null);
    setIsClassDialogOpen(true);
  };

  const handleEditClass = (classGroup: ClassGroup, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingClass(classGroup);
    setIsClassDialogOpen(true);
  };

  if (selectedClass) {
    return <StudentsList classGroup={selectedClass} onBack={() => setSelectedClass(null)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-foreground">Мої класи</h2>
        <Button onClick={handleAddClass}>
          <Plus className="mr-2 h-4 w-4" />Додати клас
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : classes.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Немає класів</h3>
          <p className="text-muted-foreground mb-4">Створіть свій перший клас, щоб почати</p>
          <Button onClick={handleAddClass}>
            <Plus className="mr-2 h-4 w-4" />Додати клас
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map(classGroup => (
            <ClassCard
              key={classGroup.id}
              classGroup={classGroup}
              onClick={() => setSelectedClass(classGroup)}
              onEdit={(e) => handleEditClass(classGroup, e)}
            />
          ))}
        </div>
      )}

      <ClassDialog
        isOpen={isClassDialogOpen}
        onClose={() => setIsClassDialogOpen(false)}
        classGroup={editingClass}
      />
    </div>
  );
};

const ClassCard: React.FC<{
  classGroup: ClassGroup;
  onClick: () => void;
  onEdit: (e: React.MouseEvent) => void;
}> = ({ classGroup, onClick, onEdit }) => {
  const { data: students = [] } = useStudentsByClass(classGroup.id);
  const deleteClass = useDeleteClass();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Видалити цей клас? Усі учні класу будуть відкріплені.')) {
      try {
        await deleteClass.mutateAsync(classGroup.id);
        toast.success('Клас видалено');
      } catch (error) {
        toast.error('Помилка при видаленні класу');
      }
    }
  };

  return (
    <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group" onClick={onClick}>
      <div className="h-24 bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center relative">
        <span className="text-4xl font-bold text-primary">{classGroup.name}</span>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          <Button size="icon" variant="secondary" className="h-8 w-8" onClick={onEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="destructive" className="h-8 w-8" onClick={handleDelete} disabled={deleteClass.isPending}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <Badge variant="secondary">{classGroup.grade} клас</Badge>
          <span className="text-sm text-muted-foreground">{students.length} учнів</span>
        </div>
      </CardContent>
    </Card>
  );
};

const ClassDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  classGroup: ClassGroup | null;
}> = ({ isOpen, onClose, classGroup }) => {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('1');
  const createClass = useCreateClass();
  const updateClass = useUpdateClass();

  React.useEffect(() => {
    if (classGroup) {
      setName(classGroup.name);
      setGrade(classGroup.grade.toString());
    } else {
      setName('');
      setGrade('1');
    }
  }, [classGroup, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      if (classGroup) {
        await updateClass.mutateAsync({ id: classGroup.id, name: name.trim(), grade: parseInt(grade) });
        toast.success('Клас оновлено');
      } else {
        await createClass.mutateAsync({ name: name.trim(), grade: parseInt(grade) });
        toast.success('Клас створено');
      }
      onClose();
    } catch (error) {
      toast.error('Помилка при збереженні');
    }
  };

  const isPending = createClass.isPending || updateClass.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{classGroup ? 'Редагувати клас' : 'Новий клас'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Назва класу</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Наприклад: 2-А" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="grade">Рівень</Label>
            <Select value={grade} onValueChange={setGrade}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(g => (
                  <SelectItem key={g} value={g.toString()}>{g} клас</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Скасувати</Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {classGroup ? 'Зберегти' : 'Створити'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const StudentsList: React.FC<{
  classGroup: ClassGroup;
  onBack: () => void;
}> = ({ classGroup, onBack }) => {
  const { data: students = [], isLoading } = useStudentsByClass(classGroup.id);
  const [isStudentDialogOpen, setIsStudentDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentProfile | null>(null);

  const handleAddStudent = () => {
    setEditingStudent(null);
    setIsStudentDialogOpen(true);
  };

  const handleEditStudent = (student: StudentProfile) => {
    setEditingStudent(student);
    setIsStudentDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-foreground">{classGroup.name}</h2>
          <p className="text-sm text-muted-foreground">{classGroup.grade} клас • {students.length} учнів</p>
        </div>
        <Button onClick={handleAddStudent}>
          <UserPlus className="mr-2 h-4 w-4" />Додати учня
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : students.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Немає учнів</h3>
          <p className="text-muted-foreground mb-4">Додайте учнів до цього класу</p>
          <Button onClick={handleAddStudent}>
            <UserPlus className="mr-2 h-4 w-4" />Додати учня
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {students.map(student => (
            <StudentCard key={student.id} student={student} onEdit={() => handleEditStudent(student)} />
          ))}
        </div>
      )}

      <StudentDialog
        isOpen={isStudentDialogOpen}
        onClose={() => setIsStudentDialogOpen(false)}
        student={editingStudent}
        classGroupId={classGroup.id}
      />
    </div>
  );
};

const StudentCard: React.FC<{
  student: StudentProfile;
  onEdit: () => void;
}> = ({ student, onEdit }) => {
  const deleteStudent = useDeleteStudent();

  const handleDelete = async () => {
    if (confirm(`Видалити учня "${student.nickname}"?`)) {
      try {
        await deleteStudent.mutateAsync({ id: student.id, classGroupId: student.class_group_id! });
        toast.success('Учня видалено');
      } catch (error) {
        toast.error('Помилка при видаленні');
      }
    }
  };

  return (
    <Card className="p-4 group hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl overflow-hidden">
          {student.photo_url ? (
            <img 
              src={student.photo_url} 
              alt={student.nickname} 
              className="w-full h-full object-cover"
            />
          ) : (
            student.avatar_emoji
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground truncate">{student.nickname}</p>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={handleDelete} disabled={deleteStudent.isPending}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

const StudentDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile | null;
  classGroupId: string;
}> = ({ isOpen, onClose, student, classGroupId }) => {
  const [nickname, setNickname] = useState('');
  const [avatarEmoji, setAvatarEmoji] = useState('🧒');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();

  React.useEffect(() => {
    if (student) {
      setNickname(student.nickname);
      setAvatarEmoji(student.avatar_emoji);
      setPhotoUrl(student.photo_url);
    } else {
      setNickname('');
      setAvatarEmoji('🧒');
      setPhotoUrl(null);
    }
  }, [student, isOpen]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Будь ласка, виберіть зображення');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Файл занадто великий (максимум 5MB)');
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `students/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('student-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('student-photos')
        .getPublicUrl(filePath);

      setPhotoUrl(data.publicUrl);
      toast.success('Фото завантажено');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Помилка завантаження фото');
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = () => {
    setPhotoUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;

    try {
      if (student) {
        await updateStudent.mutateAsync({ id: student.id, nickname: nickname.trim(), avatarEmoji, classGroupId, photoUrl });
        toast.success('Учня оновлено');
      } else {
        await createStudent.mutateAsync({ nickname: nickname.trim(), avatarEmoji, classGroupId, photoUrl: photoUrl || undefined });
        toast.success('Учня додано');
      }
      onClose();
    } catch (error) {
      toast.error('Помилка при збереженні');
    }
  };

  const isPending = createStudent.isPending || updateStudent.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{student ? 'Редагувати учня' : 'Новий учень'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Photo Upload */}
          <div className="space-y-2">
            <Label>Фото учня</Label>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-dashed border-border">
                {photoUrl ? (
                  <>
                    <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute -top-1 -right-1 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </>
                ) : (
                  <span className="text-3xl">{avatarEmoji}</span>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full"
                >
                  {uploading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="mr-2 h-4 w-4" />
                  )}
                  {photoUrl ? 'Змінити фото' : 'Завантажити фото'}
                </Button>
                <p className="text-xs text-muted-foreground">
                  Або виберіть аватар нижче
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nickname">Ім'я або нікнейм</Label>
            <Input id="nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="Наприклад: Максим" required />
          </div>
          
          <div className="space-y-2">
            <Label>Аватар (якщо немає фото)</Label>
            <div className="flex flex-wrap gap-2">
              {AVATAR_EMOJIS.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setAvatarEmoji(emoji)}
                  className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${avatarEmoji === emoji ? 'bg-primary/20 ring-2 ring-primary' : 'bg-muted hover:bg-muted/80'}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Скасувати</Button>
            <Button type="submit" disabled={isPending || uploading}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {student ? 'Зберегти' : 'Додати'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClassesManager;
