import type { Task } from '@/types/task'
import { StatusBadge } from './StatusBadge'
import { PriorityIcon } from './PriorityIcon'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { MoreVertical, Trash2, Archive, Image, Clock } from 'lucide-react'
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

/* ─── Header Row ─── */
function ListHeader() {
  return (
    <div className="flex items-center gap-4 px-4 py-2.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60 border-b border-border/40">
      <div className="w-11 shrink-0" /> {/* thumbnail space */}
      <div className="flex-1 min-w-0">Tugas</div>
      <div className="hidden md:block w-28 shrink-0">Label</div>
      <div className="hidden sm:block w-24 shrink-0">Status</div>
      <div className="hidden sm:block w-16 shrink-0">Prioritas</div>
      <div className="hidden lg:block w-28 shrink-0 text-right">Dibuat</div>
      <div className="w-7 shrink-0" /> {/* action space */}
    </div>
  )
}

/* ─── Task Row ─── */
function TaskRow({ task, onTaskClick, onArchive, onDelete }: {
  task: Task
  onTaskClick?: (task: Task) => void
  onArchive?: (id: string) => void
  onDelete?: (id: string) => void
}) {
  return (
    <div
      className="group flex items-center gap-4 px-4 py-3 hover:bg-accent/40 cursor-pointer transition-all duration-150"
      onClick={() => onTaskClick?.(task)}
    >
      {/* Thumbnail */}
      <div className="w-11 shrink-0">
        {task.image_url ? (
          <img src={task.image_url} alt="" className="w-11 h-11 rounded-xl object-cover ring-1 ring-border/50" />
        ) : (
          <div className="w-11 h-11 rounded-xl bg-muted/60 flex items-center justify-center ring-1 ring-border/30">
            <Image className="w-4 h-4 text-muted-foreground/40" />
          </div>
        )}
      </div>

      {/* Title & Description */}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate">{task.title}</div>
        {task.description && (
          <div className="text-[11px] text-muted-foreground/60 truncate mt-0.5">{task.description}</div>
        )}
      </div>

      {/* Tags */}
      <div className="hidden md:flex items-center gap-1 w-28 shrink-0">
        {task.tags.length > 0 ? (
          <>
            {task.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className={`text-[10px] px-1.5 py-0 h-5 rounded-md ${getTagColor(tag)}`}>
                {tag}
              </Badge>
            ))}
            {task.tags.length > 2 && (
              <span className="text-[10px] text-muted-foreground">+{task.tags.length - 2}</span>
            )}
          </>
        ) : (
          <span className="text-[10px] text-muted-foreground/40">--</span>
        )}
      </div>

      {/* Status */}
      <div className="hidden sm:block w-24 shrink-0">
        <StatusBadge status={task.status} />
      </div>

      {/* Priority */}
      <div className="hidden sm:block w-16 shrink-0">
        <PriorityIcon priority={task.priority} />
      </div>

      {/* Date */}
      <div className="hidden lg:flex items-center gap-1 text-[11px] text-muted-foreground/50 w-28 shrink-0 justify-end">
        <Clock className="w-3 h-3" />
        <span>{formatDistanceToNow(new Date(task.created_at), { addSuffix: true, locale: idLocale })}</span>
      </div>

      {/* Actions */}
      <div className="w-7 shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onArchive?.(task.id) }} className="rounded-lg">
              <Archive className="mr-2 h-3.5 w-3.5" />
              Arsipkan
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => { e.stopPropagation(); onDelete?.(task.id) }}
              className="text-destructive rounded-lg"
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

/* ─── Skeleton ─── */
function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-4 py-3">
      <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-4 w-[180px]" />
        <Skeleton className="h-3 w-[240px]" />
      </div>
      <Skeleton className="hidden md:block h-5 w-20 rounded-md shrink-0" />
      <Skeleton className="hidden sm:block h-5 w-20 rounded-full shrink-0" />
      <Skeleton className="hidden sm:block h-5 w-12 rounded-full shrink-0" />
      <Skeleton className="hidden lg:block h-4 w-24 shrink-0" />
      <div className="w-7 shrink-0" />
    </div>
  )
}

/* ─── Main Component ─── */
export function ListView({ tasks, isLoading, onTaskClick, onArchive, onDelete }: ListViewProps) {
  if (isLoading) {
    return (
      <div className="border border-border/60 rounded-2xl overflow-hidden">
        <ListHeader />
        {[1, 2, 3, 4, 5].map((i) => <SkeletonRow key={i} />)}
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-3xl bg-muted/60 flex items-center justify-center mb-5 ring-1 ring-border/30">
          <Image className="w-7 h-7 text-muted-foreground/40" />
        </div>
        <h3 className="text-base font-semibold mb-1">Belum ada tugas</h3>
        <p className="text-sm text-muted-foreground/70 max-w-xs">
          Buat tugas pertamamu untuk memulai.
        </p>
      </div>
    )
  }

  return (
    <div className="border border-border/60 rounded-2xl overflow-hidden">
      <ListHeader />
      <div className="divide-y divide-border/30">
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
    </div>
  )
}
