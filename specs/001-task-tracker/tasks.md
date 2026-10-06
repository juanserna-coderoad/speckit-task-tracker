---

description: "Task list for the Simple Task Tracker feature"
---

# Tasks: Simple Task Tracker

**Input**: Design documents from `/specs/001-task-tracker/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Included. The feature brief and constitution (Principle IV) require unit tests for the task
logic and storage. Within each story, test tasks come before the implementation they cover. Component
tests are not generated (optional per the constitution); UI behaviour is validated through
`quickstart.md`.

**Organization**: Tasks are grouped by user story. Because `taskLogic.ts` and `TaskItem.tsx` are shared
files, tasks that edit the same file are sequential (no `[P]`).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on an incomplete task)
- **[Story]**: User story the task belongs to (US1..US5)
- Paths are relative to the repository root

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialisation and tooling

- [x] T001 Scaffold a Vite React + TypeScript project at the repository root (`package.json`, `index.html`, `vite.config.ts`, `src/main.tsx`, `src/App.tsx`) without disturbing `.specify/`, `.claude/`, or `specs/`
- [x] T002 Remove template boilerplate that the plan does not use: demo assets, logos, `src/index.css` demo styles, ESLint config and its dev dependencies (plan decision D8)
- [x] T003 Add `vitest` as a dev dependency; configure the Node test environment in `vite.config.ts`; make `package.json` scripts `dev`, `build` (type-check then build), `preview`, and `test` (`vitest run`)
- [x] T004 [P] Set `strict` and related safety flags in `tsconfig.json` and confirm `npm run build` succeeds on the empty shell
- [x] T005 [P] Set the page `<title>`, `lang="en"`, and viewport meta in `index.html`; add a `.gitignore` for `node_modules/` and `dist/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Types, persistence, and app shell that every story depends on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Define `Task`, `TaskDraft`, and `TaskFilter` in `src/types.ts` per data-model.md
- [x] T007 [P] Write tests for `loadTasks` and `saveTasks` in `src/taskStorage.test.ts` using an in-memory `StorageLike`: round-trip; missing key; invalid JSON; non-array JSON; invalid entries dropped while valid ones are kept; duplicate ids; `getItem` throwing; `setItem` throwing returns `false`; `null` storage
- [x] T008 Implement `STORAGE_KEY`, `StorageLike`, `loadTasks`, and `saveTasks` in `src/taskStorage.ts` per contracts/storage-contract.md, with an `isTask` type guard that reads values as `unknown` (no `any`, no `as`)
- [x] T009 Create `src/useTasks.ts` with the initial-load state and the internal `commit(next)` helper that sets state and saves (no actions yet)
- [x] T010 [P] Create base styles in `src/App.css`: colour and spacing custom properties meeting WCAG AA contrast, mobile-first layout with a centred max-width column, `overflow-wrap: anywhere`, a visible `:focus-visible` outline, and button and input styles
- [x] T011 Build the page shell in `src/App.tsx` and `src/main.tsx`: `<main>`, `<h1>Task Tracker</h1>`, and the import of `App.css`

**Checkpoint**: Foundation ready. `npm run build` passes, `npm test` runs the storage tests.

---

## Phase 3: User Story 1 - Add and see tasks that persist (Priority: P1) 🎯 MVP

**Goal**: Add tasks with a title and optional description, see them listed, keep them across reloads, and see an empty state when there are none.

**Independent Test**: quickstart steps 1 to 5 and 20 to 22.

### Tests for User Story 1

- [x] T012 [US1] Write tests in `src/taskLogic.test.ts` for `validateTitle` (empty, spaces-only, tabs/newlines-only, valid) and `addTask` (adds at the start; trims title and description; blank description becomes `""`; starts `completed: false`; uses the given id and timestamp; invalid title leaves the list unchanged; input array not mutated)

### Implementation for User Story 1

