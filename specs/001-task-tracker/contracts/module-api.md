# Contract: module APIs

Internal contracts between the logic, storage, hook, and UI layers. These are the units that the
automated tests exercise.

## `src/taskLogic.ts` (pure, no React, no DOM, no storage)

```ts
export const TITLE_REQUIRED_MESSAGE: string;

/** Returns an error message, or null if the title is acceptable. */
export function validateTitle(title: string): string | null;

/** Returns a new list with the task added at the start. Returns `tasks` unchanged if the title is invalid. */
export function addTask(
  tasks: readonly Task[],
  draft: TaskDraft,
  id: string,
  createdAt: number,
): Task[];

/** Replaces title/description of the task with `id`. Unchanged list if id is unknown or title invalid. */
export function updateTask(tasks: readonly Task[], id: string, draft: TaskDraft): Task[];

/** Flips `completed` for the task with `id`. Unchanged list if id is unknown. */
export function toggleTask(tasks: readonly Task[], id: string): Task[];

/** Removes the task with `id`. Unchanged list if id is unknown. */
export function deleteTask(tasks: readonly Task[], id: string): Task[];

/** Returns the tasks matching the filter, preserving order. */
export function filterTasks(tasks: readonly Task[], filter: TaskFilter): Task[];
```

Guarantees: inputs are never mutated; functions are deterministic given their arguments; unchanged
inputs are returned as a new array with the same content (callers must not rely on identity).

## `src/taskStorage.ts` (the only module that touches `localStorage`)

```ts
export type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;
export const STORAGE_KEY = 'task-tracker.tasks.v1';

export function loadTasks(storage?: StorageLike | null): Task[];
export function saveTasks(tasks: readonly Task[], storage?: StorageLike | null): boolean;
```

When `storage` is omitted, the browser's `localStorage` is used if reachable; `null` or an unreachable
`localStorage` means "no storage". Behaviour is specified in
[storage-contract.md](./storage-contract.md).

## `src/useTasks.ts`

```ts
export function useTasks(): {
  tasks: Task[];                                  // full list, newest first
  add: (draft: TaskDraft) => void;
  update: (id: string, draft: TaskDraft) => void;
  toggle: (id: string) => void;
  remove: (id: string) => void;
};
```

Loads once on first render. Every action computes the next list with `taskLogic`, sets state, and saves
it through `taskStorage`.

## Component props

| Component | Props |
|-----------|-------|
| `TaskForm` | `initialValues?: TaskDraft`, `submitLabel: string`, `idPrefix: string`, `autoFocus?: boolean`, `onSubmit(draft: TaskDraft): void`, `onCancel?(): void` |
| `FilterBar` | `filter: TaskFilter`, `onChange(filter: TaskFilter): void` |
| `TaskList` | `tasks: Task[]` (already filtered), `totalCount: number`, `filter: TaskFilter`, `editingId: string \| null`, `onToggle`, `onStartEdit`, `onSave`, `onCancelEdit`, `onDelete` |
| `TaskItem` | `task: Task`, `isEditing: boolean`, same callbacks scoped to one task |
| `EmptyState` | `variant: 'no-tasks' \| 'no-match'`, `filter?: TaskFilter` |
