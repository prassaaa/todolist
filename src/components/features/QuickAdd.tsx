import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus } from 'lucide-react'
import { TaskFormValues } from './TaskForm'

interface QuickAddProps {
  onAdd: (values: TaskFormValues) => void
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
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        placeholder="Quick add task... (Press Enter)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isLoading}
        className="flex-1"
      />
      <Button 
        type="submit" 
        disabled={!title.trim() || isLoading}
        size="icon"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </form>
  )
}
