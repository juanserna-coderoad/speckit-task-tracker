import type { TaskFilter } from '../types'

const OPTIONS: { value: TaskFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
]

interface FilterBarProps {
  filter: TaskFilter
  onChange: (filter: TaskFilter) => void
}

export function FilterBar({ filter, onChange }: FilterBarProps) {
  return (
    <div className="filter-bar" role="group" aria-label="Filter tasks">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={filter === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
