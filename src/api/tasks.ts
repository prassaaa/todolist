import { supabase } from "@/lib/supabase"
import type { Task, CreateTaskInput, UpdateTaskInput, TaskStatus, TaskPriority } from "@/types/task"

// Get all tasks (non-archived by default)
export async function fetchTasks(filters?: {
  status?: TaskStatus
  priority?: TaskPriority
  tags?: string[]
  archived?: boolean
}): Promise<Task[]> {
  let query = supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })

  // Filter by archived status (default to non-archived)
  const isArchived = filters?.archived ?? false
  query = query.eq('is_archived', isArchived)

  // Filter by status
  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  // Filter by priority
  if (filters?.priority) {
    query = query.eq('priority', filters.priority)
  }

  // Filter by tags (if any tag matches)
  if (filters?.tags && filters.tags.length > 0) {
    query = query.contains('tags', filters.tags)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching tasks:', error)
    throw new Error(error.message)
  }

  return (data || []) as Task[]
}

// Get a single task by ID
export async function fetchTaskById(id: string): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching task:', error)
    throw new Error(error.message)
  }

  return data as Task
}

// Create a new task
export async function createTask(input: CreateTaskInput): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      title: input.title,
      description: input.description || '',
      status: input.status || 'todo',
      priority: input.priority || 'medium',
      tags: input.tags || [],
      image_url: input.image_url,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating task:', error)
    throw new Error(error.message)
  }

  return data as Task
}

// Update an existing task
export async function updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
  const updateData: UpdateTaskInput = {}

  if (input.title !== undefined) updateData.title = input.title
  if (input.description !== undefined) updateData.description = input.description
  if (input.status !== undefined) updateData.status = input.status
  if (input.priority !== undefined) updateData.priority = input.priority
  if (input.tags !== undefined) updateData.tags = input.tags
  if (input.is_archived !== undefined) updateData.is_archived = input.is_archived
  if (input.image_url !== undefined) updateData.image_url = input.image_url

  const { data, error } = await supabase
    .from('tasks')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating task:', error)
    throw new Error(error.message)
  }

  return data as Task
}

// Delete a task
export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting task:', error)
    throw new Error(error.message)
  }
}

// Archive a task (soft delete)
export async function archiveTask(id: string): Promise<Task> {
  return updateTask(id, { is_archived: true })
}

// Unarchive a task
export async function unarchiveTask(id: string): Promise<Task> {
  return updateTask(id, { is_archived: false })
}

// Get task statistics
export async function getTaskStats(): Promise<{
  total: number
  todo: number
  inProgress: number
  codeReview: number
  done: number
  archived: number
}> {
  const [totalResult, todoResult, inProgressResult, codeReviewResult, doneResult, archivedResult] =
    await Promise.all([
      supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('is_archived', false),
      supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('status', 'todo').eq('is_archived', false),
      supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('status', 'in_progress').eq('is_archived', false),
      supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('status', 'code_review').eq('is_archived', false),
      supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('status', 'done').eq('is_archived', false),
      supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('is_archived', true),
    ])

  return {
    total: totalResult.count || 0,
    todo: todoResult.count || 0,
    inProgress: inProgressResult.count || 0,
    codeReview: codeReviewResult.count || 0,
    done: doneResult.count || 0,
    archived: archivedResult.count || 0,
  }
}
