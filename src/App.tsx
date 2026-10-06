import { useState } from 'react'
import { FilterBar } from './components/FilterBar'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import { filterTasks } from './taskLogic'
import type { TaskDraft, TaskFilter } from './types'
import { useTasks } from './useTasks'

export default function App() {
  const { tasks, add, update, toggle, remove } = useTasks()
  const [filter, setFilter] = useState<TaskFilter>('all')
  // At most one task is edited at a time; starting another edit replaces this one.
  const [editingId, setEditingId] = useState<string | null>(null)

  function handleSave(id: string, draft: TaskDraft) {
    update(id, draft)
    setEditingId(null)
  }

  function handleDelete(id: string) {
    if (id === editingId) setEditingId(null)
    remove(id)
  }

  function handleFilterChange(next: TaskFilter) {
    // The edited task may not match the new filter, so close the form instead of hiding it.
    setEditingId(null)
    setFilter(next)
  }

  return (
    <main className="app">
      <h1>Task Tracker</h1>
      <section className="add-card" aria-label="Add a task">
        <TaskForm idPrefix="add" submitLabel="Add task" onSubmit={add} />
      </section>
      <FilterBar filter={filter} onChange={handleFilterChange} />
      <TaskList
        tasks={filterTasks(tasks, filter)}
        totalCount={tasks.length}
        filter={filter}
        editingId={editingId}
        onToggle={toggle}
        onStartEdit={setEditingId}
        onSave={handleSave}
        onCancelEdit={() => setEditingId(null)}
        onDelete={handleDelete}
      />
    </main>
  )
}
