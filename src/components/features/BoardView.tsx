import type { Task, TaskStatus } from '@/types/task'
import { TaskCard } from './TaskCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
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
  todo: { title: 'To Do', count: 0 },
  in_progress: { title: 'In Progress', count: 0 },
  code_review: { title: 'Code Review', count: 0 },
  done: { title: 'Done', count: 0 },
}

function createEmptyColumns<T>(): Record<TaskStatus, T[]> {
  return {
    todo: [],
    in_progress: [],
    code_review: [],
    done: [],
  }
}

function SortableTaskCard({ task, onClick }: { task: Task; onClick?: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`touch-none ${isDragging ? 'opacity-50' : ''}`}
    >
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
      className={`space-y-3 min-h-[100px] rounded-lg transition-colors ${
        isOver ? 'bg-primary/5 ring-2 ring-primary/20' : ''
      }`}
    >
      {children}
    </div>
  )
}

export function BoardView({ tasks, isLoading, onTaskClick, onDropTask }: BoardViewProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  // Only stores manual reorder overrides per column, not full state
  const [localReorder, setLocalReorder] = useState<Record<string, string[]>>({})

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const tasksByColumn = useMemo(() => {
    const grouped = createEmptyColumns<Task>()

    // First, group all tasks by their status
    tasks.forEach((task) => {
      grouped[task.status].push(task)
    })

    // Then apply any local reorder overrides
    COLUMNS.forEach((column) => {
      const reorderIds = localReorder[column]
      if (reorderIds) {
        const taskMap = new Map(grouped[column].map((t) => [t.id, t]))
        const reordered: Task[] = []
        const seen = new Set<string>()

        // Place tasks in the reorder order
        reorderIds.forEach((id) => {
          const task = taskMap.get(id)
          if (task) {
            reordered.push(task)
            seen.add(id)
          }
        })

        // Append any new tasks not in the reorder list
        grouped[column].forEach((task) => {
          if (!seen.has(task.id)) {
            reordered.push(task)
          }
        })

        grouped[column] = reordered
      }
    })

    return grouped
  }, [tasks, localReorder])

  const handleDragStart = (event: DragStartEvent) => {
    const activeId = String(event.active.id)
    const draggedTask = tasks.find((t) => t.id === activeId) ?? null
    setActiveTask(draggedTask)
  }

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const activeId = String(active.id)
    const overId = String(over.id)

    // Find the task being dragged
    const draggedTask = tasks.find((t) => t.id === activeId)
    if (!draggedTask) return

    // If dropped on same task, do nothing
    if (activeId === overId) return

    // If dropped on another task in the same column, reorder within column
    const droppedOnTask = tasks.find((t) => t.id === overId)
    if (droppedOnTask && droppedOnTask.status === draggedTask.status) {
      const column = draggedTask.status
      const currentColumnIds = tasksByColumn[column].map((task) => task.id)
      const oldIndex = currentColumnIds.indexOf(activeId)
      const newIndex = currentColumnIds.indexOf(overId)

      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
        return
      }

      const reorderedIds = arrayMove(currentColumnIds, oldIndex, newIndex)
      setLocalReorder((prev) => ({
        ...prev,
        [column]: reorderedIds,
      }))
      return
    }

    // Determine new status based on the column it was dropped into
    let newStatus: TaskStatus | null = null

    if (isTaskStatus(overId)) {
      newStatus = overId
    } else if (droppedOnTask) {
      newStatus = droppedOnTask.status
    }

    // Only update if status changed
    if (newStatus && newStatus !== draggedTask.status) {
      const targetStatus = newStatus
      // Clear reorder for the old column since task is moving out
      setLocalReorder((prev) => {
        const updated = { ...prev }
        delete updated[draggedTask.status]
        delete updated[targetStatus]
        return updated
      })
      onDropTask?.(draggedTask.id, newStatus)
    }
  }, [tasks, tasksByColumn, onDropTask])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map((column) => (
          <Card key={column} className="h-[500px]">
            <CardHeader className="pb-4">
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 rounded-lg" />
              ))}
            </CardContent>
          </Card>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map((column) => {
          const columnTasks = tasksByColumn[column]
          return (
            <Card key={column} className="h-full min-h-[500px]">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {COLUMN_CONFIG[column].title}
                  </CardTitle>
                  <span className="text-sm font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                    {columnTasks.length}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <DroppableColumn id={column}>
                  <SortableContext items={columnTasks.map((t) => t.id)}>
                    {columnTasks.map((task) => (
                      <SortableTaskCard
                        key={task.id}
                        task={task}
                        onClick={() => onTaskClick?.(task)}
                      />
                    ))}
                  </SortableContext>
                  {columnTasks.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No tasks
                    </div>
                  )}
                </DroppableColumn>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <DragOverlay>
        {activeTask && (
          <div className="rotate-3 opacity-90">
            <TaskCard task={activeTask} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
