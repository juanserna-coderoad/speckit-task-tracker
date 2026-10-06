# Data Model: Simple Task Tracker

All types live in `src/types.ts` and are defined once (constitution III).

## Task

| Field | Type | Rules |
|-------|------|-------|
| `id` | `string` | Non-empty, unique within the list, assigned at creation, never changes |
| `title` | `string` | Required. Stored trimmed and never blank (FR-002, FR-003) |
| `description` | `string` | Optional. Stored trimmed. Empty string means "no description" (FR-003) |
| `completed` | `boolean` | `false` on creation (FR-004) |
| `createdAt` | `number` | Milliseconds since the Unix epoch, assigned at creation, never changes |

```ts
export interface Task {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly completed: boolean;
  readonly createdAt: number;
}
```

## TaskDraft

The user's raw input from the add and edit forms, before trimming and validation.

```ts
export interface TaskDraft {
  title: string;
  description: string;
}
```

## TaskFilter

```ts
export type TaskFilter = 'all' | 'active' | 'completed';
```

Held in `App` state only, never persisted. Starts as `'all'` (FR-011).

## Validation

| Rule | Where applied | Result |
|------|---------------|--------|
| Title, after trimming, is non-empty | `validateTitle` | Returns an error message string, or `null` when valid |
| Title and description are trimmed before saving | `addTask`, `updateTask` | Stored values never have leading or trailing whitespace |
| Whitespace-only description becomes `""` | `addTask`, `updateTask` (via trim) | Task shows no description |
| Stored entry must match the `Task` shape | `taskStorage` `isTask` guard | Invalid entries are dropped; duplicate ids keep the first |

## State transitions

```text
        add (valid title)
 (none) ───────────────────► ACTIVE ◄──────────────┐
                               │   toggle           │ toggle
                               ▼                    │
                            COMPLETED ──────────────┘

 ACTIVE or COMPLETED ── edit (valid title) ──► same status, new title/description, same position
 ACTIVE or COMPLETED ── delete ──► (removed)
```

- Editing never changes `completed`, `id`, `createdAt`, or list position (FR-009).
- New tasks are added at the start of the array, so the array order is newest first (FR-004).

## UI state (not persisted)

| State | Owner | Notes |
|-------|-------|-------|
| `filter: TaskFilter` | `App` | Default `'all'` |
| `editingId: string \| null` | `App` | At most one task is being edited at once (spec edge case) |
| Form field values and error text | `TaskForm` | Local to the form |
