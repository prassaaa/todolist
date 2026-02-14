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
import { LayoutGrid, List, Plus, Circle, Clock, Code2, CheckCircle2, Archive, AlertTriangle } from 'lucide-react'
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

  const handleDeleteTask = (id: string) => setDeleteConfirmId(id)

  const confirmDelete = () => {
    if (deleteConfirmId) {
      deleteMutation.mutate(deleteConfirmId)
      setDeleteConfirmId(null)
    }
  }

  const handleArchiveTask = (id: string) => archiveMutation.mutate(id)

  const handleTaskClick = (task: Task) => {
    setEditingTask(task)
    setIsFormOpen(true)
  }

  const handleQuickAdd = (values: CreateTaskInput) => createMutation.mutate(values)

  const handleDropTask = (taskId: string, newStatus: TaskStatus) => {
    updateMutation.mutate({ id: taskId, input: { status: newStatus } })
  }

  const statItems = [
    { key: 'todo', label: 'To Do', value: stats?.todo ?? 0, icon: Circle, bg: 'bg-slate-100 dark:bg-slate-800/60', color: 'text-slate-500', ring: 'ring-slate-200 dark:ring-slate-700' },
    { key: 'inProgress', label: 'In Progress', value: stats?.inProgress ?? 0, icon: Clock, bg: 'bg-blue-50 dark:bg-blue-950/40', color: 'text-blue-500', ring: 'ring-blue-100 dark:ring-blue-900' },
    { key: 'codeReview', label: 'Review', value: stats?.codeReview ?? 0, icon: Code2, bg: 'bg-amber-50 dark:bg-amber-950/40', color: 'text-amber-500', ring: 'ring-amber-100 dark:ring-amber-900' },
    { key: 'done', label: 'Done', value: stats?.done ?? 0, icon: CheckCircle2, bg: 'bg-emerald-50 dark:bg-emerald-950/40', color: 'text-emerald-500', ring: 'ring-emerald-100 dark:ring-emerald-900' },
    { key: 'archived', label: 'Archived', value: stats?.archived ?? 0, icon: Archive, bg: 'bg-rose-50 dark:bg-rose-950/40', color: 'text-rose-400', ring: 'ring-rose-100 dark:ring-rose-900' },
  ]

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {stats ? (
          statItems.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.key}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl ${item.bg} ring-1 ${item.ring}`}
              >
                <Icon className={`w-4 h-4 ${item.color} shrink-0`} />
                <div className="min-w-0">
                  <div className="text-[11px] text-muted-foreground truncate">{item.label}</div>
                  <div className="text-lg font-bold tabular-nums leading-tight">{item.value}</div>
                </div>
              </div>
            )
          })
        ) : (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-muted/50 ring-1 ring-border/50">
              <Skeleton className="h-4 w-4 rounded-full shrink-0" />
              <div>
                <Skeleton className="h-3 w-12 mb-1" />
                <Skeleton className="h-5 w-6" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex-1 w-full sm:max-w-sm">
          <QuickAdd onAdd={handleQuickAdd} isLoading={createMutation.isPending} />
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as TaskStatus | 'all')}>
            <SelectTrigger className="w-[130px] h-9 text-xs rounded-xl">
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

          <Select value={filterPriority} onValueChange={(v) => setFilterPriority(v as TaskPriority | 'all')}>
            <SelectTrigger className="w-[130px] h-9 text-xs rounded-xl">
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

          {/* View Toggle */}
          <div className="flex bg-muted rounded-xl p-0.5">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('board')}
              className={`p-1.5 rounded-lg transition-all duration-200 ${
                viewMode === 'board'
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>

          <Button
            size="sm"
            onClick={() => { setEditingTask(null); setIsFormOpen(true) }}
            className="h-9 rounded-xl bg-linear-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 shadow-md shadow-violet-500/20 text-white border-0"
          >
            <Plus className="h-4 w-4 mr-1" />
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
        <DialogContent className="sm:max-w-[380px]">
          <DialogHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <DialogTitle className="text-center">Delete Task</DialogTitle>
            <DialogDescription className="text-center">
              This action cannot be undone. The task will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-2 sm:justify-center">
            <Button variant="outline" size="sm" className="flex-1 rounded-xl" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" className="flex-1 rounded-xl" onClick={confirmDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
