import type { Task } from '@/types/task'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StatusBadge } from './StatusBadge'
import { PriorityIcon } from './PriorityIcon'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { MoreVertical, Trash2, Archive } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'

interface ListViewProps {
  tasks: Task[]
  isLoading?: boolean
  onTaskClick?: (task: Task) => void
  onArchive?: (id: string) => void
  onDelete?: (id: string) => void
}

const tagColors: Record<string, string> = {
  bug: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  feature: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  refactor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  bugfix: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  improvement: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  documentation: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
}

const getTagColor = (tag: string) => {
  return tagColors[tag.toLowerCase()] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
}

function TaskRow({ task, onTaskClick, onArchive, onDelete }: {
  task: Task
  onTaskClick?: (task: Task) => void
  onArchive?: (id: string) => void
  onDelete?: (id: string) => void
}) {
  return (
    <TableRow 
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => onTaskClick?.(task)}
    >
      <TableCell className="font-medium">
        <div className="max-w-[300px]">
          <div className="truncate">{task.title}</div>
        </div>
      </TableCell>
      <TableCell>
        <StatusBadge status={task.status} />
      </TableCell>
      <TableCell>
        <PriorityIcon priority={task.priority} />
      </TableCell>
      <TableCell>
        {task.description && (
          <div className="max-w-[400px] text-sm text-muted-foreground line-clamp-1">
            {task.description}
          </div>
        )}
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1.5">
          {task.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className={`text-xs ${getTagColor(tag)}`}>
              {tag}
            </Badge>
          ))}
          {task.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{task.tags.length - 3}
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
        {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onArchive?.(task.id) }}>
              <Archive className="mr-2 h-4 w-4" />
              Archive
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={(e) => { e.stopPropagation(); onDelete?.(task.id) }}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}

function SkeletonRow() {
  return (
    <TableRow>
      <TableCell><Skeleton className="h-5 w-[200px]" /></TableCell>
      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
      <TableCell><Skeleton className="h-5 w-[300px]" /></TableCell>
      <TableCell><Skeleton className="h-5 w-[100px]" /></TableCell>
      <TableCell><Skeleton className="h-5 w-[100px]" /></TableCell>
      <TableCell><Skeleton className="h-8 w-8" /></TableCell>
    </TableRow>
  )
}

export function ListView({ tasks, isLoading, onTaskClick, onArchive, onDelete }: ListViewProps) {
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => <SkeletonRow key={i} />)}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold mb-2">No tasks yet</h3>
        <p className="text-muted-foreground max-w-md">
          Get started by creating your first task. Use the quick add button above or click "Create Task" to begin.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[60px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onTaskClick={onTaskClick}
              onArchive={onArchive}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