- [x] T013 [US1] Implement `TITLE_REQUIRED_MESSAGE`, `validateTitle`, and `addTask` in `src/taskLogic.ts`
- [x] T014 [US1] Add `add(draft)` to `src/useTasks.ts`, generating ids with `crypto.randomUUID()` and a fallback for non-secure contexts, and a `Date.now()` timestamp
- [x] T015 [P] [US1] Create `src/components/TaskForm.tsx` for adding: labelled Title and Description inputs, `<form>` submit, blank-title validation via `validateTitle`, an error shown with `role="alert"`, `aria-invalid`, and `aria-describedby`, error cleared on typing, and form reset on success while a failed submit keeps the description
- [x] T016 [P] [US1] Create `src/components/EmptyState.tsx` with the `no-tasks` variant ("No tasks yet…")
- [x] T017 [US1] Create `src/components/TaskItem.tsx` (display only: title and, if present, description) and `src/components/TaskList.tsx` (`<ul>`; shows `EmptyState` when there are no tasks)
- [x] T018 [US1] Wire `TaskForm` and `TaskList` into `src/App.tsx` through `useTasks`

**Checkpoint**: User Story 1 works end to end and survives reload. Storage and logic tests pass.

---

## Phase 4: User Story 2 - Complete and reopen tasks (Priority: P1)

**Goal**: Toggle a task between active and completed, with a non-colour-only completed style.

**Independent Test**: quickstart steps 6 and 7.

### Tests for User Story 2

- [x] T019 [US2] Add `toggleTask` tests to `src/taskLogic.test.ts`: flips active to completed and back; only the target task changes; unknown id leaves the list unchanged; input not mutated

### Implementation for User Story 2

- [x] T020 [US2] Implement `toggleTask` in `src/taskLogic.ts`
- [x] T021 [US2] Add `toggle(id)` to `src/useTasks.ts`
- [x] T022 [US2] Add a native checkbox, labelled by the task title, to `src/components/TaskItem.tsx` and pass `onToggle` through `src/components/TaskList.tsx` and `src/App.tsx`; style completed tasks with strike-through and muted text in `src/App.css`

**Checkpoint**: Stories 1 and 2 work independently.

---

## Phase 5: User Story 3 - Filter tasks by status (Priority: P2)

**Goal**: Show All, Active, or Completed tasks with the selected filter clearly indicated.

**Independent Test**: quickstart steps 8 to 11.

### Tests for User Story 3

- [x] T023 [US3] Add `filterTasks` tests to `src/taskLogic.test.ts`: `all` returns everything; `active`; `completed`; order preserved; empty list; input not mutated

### Implementation for User Story 3

- [x] T024 [US3] Implement `filterTasks` in `src/taskLogic.ts`
- [x] T025 [P] [US3] Create `src/components/FilterBar.tsx`: three buttons with `aria-pressed` inside a labelled group, selected style not relying on colour alone
- [x] T026 [US3] Add `no-match` variant to `src/components/EmptyState.tsx`, and make `src/components/TaskList.tsx` choose between `no-tasks` and `no-match` using `totalCount`
- [x] T027 [US3] Add `filter` state (default `'all'`) to `src/App.tsx`, render `FilterBar`, and pass `filterTasks(tasks, filter)` to `TaskList`

**Checkpoint**: Stories 1 to 3 work independently.

---

## Phase 6: User Story 4 - Edit a task (Priority: P2)

**Goal**: Edit title and description in place with validation, Save, Cancel, and Escape; focus is managed.

**Independent Test**: quickstart steps 12 to 16.

### Tests for User Story 4

- [x] T028 [US4] Add `updateTask` tests to `src/taskLogic.test.ts`: changes title and description (trimmed); keeps `id`, `completed`, `createdAt`, and position; unknown id leaves the list unchanged; blank title leaves the list unchanged; input not mutated

### Implementation for User Story 4

