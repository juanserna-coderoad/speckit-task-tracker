import { describe, expect, it } from 'vitest'
import {
  addTask,
  deleteTask,
  filterTasks,
  TITLE_REQUIRED_MESSAGE,
  toggleTask,
  updateTask,
  validateTitle,
} from './taskLogic'
import type { Task } from './types'

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 'task-1',
    title: 'Existing task',
    description: '',
    completed: false,
    createdAt: 100,
    ...overrides,
  }
}

describe('validateTitle', () => {
  it('accepts a normal title', () => {
    expect(validateTitle('Buy milk')).toBeNull()
  })

  it('rejects an empty title', () => {
    expect(validateTitle('')).toBe(TITLE_REQUIRED_MESSAGE)
  })

  it('rejects titles made only of whitespace', () => {
    expect(validateTitle('   ')).toBe(TITLE_REQUIRED_MESSAGE)
    expect(validateTitle('\t\n ')).toBe(TITLE_REQUIRED_MESSAGE)
  })

  it('accepts a title with surrounding whitespace', () => {
    expect(validateTitle('  Buy milk  ')).toBeNull()
  })
})

describe('addTask', () => {
  it('adds a new, incomplete task at the start of the list', () => {
    const existing = makeTask()

    const result = addTask([existing], { title: 'Buy milk', description: 'Semi-skimmed' }, 'new-id', 200)

    expect(result).toEqual([
      { id: 'new-id', title: 'Buy milk', description: 'Semi-skimmed', completed: false, createdAt: 200 },
      existing,
    ])
  })

  it('trims the title and description', () => {
    const [task] = addTask([], { title: '  Buy milk  ', description: '  Semi-skimmed \n' }, 'id', 1)

    expect(task?.title).toBe('Buy milk')
    expect(task?.description).toBe('Semi-skimmed')
  })

  it('treats a whitespace-only description as no description', () => {
    const [task] = addTask([], { title: 'Buy milk', description: '   ' }, 'id', 1)

    expect(task?.description).toBe('')
  })

  it('leaves the list unchanged when the title is blank', () => {
    const existing = [makeTask()]

    expect(addTask(existing, { title: '   ', description: 'kept?' }, 'id', 1)).toEqual(existing)
  })

  it('does not mutate the input list', () => {
    const existing = Object.freeze([makeTask()])

    const result = addTask(existing, { title: 'New', description: '' }, 'id', 1)

    expect(existing).toHaveLength(1)
    expect(result).toHaveLength(2)
  })

  it('allows duplicate titles', () => {
    const existing = makeTask({ title: 'Same' })

    const result = addTask([existing], { title: 'Same', description: '' }, 'other-id', 2)

    expect(result.map((task) => task.title)).toEqual(['Same', 'Same'])
  })
})

describe('toggleTask', () => {
  it('marks an active task as completed and back again', () => {
    const active = [makeTask()]

    const completed = toggleTask(active, 'task-1')
    expect(completed[0]?.completed).toBe(true)

    const reopened = toggleTask(completed, 'task-1')
    expect(reopened[0]?.completed).toBe(false)
  })

  it('changes only the target task', () => {
    const tasks = [makeTask({ id: 'a' }), makeTask({ id: 'b' }), makeTask({ id: 'c' })]

    const result = toggleTask(tasks, 'b')

    expect(result.map((task) => task.completed)).toEqual([false, true, false])
    expect(result.map((task) => task.id)).toEqual(['a', 'b', 'c'])
  })

  it('leaves the list unchanged for an unknown id', () => {
    const tasks = [makeTask()]

    expect(toggleTask(tasks, 'missing')).toEqual(tasks)
  })

  it('does not mutate the input', () => {
    const task = makeTask()

    toggleTask([task], 'task-1')

    expect(task.completed).toBe(false)
  })
})

describe('filterTasks', () => {
  const tasks = [
    makeTask({ id: 'a', completed: false }),
    makeTask({ id: 'b', completed: true }),
    makeTask({ id: 'c', completed: false }),
    makeTask({ id: 'd', completed: true }),
  ]

  it('returns every task for "all"', () => {
    expect(filterTasks(tasks, 'all')).toEqual(tasks)
  })

  it('returns only incomplete tasks for "active"', () => {
    expect(filterTasks(tasks, 'active').map((task) => task.id)).toEqual(['a', 'c'])
  })

  it('returns only completed tasks for "completed"', () => {
    expect(filterTasks(tasks, 'completed').map((task) => task.id)).toEqual(['b', 'd'])
  })

  it('returns an empty list when nothing matches', () => {
    expect(filterTasks([makeTask({ completed: false })], 'completed')).toEqual([])
    expect(filterTasks([], 'all')).toEqual([])
  })

  it('does not mutate the input', () => {
    const input = Object.freeze([...tasks])

    expect(() => filterTasks(input, 'active')).not.toThrow()
    expect(input).toHaveLength(4)
  })
})

describe('updateTask', () => {
  const tasks = [
    makeTask({ id: 'a', title: 'First', createdAt: 3 }),
    makeTask({ id: 'b', title: 'Second', description: 'old', completed: true, createdAt: 2 }),
    makeTask({ id: 'c', title: 'Third', createdAt: 1 }),
  ]

  it('changes the title and description of the target task, trimmed', () => {
    const result = updateTask(tasks, 'b', { title: '  Renamed ', description: ' new text ' })

    expect(result[1]?.title).toBe('Renamed')
    expect(result[1]?.description).toBe('new text')
  })

  it('keeps id, completed state, creation time, and position', () => {
    const result = updateTask(tasks, 'b', { title: 'Renamed', description: '' })

    expect(result.map((task) => task.id)).toEqual(['a', 'b', 'c'])
    expect(result[1]).toMatchObject({ id: 'b', completed: true, createdAt: 2 })
  })

  it('does not touch the other tasks', () => {
    const result = updateTask(tasks, 'b', { title: 'Renamed', description: '' })

    expect(result[0]).toEqual(tasks[0])
    expect(result[2]).toEqual(tasks[2])
  })

  it('can clear the description', () => {
    expect(updateTask(tasks, 'b', { title: 'Second', description: '   ' })[1]?.description).toBe('')
  })

  it('leaves the list unchanged when the title is blank', () => {
    expect(updateTask(tasks, 'b', { title: '  ', description: 'changed' })).toEqual(tasks)
  })

  it('leaves the list unchanged for an unknown id', () => {
    expect(updateTask(tasks, 'missing', { title: 'Renamed', description: '' })).toEqual(tasks)
  })

  it('does not mutate the input', () => {
    const input = Object.freeze([...tasks])

    updateTask(input, 'a', { title: 'Renamed', description: '' })

    expect(input[0]?.title).toBe('First')
  })
})

describe('deleteTask', () => {
  const tasks = [makeTask({ id: 'a' }), makeTask({ id: 'b' }), makeTask({ id: 'c' })]

  it('removes only the target task', () => {
    expect(deleteTask(tasks, 'b').map((task) => task.id)).toEqual(['a', 'c'])
  })

  it('leaves the list unchanged for an unknown id', () => {
    expect(deleteTask(tasks, 'missing')).toEqual(tasks)
  })

  it('returns an empty list when the last task is deleted', () => {
    expect(deleteTask([makeTask()], 'task-1')).toEqual([])
  })

  it('does not mutate the input', () => {
    const input = Object.freeze([...tasks])

    deleteTask(input, 'a')

    expect(input).toHaveLength(3)
  })
})
