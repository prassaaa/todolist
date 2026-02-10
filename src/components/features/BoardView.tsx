import { Task, TaskStatus } from '@/types/task'
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
  DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, arrayMove, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useMemo } from 'react'

interface BoardViewProps {
  tasks: Task[]
  isLoading?: boolean
  onTaskClick?: (task: Task) => void
}

const COLUMNS: TaskStatus[] = ['todo', 'in_progress', 'code_review', 'done']

const COLUMN_CONFIG = {
  todo: { title: 'To Do', count: 0 },
  in_progress: { title: 'In Progress', count: 0 },
  code_review: { title: 'Code Review', count: 0 },
  done: { title: 'Done', count: 0 },
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

export function BoardView({ tasks, isLoading, onTaskClick }: BoardViewProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: (event, { context }) => {
        const {
          current: { draggableNodeIds },
        } = context
        const key = (event as KeyboardEvent).key
        const options = {
          event,
          context,
          activeId: null,
          overId: null,
        }

        if (key === 'ArrowDown' || key === 'ArrowRight') {
          const activeId = draggableNodeIds?.[0]
          options.activeId = activeId
          options.overId = draggableNodeIds?.[draggableNodeIds.indexOf(activeId!) + 1]
        } else if (key === 'ArrowUp' || key === 'ArrowLeft') {
          const activeId = draggableNodeIds?.[0]
          options.activeId = activeId
          options.overId = draggableNodeIds?.[draggableNodeIds.indexOf(activeId!) - 1]
        }

        return closestCorners(options)
      },
    })
  )

  const tasksByColumn = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      todo: [],
      in_progress: [],
      code_review: [],
      done: [],
    }
    tasks.forEach((task) => {
      grouped[task.status].push(task)
    })
    return grouped
  }, [tasks])

  const [activeTask, setActiveTask] = useMemo(() => [null, null] as [Task | null, any], [])

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over || active.id === over.id) return

    // Find the task being dragged
    const draggedTask = tasks.find((t) => t.id === active.id)
    if (!draggedTask) return

    // Update the task status
    // Note: In a real app, you'd call the update mutation here
    // For now, this is just a UI demonstration
  }

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
              <CardContent className="space-y-3">
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
