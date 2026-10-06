export interface Task {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly completed: boolean
  /** Milliseconds since the Unix epoch. */
  readonly createdAt: number
}

/** Raw user input from the add and edit forms, before trimming and validation. */
export interface TaskDraft {
  title: string
  description: string
}

export type TaskFilter = 'all' | 'active' | 'completed'
