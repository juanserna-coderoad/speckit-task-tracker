import type { TaskFilter } from '../types'

interface EmptyStateProps {
  /** `no-tasks`: nothing saved yet. `no-match`: tasks exist but none match the filter. */
  variant: 'no-tasks' | 'no-match'
  filter: TaskFilter
}

export function EmptyState({ variant, filter }: EmptyStateProps) {
  if (variant === 'no-tasks') {
    return (
      <div className="empty-state">
        <strong>No tasks yet</strong>
        Add your first task above to get started.
      </div>
    )
  }

  const label = filter === 'completed' ? 'completed' : 'active'
  return (
    <div className="empty-state">
      <strong>No {label} tasks match this filter</strong>
      Choose another filter to see your other tasks.
    </div>
  )
}
