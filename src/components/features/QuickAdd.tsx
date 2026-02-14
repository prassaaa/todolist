import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { CreateTaskInput } from '@/types/task'

interface QuickAddProps {
  onAdd: (values: CreateTaskInput) => void
  isLoading?: boolean
}

export function QuickAdd({ onAdd, isLoading }: QuickAddProps) {
  const [title, setTitle] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onAdd({
      title: title.trim(),
      description: '',
      status: 'todo',
      priority: 'medium',
      tags: [],
    })
    setTitle('')
  }

  return (
    <form onSubmit={handleSubmit} className="relative group">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-md bg-muted/80 flex items-center justify-center group-focus-within:bg-violet-100 dark:group-focus-within:bg-violet-900/30 transition-colors">
        <Plus className="h-3 w-3 text-muted-foreground group-focus-within:text-violet-500 transition-colors" />
      </div>
      <input
        type="text"
        placeholder="Tambah tugas cepat..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isLoading}
        className="w-full h-10 pl-11 pr-4 text-sm bg-muted/40 border border-transparent rounded-xl placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/30 focus:bg-background disabled:opacity-50 transition-all"
      />
    </form>
  )
}
