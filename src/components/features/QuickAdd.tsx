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
    <form onSubmit={handleSubmit} className="relative">
      <Plus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        type="text"
        placeholder="Quick add task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isLoading}
        className="w-full h-9 pl-9 pr-4 text-sm bg-muted/50 border-0 rounded-lg placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50 transition-colors"
      />
    </form>
  )
}
