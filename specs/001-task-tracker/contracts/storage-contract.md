# Contract: localStorage format

The only persistence interface of the app. Defined by [`data-model.md`](../data-model.md).

## Key

`task-tracker.tasks.v1`

## Value

A JSON string containing an array of `Task` objects, in display order (newest first):

```json
[
  {
    "id": "b6c3f1c2-0f43-4c58-a5a4-0d8a5d9f4c11",
    "title": "Buy milk",
    "description": "Semi-skimmed",
    "completed": false,
    "createdAt": 1790000000000
  }
]
```

## Read rules (`loadTasks`)

1. If storage is unavailable, the key is missing, or `getItem` throws → return `[]`.
2. If the value is not valid JSON, or the parsed value is not an array → return `[]`.
3. Keep only entries that satisfy all of:
   - `id` is a non-empty string;
   - `title` is a string that is non-blank after trimming;
   - `description` is a string;
   - `completed` is a boolean;
   - `createdAt` is a finite number.
4. If two entries share an `id`, keep the first.
5. Never throw, and never write during a read.

## Write rules (`saveTasks`)

1. Serialise the full array with `JSON.stringify` and store it under the key.
2. If storage is unavailable or `setItem` throws (quota exceeded, access denied) → return `false`; the
   app keeps working with in-memory state. Otherwise return `true`.
3. Never throw.

## Versioning

The `v1` suffix in the key identifies this format. A future incompatible change would use a new key and
a one-time migration. No migration exists today (YAGNI).