- [x] T029 [US4] Implement `updateTask` in `src/taskLogic.ts`
- [x] T030 [US4] Add `update(id, draft)` to `src/useTasks.ts`
- [x] T031 [US4] Extend `src/components/TaskForm.tsx` for editing: `initialValues`, `submitLabel`, `idPrefix` (unique field ids), `autoFocus` for the title input, `onCancel` with a Cancel button, and Escape-to-cancel; a failed save keeps the form open with the error
- [x] T032 [US4] Add an Edit button (accessible name includes the task title) and the edit mode to `src/components/TaskItem.tsx`, rendering `TaskForm` in place of the text, and returning focus to the Edit button when the form closes
- [x] T033 [US4] Add `editingId` state to `src/App.tsx` (only one task editing at a time; starting a second edit replaces the first) and pass `onStartEdit`, `onSave`, `onCancelEdit` through `src/components/TaskList.tsx`

**Checkpoint**: Stories 1 to 4 work independently.

---

## Phase 7: User Story 5 - Delete a task (Priority: P3)

**Goal**: Remove a task immediately.

**Independent Test**: quickstart steps 17 to 19.

### Tests for User Story 5

- [x] T034 [US5] Add `deleteTask` tests to `src/taskLogic.test.ts`: removes only the target; unknown id leaves the list unchanged; deleting the last task gives `[]`; input not mutated

### Implementation for User Story 5

- [x] T035 [US5] Implement `deleteTask` in `src/taskLogic.ts`
- [x] T036 [US5] Add `remove(id)` to `src/useTasks.ts`
- [x] T037 [US5] Add a Delete button (accessible name includes the task title) to `src/components/TaskItem.tsx`; in `src/App.tsx` clear `editingId` when the task being edited is deleted

**Checkpoint**: All five stories work independently.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, verification, and the final review against the spec

- [x] T038 [P] Write `README.md`: overview, features, technology stack, install, run, test, build, project structure, and how GitHub Spec Kit was used
- [x] T039 Run `npm run build` and `npm test`; fix any failure
- [x] T040 Run the quickstart manual walkthrough (`specs/001-task-tracker/quickstart.md`) in a browser; record any deviation
- [x] T041 Review the implementation against every functional requirement, acceptance scenario, edge case, and success criterion in `spec.md` and against the constitution; record the result in `specs/001-task-tracker/review.md`
- [x] T042 Fix every gap found in T041, then re-run T039 and update `review.md` with the outcome

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: none; start immediately
- **Foundational (Phase 2)**: depends on Setup; blocks all stories
- **User Stories (Phases 3 to 7)**: depend on Foundational. Run them in priority order (US1, US2, US3, US4, US5) because they share `taskLogic.ts`, `TaskItem.tsx`, `TaskList.tsx`, and `App.tsx`
- **Polish (Phase 8)**: depends on all stories

### User Story Dependencies

- **US1 (P1)**: after Foundational; no dependency on other stories (MVP)
- **US2 (P1)**: after US1 (needs list items to toggle) but testable on its own via the logic tests and the quickstart
- **US3 (P2)**: after US1; benefits from US2 to show a mix of statuses
- **US4 (P2)**: after US1
- **US5 (P3)**: after US1; interacts with US4 (deleting a task that is being edited)

### Within Each Story

1. Tests first (confirm they fail), then logic, then hook, then components, then wiring
2. A story is finished when its quickstart steps pass

### Parallel Opportunities

- Phase 1: T004 and T005
- Phase 2: T007 (storage tests), T010 (styles) in parallel with each other and with T006 then T008
- US1: T015 (`TaskForm`) and T016 (`EmptyState`) are in different files and can be done together
- US3: T025 (`FilterBar`) is independent of T023 and T024
- Polish: T038 (README) can be written any time after US1

## Implementation Strategy

### MVP First

1. Phases 1 and 2
2. Phase 3 (US1), then stop and validate with quickstart steps 1 to 5 and 20 to 22

### Incremental Delivery

Add US2, then US3, US4, and US5, validating each against its quickstart steps. Finish with Phase 8.

## Notes

- Tasks are marked complete (`- [x]`) as they are finished during implementation
- No task adds behaviour beyond `spec.md`; if one is needed, update the spec first (constitution, Development Workflow)
