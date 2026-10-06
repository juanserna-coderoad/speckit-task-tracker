import { describe, expect, it } from 'vitest'
import { loadTasks, saveTasks, STORAGE_KEY, type StorageLike } from './taskStorage'
import type { Task } from './types'

function createMemoryStorage(initial?: string): StorageLike & { raw(): string | null } {
  let value: string | null = initial ?? null
  return {
    getItem: () => value,
    setItem: (_key, next) => {
      value = next
    },
    raw: () => value,
  }
}

const brokenStorage: StorageLike = {
  getItem: () => {
    throw new Error('access denied')
  },
  setItem: () => {
    throw new Error('quota exceeded')
  },
}

const sample: Task = {
  id: 'a',
  title: 'Buy milk',
  description: 'Semi-skimmed',
  completed: false,
  createdAt: 1000,
}

describe('saveTasks and loadTasks', () => {
  it('round-trips tasks with all their details, in order', () => {
    const storage = createMemoryStorage()
    const tasks: Task[] = [sample, { ...sample, id: 'b', title: 'Walk dog', completed: true, createdAt: 500 }]

    expect(saveTasks(tasks, storage)).toBe(true)

    expect(loadTasks(storage)).toEqual(tasks)
  })

  it('returns an empty list when nothing has been saved', () => {
    expect(loadTasks(createMemoryStorage())).toEqual([])
  })

  it('returns an empty list for invalid JSON', () => {
    expect(loadTasks(createMemoryStorage('not json'))).toEqual([])
  })

  it('returns an empty list when the stored value is not an array', () => {
    expect(loadTasks(createMemoryStorage('{"id":"a"}'))).toEqual([])
    expect(loadTasks(createMemoryStorage('"text"'))).toEqual([])
    expect(loadTasks(createMemoryStorage('null'))).toEqual([])
  })

  it('drops malformed entries but keeps valid ones', () => {
    const stored = JSON.stringify([
      sample,
      { ...sample, id: '' },
      { ...sample, id: 'c', title: '   ' },
      { ...sample, id: 'd', title: 42 },
      { ...sample, id: 'e', description: null },
      { ...sample, id: 'f', completed: 'yes' },
      { ...sample, id: 'g', createdAt: 'yesterday' },
      { bad: true },
      'text',
      null,
    ])

    expect(loadTasks(createMemoryStorage(stored))).toEqual([sample])
  })

  it('keeps the first of two entries that share an id', () => {
    const stored = JSON.stringify([sample, { ...sample, title: 'Duplicate' }])

    expect(loadTasks(createMemoryStorage(stored))).toEqual([sample])
  })

  it('stores data under the documented key', () => {
    const keys: string[] = []
    const storage: StorageLike = {
      getItem: (key) => {
        keys.push(key)
        return null
      },
      setItem: (key) => {
        keys.push(key)
      },
    }

    saveTasks([sample], storage)
    loadTasks(storage)

    expect(keys).toEqual([STORAGE_KEY, STORAGE_KEY])
  })

  it('does not throw when storage fails, and reports a failed save', () => {
    expect(loadTasks(brokenStorage)).toEqual([])
    expect(saveTasks([sample], brokenStorage)).toBe(false)
  })

  it('works without any storage', () => {
    expect(loadTasks(null)).toEqual([])
    expect(saveTasks([sample], null)).toBe(false)
  })
})
