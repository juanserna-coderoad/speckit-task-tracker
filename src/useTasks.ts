import { useState } from 'react'
import { addTask, deleteTask, toggleTask, updateTask } from './taskLogic'
import { loadTasks, saveTasks } from './taskStorage'
import type { Task, TaskDraft } from './types'

function createId(): string {
  // randomUUID only exists in secure contexts (HTTPS or localhost); fall back for plain-HTTP use.
  return typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks)

  /** Every change goes through here so state and storage never drift apart. */
  function commit(next: Task[]) {
    setTasks(next)
    saveTasks(next)
  }

  function add(draft: TaskDraft) {
    commit(addTask(tasks, draft, createId(), Date.now()))
  }

  function toggle(id: string) {
    commit(toggleTask(tasks, id))
  }

  function update(id: string, draft: TaskDraft) {
    commit(updateTask(tasks, id, draft))
  }

  function remove(id: string) {
    commit(deleteTask(tasks, id))
  }

  return { tasks, add, update, toggle, remove }
}
