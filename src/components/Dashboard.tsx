import { useState } from 'react'
import { Task, TaskStatus, TaskPriority, ViewMode } from '@/types/task'
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask, useArchiveTask, useTaskStats } from '@/hooks/useTasks'
import { TaskForm, TaskFormValues } from './features/TaskForm'
import { BoardView } from './features/BoardView'
import { ListView } from './features/ListView'
import { QuickAdd } from './features/QuickAdd'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LayoutGrid, List, Filter, Plus } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export function Dashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all')
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'all'>('all')

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
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteMutation.mutate(id)
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

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats ? (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  To Do
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.todo}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  In Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.inProgress}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Code Review
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.codeReview}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Done
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.done}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Archived
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.archived}</div>
              </CardContent>
            </Card>
          </>
        ) : (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-12" />
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
    </div>
  )
}
