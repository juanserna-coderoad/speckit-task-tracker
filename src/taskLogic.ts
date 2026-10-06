import type { Task, TaskDraft, TaskFilter } from './types'

export const TITLE_REQUIRED_MESSAGE = 'Please enter a title for the task.'

/** Returns an error message, or null if the title is acceptable. */
export function validateTitle(title: string): string | null {
  return title.trim() === '' ? TITLE_REQUIRED_MESSAGE : null
}

/** Adds a new task at the start of the list. Returns the list unchanged if the title is invalid. */
export function addTask(
  tasks: readonly Task[],
  draft: TaskDraft,
  id: string,
  createdAt: number,
): Task[] {
  if (validateTitle(draft.title) !== null) return [...tasks]

  const task: Task = {
    id,
    title: draft.title.trim(),
    description: draft.description.trim(),
    completed: false,
    createdAt,
  }
  return [task, ...tasks]
}

/** Flips the completed state of one task. Returns the list unchanged if the id is unknown. */
export function toggleTask(tasks: readonly Task[], id: string): Task[] {
  return tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
}

/** Returns the tasks that match the filter, in their existing order. */
export function filterTasks(tasks: readonly Task[], filter: TaskFilter): Task[] {
  switch (filter) {
    case 'active':
      return tasks.filter((task) => !task.completed)
    case 'completed':
      return tasks.filter((task) => task.completed)
    case 'all':
      return [...tasks]
  }
}

/**
 * Replaces the title and description of one task. Returns the list unchanged if the id is unknown
 * or the title is invalid. Everything else about the task, including its position, is kept.
 */
export function updateTask(tasks: readonly Task[], id: string, draft: TaskDraft): Task[] {
  if (validateTitle(draft.title) !== null) return [...tasks]

  return tasks.map((task) =>
    task.id === id
      ? { ...task, title: draft.title.trim(), description: draft.description.trim() }
      : task,
  )
}

/** Removes one task. Returns the list unchanged if the id is unknown. */
export function deleteTask(tasks: readonly Task[], id: string): Task[] {
  return tasks.filter((task) => task.id !== id)
}
