import { useForm, useWatch } from 'react-hook-form'
import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Check } from 'lucide-react'
import { ImageUpload } from './ImageUpload'
import type { TaskStatus, TaskPriority } from '@/types/task'

const taskFormSchema = z.object({
  title: z.string().min(1, 'Judul wajib diisi').max(200, 'Judul terlalu panjang'),
  description: z.string().max(2000, 'Deskripsi terlalu panjang').optional(),
  status: z.enum(['todo', 'in_progress', 'code_review', 'done'] as const),
  priority: z.enum(['low', 'medium', 'high', 'critical'] as const),
  tags: z.array(z.string()).default([]),
  image_url: z.string().min(1, 'Gambar wajib diunggah'),
})

type TaskFormInput = z.input<typeof taskFormSchema>
export type TaskFormValues = z.output<typeof taskFormSchema>

interface TaskFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: TaskFormValues) => void
  initialValues?: Partial<TaskFormValues>
  isLoading?: boolean
}

const availableTags = [
  'bug', 'feature', 'refactor', 'bugfix', 'improvement', 'documentation', 'chore'
]

export function TaskForm({ open, onOpenChange, onSubmit, initialValues, isLoading }: TaskFormProps) {
  const form = useForm<TaskFormInput, undefined, TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      tags: [],
      image_url: '',
      ...initialValues,
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        tags: [],
        image_url: '',
        ...initialValues,
      })
    }
  }, [open, initialValues, form])

  const selectedTags = useWatch({ control: form.control, name: 'tags' }) ?? []
  const imageUrl = useWatch({ control: form.control, name: 'image_url' })

  const toggleTag = (tag: string) => {
    const currentTags = form.getValues('tags') ?? []
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag]
    form.setValue('tags', newTags)
  }

  const handleSubmit = form.handleSubmit((values) => onSubmit(values))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-lg">
            {initialValues?.title ? 'Edit Tugas' : 'Buat Tugas Baru'}
          </DialogTitle>
          <DialogDescription>
            {initialValues?.title ? 'Perbarui detail tugas di bawah.' : 'Isi detail untuk membuat tugas baru.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5 mt-4">
          {/* Image Upload - prominent position */}
          <div>
            <ImageUpload
              value={imageUrl}
              onChange={(value) => form.setValue('image_url', value ?? '', { shouldValidate: true })}
              disabled={isLoading}
            />
            {form.formState.errors.image_url && (
              <p className="text-xs text-destructive mt-1.5">{form.formState.errors.image_url.message}</p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-xs font-medium">Judul *</Label>
            <Input
              id="title"
              placeholder="Apa yang perlu dikerjakan?"
              className="rounded-xl"
              {...form.register('title')}
            />
            {form.formState.errors.title && (
              <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-xs font-medium">Deskripsi</Label>
            <Textarea
              id="description"
              placeholder="Tambahkan detail..."
              className="min-h-[80px] rounded-xl resize-none"
              {...form.register('description')}
            />
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Status</Label>
              <Select
                defaultValue={form.getValues('status')}
                onValueChange={(value) => form.setValue('status', value as TaskStatus)}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">Belum Mulai</SelectItem>
                  <SelectItem value="in_progress">Dikerjakan</SelectItem>
                  <SelectItem value="code_review">Ditinjau</SelectItem>
                  <SelectItem value="done">Selesai</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Prioritas</Label>
              <Select
                defaultValue={form.getValues('priority')}
                onValueChange={(value) => form.setValue('priority', value as TaskPriority)}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Pilih prioritas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Rendah</SelectItem>
                  <SelectItem value="medium">Sedang</SelectItem>
                  <SelectItem value="high">Tinggi</SelectItem>
                  <SelectItem value="critical">Kritis</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Label</Label>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map((tag) => {
                const isSelected = selectedTags?.includes(tag)
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border transition-all duration-150 ${
                      isSelected
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-transparent text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    {tag}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="rounded-xl"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isLoading}
              className="rounded-xl bg-linear-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white border-0 shadow-sm shadow-violet-500/20"
            >
              {isLoading ? 'Menyimpan...' : initialValues?.title ? 'Simpan Perubahan' : 'Buat Tugas'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
