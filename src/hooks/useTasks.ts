import { useQuery, useMutation, useQueryClient, type UseQueryResult } from '@tanstack/react-query"
import * as api from '@/api/tasks"
import { CreateTaskInput, UpdateTaskInput, TaskStatus, TaskPriority } from '@/types/task"
import { toast } from 'sonner'

// Query keys
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters: any) => [...taskKeys.lists(), filters] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
  stats: () => [...taskKeys.all, 'stats'] as const,
}

// Hook to fetch all tasks
export function useTasks(filters?: {
  status?: TaskStatus
  priority?: TaskPriority
  tags?: string[]
  archived?: boolean
}) {
  return useQuery({
    queryKey: taskKeys.list(filters),
    queryFn: () => api.fetchTasks(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

// Hook to fetch a single task
export function useTask(id: string) {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => api.fetchTaskById(id),
    enabled: !!id,
  })
}

// Hook to get task statistics
export function useTaskStats() {
  return useQuery({
    queryKey: taskKeys.stats(),
    queryFn: api.getTaskStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Hook to create a new task
export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateTaskInput) => api.createTask(input),
    onSuccess: (newTask) => {
      // Invalidate the tasks list query
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: taskKeys.stats() })
      toast.success('Task created successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to create task: ${error.message}`)
    },
  })
}

// Hook to update a task
export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTaskInput }) =>
      api.updateTask(id, input),
    onSuccess: (updatedTask) => {
      // Invalidate the tasks list query
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
      // Invalidate the specific task detail query
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(updatedTask.id) })
      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: taskKeys.stats() })
      toast.success('Task updated successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to update task: ${error.message}`)
    },
  })
}

// Hook to delete a task
export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.deleteTask(id),
    onSuccess: () => {
      // Invalidate the tasks list query
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: taskKeys.stats() })
      toast.success('Task deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete task: ${error.message}`)
    },
  })
}

// Hook to archive a task
export function useArchiveTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.archiveTask(id),
    onSuccess: () => {
      // Invalidate the tasks list query
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: taskKeys.stats() })
      toast.success('Task archived successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to archive task: ${error.message}`)
    },
  })
}

// Hook to unarchive a task
export function useUnarchiveTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.unarchiveTask(id),
    onSuccess: () => {
      // Invalidate the tasks list query
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: taskKeys.stats() })
      toast.success('Task unarchived successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to unarchive task: ${error.message}`)
    },
  })
}
