import type { Task, TaskStatus } from '@/types/task'
import { TaskCard } from './TaskCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Circle, Clock, Code2, CheckCircle2 } from 'lucide-react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useCallback, useMemo, useState } from 'react'

interface BoardViewProps {
  tasks: Task[]
  isLoading?: boolean
  onTaskClick?: (task: Task) => void
  onDropTask?: (taskId: string, newStatus: TaskStatus) => void
}

const COLUMNS: TaskStatus[] = ['todo', 'in_progress', 'code_review', 'done']

const COLUMN_CONFIG = {
  todo: { title: 'To Do', icon: Circle, color: 'text-slate-500' },
  in_progress: { title: 'In Progress', icon: Clock, color: 'text-blue-500' },
  code_review: { title: 'Review', icon: Code2, color: 'text-amber-500' },
  done: { title: 'Done', icon: CheckCircle2, color: 'text-emerald-500' },
}

function createEmptyColumns<T>(): Record<TaskStatus, T[]> {
  return { todo: [], in_progress: [], code_review: [], done: [] }
}

function SortableTaskCard({ task, onClick }: { task: Task; onClick?: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    transition: { duration: 250, easing: 'cubic-bezier(0.25, 1, 0.5, 1)' },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none">
      <TaskCard task={task} onClick={onClick} />
    </div>
  )
}

function isTaskStatus(value: string): value is TaskStatus {
  return COLUMNS.includes(value as TaskStatus)
}

function DroppableColumn({ id, children }: { id: TaskStatus; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id })
  return (
    <div
      ref={setNodeRef}
      className={`space-y-2.5 min-h-[120px] rounded-lg p-0.5 transition-colors ${
        isOver ? 'bg-primary/5 ring-1 ring-primary/20' : ''
      }`}
    >
      {children}
    </div>
  )
}

export function BoardView({ tasks, isLoading, onTaskClick, onDropTask }: BoardViewProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [optimisticMoves, setOptimisticMoves] = useState<Record<string, TaskStatus>>({})
  const [localReorder, setLocalReorder] = useState<Record<string, string[]>>({})

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const cleanOptimisticMoves = useMemo(() => {
    if (Object.keys(optimisticMoves).length === 0) return optimisticMoves
    const serverMap = new Map(tasks.map((t) => [t.id, t.status]))
    const stillPending: Record<string, TaskStatus> = {}
    for (const [id, targetStatus] of Object.entries(optimisticMoves)) {
      if (serverMap.get(id) !== targetStatus) stillPending[id] = targetStatus
    }
    return stillPending
  }, [tasks, optimisticMoves])

  const effectiveTasks = useMemo(() => {
    if (Object.keys(cleanOptimisticMoves).length === 0) return tasks
    return tasks.map((task) => {
      const override = cleanOptimisticMoves[task.id]
      return override && override !== task.status ? { ...task, status: override } : task
    })
  }, [tasks, cleanOptimisticMoves])

  const tasksByColumn = useMemo(() => {
    const grouped = createEmptyColumns<Task>()
    effectiveTasks.forEach((task) => grouped[task.status].push(task))

    COLUMNS.forEach((column) => {
      const reorderIds = localReorder[column]
      if (reorderIds) {
        const taskMap = new Map(grouped[column].map((t) => [t.id, t]))
        const reordered: Task[] = []
        const seen = new Set<string>()
        reorderIds.forEach((id) => {
          const task = taskMap.get(id)
          if (task) { reordered.push(task); seen.add(id) }
        })
        grouped[column].forEach((task) => { if (!seen.has(task.id)) reordered.push(task) })
        grouped[column] = reordered
      }
    })
    return grouped
  }, [effectiveTasks, localReorder])

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTask(effectiveTasks.find((t) => t.id === String(event.active.id)) ?? null)
  }

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over) { setActiveTask(null); return }

    const activeId = String(active.id)
    const overId = String(over.id)
    const draggedTask = effectiveTasks.find((t) => t.id === activeId)
    if (!draggedTask || activeId === overId) { setActiveTask(null); return }

    const droppedOnTask = effectiveTasks.find((t) => t.id === overId)
    if (droppedOnTask && droppedOnTask.status === draggedTask.status) {
      const column = draggedTask.status
      const currentColumnIds = tasksByColumn[column].map((t) => t.id)
      const oldIndex = currentColumnIds.indexOf(activeId)
      const newIndex = currentColumnIds.indexOf(overId)
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        setLocalReorder((prev) => ({ ...prev, [column]: arrayMove(currentColumnIds, oldIndex, newIndex) }))
      }
      setActiveTask(null)
      return
    }

    let newStatus: TaskStatus | null = null
    if (isTaskStatus(overId)) newStatus = overId
    else if (droppedOnTask) newStatus = droppedOnTask.status

    if (newStatus && newStatus !== draggedTask.status) {
      const targetStatus = newStatus
      setOptimisticMoves((prev) => ({ ...prev, [draggedTask.id]: targetStatus }))
      setLocalReorder((prev) => {
        const updated = { ...prev }
        delete updated[draggedTask.status]
        delete updated[targetStatus]
        return updated
      })
      onDropTask?.(draggedTask.id, targetStatus)
    }
    setActiveTask(null)
  }, [effectiveTasks, tasksByColumn, onDropTask])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map((column) => (
          <div key={column} className="space-y-3">
            <Skeleton className="h-5 w-24" />
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-36 rounded-xl" />
            ))}
          </div>
        ))}
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {COLUMNS.map((column) => {
          const config = COLUMN_CONFIG[column]
          const Icon = config.icon
          const columnTasks = tasksByColumn[column]

          return (
            <div key={column} className="space-y-3">
              {/* Column Header */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${config.color}`} />
                  <span className="text-sm font-medium">{config.title}</span>
                </div>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full tabular-nums">
                  {columnTasks.length}
                </span>
              </div>

              {/* Column Content */}
              <DroppableColumn id={column}>
                <SortableContext items={columnTasks.map((t) => t.id)}>
                  {columnTasks.map((task) => (
                    <SortableTaskCard key={task.id} task={task} onClick={() => onTaskClick?.(task)} />
                  ))}
                </SortableContext>
                {columnTasks.length === 0 && (
                  <div className="text-center py-10 text-xs text-muted-foreground border border-dashed rounded-xl">
                    No tasks
                  </div>
                )}
              </DroppableColumn>
            </div>
          )
        })}
      </div>

      <DragOverlay dropAnimation={{ duration: 250, easing: 'cubic-bezier(0.25, 1, 0.5, 1)' }}>
        {activeTask && (
          <div className="rotate-2 scale-105 shadow-xl opacity-95">
            <TaskCard task={activeTask} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
