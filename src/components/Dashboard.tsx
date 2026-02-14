import { useState } from 'react'
import type { Task, TaskStatus, TaskPriority, ViewMode, CreateTaskInput } from '@/types/task'
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask, useArchiveTask, useTaskStats } from '@/hooks/useTasks'
import { TaskForm } from './features/TaskForm'
import type { TaskFormValues } from './features/TaskForm'
import { BoardView } from './features/BoardView'
import { ListView } from './features/ListView'
import { QuickAdd } from './features/QuickAdd'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LayoutGrid, List, Plus, Circle, Clock, Code2, CheckCircle2, Archive } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export function Dashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>('board')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all')
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'all'>('all')
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const { data: tasks = [], isLoading } = useTasks({
    archived: false,
    ...(filterStatus !== 'all' && { status: filterStatus }),
    ...(filterPriority !== 'all' && { priority: filterPriority }),
  })

  const { data: stats } = useTaskStats()

  const createMutation = useCreateTask()
  const updateMutation = useUpdateTask()
  const deleteMutation = useDeleteTask()
  const archiveMutation = useArchiveTask()

  const handleCreateTask = (values: TaskFormValues) => {
    createMutation.mutate(values)
    setIsFormOpen(false)
  }

  const handleUpdateTask = (values: TaskFormValues) => {
    if (!editingTask) return
    updateMutation.mutate({ id: editingTask.id, input: values })
    setEditingTask(null)
    setIsFormOpen(false)
  }

  const handleDeleteTask = (id: string) => {
    setDeleteConfirmId(id)
  }

  const confirmDelete = () => {
    if (deleteConfirmId) {
      deleteMutation.mutate(deleteConfirmId)
      setDeleteConfirmId(null)
    }
  }

  const handleArchiveTask = (id: string) => {
    archiveMutation.mutate(id)
  }

  const handleTaskClick = (task: Task) => {
    setEditingTask(task)
    setIsFormOpen(true)
  }

  const handleQuickAdd = (values: CreateTaskInput) => {
    createMutation.mutate(values)
  }

  const handleDropTask = (taskId: string, newStatus: TaskStatus) => {
    updateMutation.mutate({ id: taskId, input: { status: newStatus } })
  }

  const statItems = [
    { key: 'todo', label: 'To Do', value: stats?.todo ?? 0, icon: Circle, color: 'text-slate-500' },
    { key: 'inProgress', label: 'In Progress', value: stats?.inProgress ?? 0, icon: Clock, color: 'text-blue-500' },
    { key: 'codeReview', label: 'Review', value: stats?.codeReview ?? 0, icon: Code2, color: 'text-amber-500' },
    { key: 'done', label: 'Done', value: stats?.done ?? 0, icon: CheckCircle2, color: 'text-emerald-500' },
    { key: 'archived', label: 'Archived', value: stats?.archived ?? 0, icon: Archive, color: 'text-rose-400' },
  ]

  return (
    <div className="space-y-6">
      {/* Compact Stats Row */}
      <div className="flex items-center gap-6 overflow-x-auto pb-1">
        {stats ? (
          statItems.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.key} className="flex items-center gap-2 shrink-0">
                <Icon className={`w-4 h-4 ${item.color}`} />
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className="text-sm font-semibold tabular-nums">{item.value}</span>
              </div>
            )
          })
        ) : (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-4 w-5" />
            </div>
          ))
        )}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex-1 w-full sm:w-auto">
          <QuickAdd onAdd={handleQuickAdd} isLoading={createMutation.isPending} />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Select
            value={filterStatus}
            onValueChange={(v) => setFilterStatus(v as TaskStatus | 'all')}
          >
            <SelectTrigger className="w-[130px] h-9 text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="code_review">Code Review</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filterPriority}
            onValueChange={(v) => setFilterPriority(v as TaskPriority | 'all')}
          >
            <SelectTrigger className="w-[130px] h-9 text-xs">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-colors ${
                viewMode === 'list'
                  ? 'bg-accent text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('board')}
              className={`p-2 transition-colors ${
                viewMode === 'board'
                  ? 'bg-accent text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>

          <Button
            size="sm"
            onClick={() => { setEditingTask(null); setIsFormOpen(true) }}
            className="h-9"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            New Task
          </Button>
        </div>
      </div>

      {/* Task View */}
      {viewMode === 'list' ? (
        <ListView
          tasks={tasks}
          isLoading={isLoading}
          onTaskClick={handleTaskClick}
          onArchive={handleArchiveTask}
          onDelete={handleDeleteTask}
        />
      ) : (
        <BoardView
          tasks={tasks}
          isLoading={isLoading}
          onTaskClick={handleTaskClick}
          onDropTask={handleDropTask}
        />
      )}

      {/* Task Form Dialog */}
      <TaskForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        initialValues={editingTask || undefined}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" onClick={confirmDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
