import { useState } from 'react'
import type { Task, TaskStatus, TaskPriority, ViewMode } from '@/types/task'
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask, useArchiveTask, useTaskStats } from '@/hooks/useTasks'
import { TaskForm } from './features/TaskForm'
import type { TaskFormValues } from './features/TaskForm'
import { BoardView } from './features/BoardView'
import { ListView } from './features/ListView'
import { QuickAdd } from './features/QuickAdd'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { LayoutGrid, List, Plus, ListChecks, Circle, Clock, Code2, CheckCircle2, Archive, TrendingUp } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export function Dashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all')
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'all'>('all')
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  // Fetch tasks
  const { data: tasks = [], isLoading } = useTasks({
    archived: false,
    ...(filterStatus !== 'all' && { status: filterStatus }),
    ...(filterPriority !== 'all' && { priority: filterPriority }),
  })

  // Fetch stats
  const { data: stats } = useTaskStats()

  // Mutations
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
    updateMutation.mutate({
      id: editingTask.id,
      input: values,
    })
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

  const handleQuickAdd = (values: TaskFormValues) => {
    createMutation.mutate(values)
  }

  const handleDropTask = (taskId: string, newStatus: TaskStatus) => {
    updateMutation.mutate({
      id: taskId,
      input: { status: newStatus },
    })
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats ? (
          <>
            {[
              {
                label: 'Total',
                value: stats.total,
                icon: ListChecks,
                iconBg: 'bg-gradient-to-br from-violet-500 to-purple-600',
                accentBorder: 'border-l-violet-500',
                textColor: 'text-violet-600 dark:text-violet-400',
              },
              {
                label: 'To Do',
                value: stats.todo,
                icon: Circle,
                iconBg: 'bg-gradient-to-br from-slate-400 to-slate-500',
                accentBorder: 'border-l-slate-400',
                textColor: 'text-slate-600 dark:text-slate-400',
              },
              {
                label: 'In Progress',
                value: stats.inProgress,
                icon: Clock,
                iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
                accentBorder: 'border-l-blue-500',
                textColor: 'text-blue-600 dark:text-blue-400',
              },
              {
                label: 'Code Review',
                value: stats.codeReview,
                icon: Code2,
                iconBg: 'bg-gradient-to-br from-amber-500 to-orange-500',
                accentBorder: 'border-l-amber-500',
                textColor: 'text-amber-600 dark:text-amber-400',
              },
              {
                label: 'Done',
                value: stats.done,
                icon: CheckCircle2,
                iconBg: 'bg-gradient-to-br from-emerald-500 to-green-600',
                accentBorder: 'border-l-emerald-500',
                textColor: 'text-emerald-600 dark:text-emerald-400',
              },
              {
                label: 'Archived',
                value: stats.archived,
                icon: Archive,
                iconBg: 'bg-gradient-to-br from-rose-400 to-pink-500',
                accentBorder: 'border-l-rose-400',
                textColor: 'text-rose-500 dark:text-rose-400',
              },
            ].map((item) => {
              const Icon = item.icon
              const percentage = stats.total > 0 ? Math.round((item.value / stats.total) * 100) : 0
              return (
                <Card
                  key={item.label}
                  className={`relative overflow-hidden border-l-4 ${item.accentBorder} hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group`}
                >
                  <CardHeader className="pb-1 pt-4 px-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {item.label}
                      </CardTitle>
                      <div className={`${item.iconBg} p-1.5 rounded-lg shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-0">
                    <div className="flex items-end gap-2">
                      <span className={`text-3xl font-extrabold tracking-tight ${item.textColor}`}>
                        {item.value}
                      </span>
                      {item.label !== 'Total' && stats.total > 0 && (
                        <span className="text-xs font-medium text-muted-foreground mb-1.5">
                          {percentage}%
                        </span>
                      )}
                    </div>
                    {/* Mini progress bar */}
                    {item.label !== 'Total' && (
                      <div className="mt-2.5 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full ${item.iconBg} transition-all duration-700 ease-out`}
                          style={{ width: `${stats.total > 0 ? Math.max((item.value / stats.total) * 100, item.value > 0 ? 4 : 0) : 0}%` }}
                        />
                      </div>
                    )}
                    {/* Total card shows a summary line instead */}
                    {item.label === 'Total' && (
                      <div className="mt-2.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <TrendingUp className="w-3 h-3" />
                        <span>{stats.done} completed</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </>
        ) : (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border-l-4 border-l-muted">
              <CardHeader className="pb-1 pt-4 px-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-7 w-7 rounded-lg" />
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <Skeleton className="h-9 w-14 mt-1" />
                <Skeleton className="h-1.5 w-full rounded-full mt-3" />
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Quick Add & Filters */}
      <div className="flex flex-col gap-4">
        <QuickAdd onAdd={handleQuickAdd} isLoading={createMutation.isPending} />

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as TaskStatus | 'all')}
              className="px-3 py-1.5 text-sm border rounded-md bg-background"
            >
              <option value="all">All Statuses</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="code_review">Code Review</option>
              <option value="done">Done</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as TaskPriority | 'all')}
              className="px-3 py-1.5 text-sm border rounded-md bg-background"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          {/* View Toggle & Create Button */}
          <div className="flex gap-2">
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
                className="rounded-none rounded-l-md"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'board' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('board')}
                className="rounded-none rounded-r-md"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>

            <Button onClick={() => {
              setEditingTask(null)
              setIsFormOpen(true)
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </Button>
          </div>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
