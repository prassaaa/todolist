import type { Task } from '@/types/task'
import { StatusBadge } from './StatusBadge'
import { PriorityIcon } from './PriorityIcon'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { MoreVertical, Trash2, Archive, Image } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { getTagColor } from '@/lib/tag-colors'

interface ListViewProps {
  tasks: Task[]
  isLoading?: boolean
  onTaskClick?: (task: Task) => void
  onArchive?: (id: string) => void
  onDelete?: (id: string) => void
}

function TaskRow({ task, onTaskClick, onArchive, onDelete }: {
  task: Task
  onTaskClick?: (task: Task) => void
  onArchive?: (id: string) => void
  onDelete?: (id: string) => void
}) {
  return (
    <div
      className="group flex items-center gap-4 px-4 py-3 hover:bg-accent/50 cursor-pointer transition-colors rounded-lg"
      onClick={() => onTaskClick?.(task)}
    >
      {/* Thumbnail */}
      <div className="shrink-0">
        {task.image_url ? (
          <img
            src={task.image_url}
            alt=""
            className="w-10 h-10 rounded-lg object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <Image className="w-4 h-4 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Title & Description */}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate">{task.title}</div>
        {task.description && (
          <div className="text-xs text-muted-foreground truncate mt-0.5">
            {task.description}
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="hidden md:flex items-center gap-1 shrink-0">
        {task.tags.slice(0, 2).map((tag) => (
          <Badge key={tag} variant="secondary" className={`text-[10px] px-1.5 py-0 h-5 ${getTagColor(tag)}`}>
            {tag}
          </Badge>
        ))}
        {task.tags.length > 2 && (
          <span className="text-[10px] text-muted-foreground">+{task.tags.length - 2}</span>
        )}
      </div>

      {/* Status & Priority */}
      <div className="hidden sm:flex items-center gap-1.5 shrink-0">
        <StatusBadge status={task.status} />
        <PriorityIcon priority={task.priority} />
      </div>

      {/* Date */}
      <span className="hidden lg:block text-[11px] text-muted-foreground shrink-0 w-24 text-right">
        {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
      </span>

      {/* Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <MoreVertical className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onArchive?.(task.id) }}>
            <Archive className="mr-2 h-3.5 w-3.5" />
            Archive
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => { e.stopPropagation(); onDelete?.(task.id) }}
            className="text-destructive"
          >
            <Trash2 className="mr-2 h-3.5 w-3.5" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export function ListView({ tasks, isLoading, onTaskClick, onArchive, onDelete }: ListViewProps) {
  if (isLoading) {
    return (
      <div className="space-y-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-3 w-[300px]" />
            </div>
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        ))}
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <Image className="w-6 h-6 text-muted-foreground" />
        </div>
        <h3 className="text-base font-medium mb-1">No tasks yet</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Create your first task to get started.
        </p>
      </div>
    )
  }

  return (
    <div className="border rounded-xl divide-y">
      {tasks.map((task) => (
        <TaskRow
          key={task.id}
          task={task}
          onTaskClick={onTaskClick}
          onArchive={onArchive}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
