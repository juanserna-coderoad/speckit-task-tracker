import type { Task } from './types'

export type StorageLike = Pick<Storage, 'getItem' | 'setItem'>

export const STORAGE_KEY = 'task-tracker.tasks.v1'

/** The browser's localStorage, or null when it is unreachable (some privacy modes throw on access). */
function getBrowserStorage(): StorageLike | null {
  try {
    return globalThis.localStorage ?? null
  } catch {
    return null
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isTask(value: unknown): value is Task {
  if (!isRecord(value)) return false
  return (
    typeof value.id === 'string' &&
    value.id !== '' &&
    typeof value.title === 'string' &&
    value.title.trim() !== '' &&
    typeof value.description === 'string' &&
    typeof value.completed === 'boolean' &&
    typeof value.createdAt === 'number' &&
    Number.isFinite(value.createdAt)
  )
}

/** Reads saved tasks. Never throws: bad or missing data yields an empty list or skips bad entries. */
export function loadTasks(storage: StorageLike | null = getBrowserStorage()): Task[] {
  if (!storage) return []

  let parsed: unknown
  try {
    const raw = storage.getItem(STORAGE_KEY)
    if (raw === null) return []
    parsed = JSON.parse(raw)
  } catch {
    return []
  }
  if (!Array.isArray(parsed)) return []

  const entries: unknown[] = parsed
  const seenIds = new Set<string>()
  const tasks: Task[] = []
  for (const entry of entries) {
    if (isTask(entry) && !seenIds.has(entry.id)) {
      seenIds.add(entry.id)
      tasks.push(entry)
    }
  }
  return tasks
}

/** Saves the full list. Returns false (and never throws) if storage is unavailable or full. */
export function saveTasks(
  tasks: readonly Task[],
  storage: StorageLike | null = getBrowserStorage(),
): boolean {
  if (!storage) return false
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    return true
  } catch {
    return false
  }
}
