import type { Task, TaskDraft, TaskFilter } from '../types'
import { EmptyState } from './EmptyState'
import { TaskItem } from './TaskItem'

interface TaskListProps {
  /** Tasks that match the current filter. */
  tasks: Task[]
  /** Number of tasks before filtering; tells "no tasks yet" apart from "nothing matches". */
  totalCount: number
  filter: TaskFilter
  editingId: string | null
  onToggle: (id: string) => void
  onStartEdit: (id: string) => void
  onSave: (id: string, draft: TaskDraft) => void
  onCancelEdit: () => void
  onDelete: (id: string) => void
}

export function TaskList({ tasks, totalCount, filter, editingId, ...handlers }: TaskListProps) {
  if (totalCount === 0) return <EmptyState variant="no-tasks" filter={filter} />
  if (tasks.length === 0) return <EmptyState variant="no-match" filter={filter} />

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} isEditing={task.id === editingId} {...handlers} />
      ))}
    </ul>
  )
}
