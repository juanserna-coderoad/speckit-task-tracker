# Implementation Plan: Simple Task Tracker

**Branch**: `001-task-tracker` | **Date**: 2026-10-02 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-task-tracker/spec.md`

## Summary

Build a client-only single-page task tracker. Users add, edit, complete, delete, and filter
personal tasks; tasks persist in the browser's `localStorage`. The technical approach is the
smallest structure that satisfies the constitution:

- **Pure logic module** (`taskLogic.ts`) holds every task rule as framework-free functions on
  plain data: validate, add, update, toggle, delete, filter.
- **Storage module** (`taskStorage.ts`) is the only code that touches `localStorage`. It treats
  stored data as `unknown`, validates it, and never throws.
- **One hook** (`useTasks.ts`) connects React state to those two modules.
- **Small presentational components** render the UI using semantic HTML and plain CSS.

There is no router, state library, UI kit, or CSS framework. Runtime dependencies are only
`react` and `react-dom`.

## Technical Context

**Language/Version**: TypeScript 6.x (`strict`, as pinned by the Vite template), ES2023 target, Node 22 for tooling

**Primary Dependencies**: `react` 19, `react-dom` 19 (runtime). Dev only: `vite`, `@vitejs/plugin-react`,
`typescript`, `vitest`, `@types/react`, `@types/react-dom`

**Storage**: Browser `localStorage`, one key holding a JSON array of tasks (see
[contracts/storage-contract.md](./contracts/storage-contract.md))

**Testing**: Vitest (Node environment, no DOM). The logic and storage modules take plain data and an
injected storage object, so no `jsdom` or React Testing Library is needed.

**Target Platform**: Evergreen desktop and mobile browsers; static files served by any web server

**Project Type**: Single-page web application (frontend only)

**Performance Goals**: Perceptibly instant updates with 200 tasks (spec SC-006); full-list render is
sufficient, so no virtualisation or memoisation is needed

**Constraints**: No backend, no auth, no network I/O at runtime, minimal dependencies, works from 320px
wide, WCAG 2.1 AA contrast, keyboard operable

**Scale/Scope**: One user, tens to low hundreds of tasks, roughly 10 source files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Gate | Status |
|-----------|------|--------|
| I. Simplicity First | Only `react`/`react-dom` at runtime; no extra state, routing, or styling libraries; no features beyond the spec | PASS |
| II. Maintainability | Logic, storage, and UI are separate; storage isolated in one module; components small and single-purpose | PASS |
| III. TypeScript Quality | `strict` on; `Task`, `TaskDraft`, `TaskFilter` defined once in `types.ts`; stored data parsed from `unknown` with a type guard; no `any` and no `as` | PASS |
| IV. Testing Discipline | Vitest unit tests for every exported logic function and for storage round-trip and corrupt data; deterministic via injected ids, clock, and storage | PASS |
| V. Accessibility | Semantic HTML; labelled fields; `role="alert"` errors; `aria-pressed` filters; native checkboxes; visible focus; focus management on edit open and close | PASS |

**Post-design re-check (after Phase 1)**: all gates still PASS. No complexity violations, so the
Complexity Tracking table is intentionally empty.

## Project Structure

### Documentation (this feature)

```text
specs/001-task-tracker/
├── spec.md
├── plan.md              # This file
├── research.md          # Phase 0: decisions and rationale
├── data-model.md        # Phase 1: Task, TaskDraft, TaskFilter, validation, state transitions
├── quickstart.md        # Phase 1: how to run and manually validate the acceptance scenarios
├── contracts/
│   ├── storage-contract.md   # localStorage key and JSON format
│   └── module-api.md         # public functions of taskLogic and taskStorage
├── checklists/
│   └── requirements.md       # spec quality checklist
├── tasks.md             # Phase 2 output (/speckit-tasks)
└── review.md            # Final review of implementation against the spec
```

### Source Code (repository root)

```text
index.html
package.json
tsconfig.json                # project references
tsconfig.app.json            # strict; covers src/
tsconfig.node.json           # covers vite.config.ts
vite.config.ts               # React plugin + Vitest config (node environment)
src/
├── main.tsx                 # mounts <App />
├── App.tsx                  # page layout; owns filter and editingId state
├── App.css                  # all styling (plain CSS, custom properties)
├── types.ts                 # Task, TaskDraft, TaskFilter
├── taskLogic.ts             # pure task rules
├── taskLogic.test.ts
├── taskStorage.ts           # localStorage load/save with validation
├── taskStorage.test.ts
├── useTasks.ts              # React hook: state + persistence + actions
└── components/
    ├── TaskForm.tsx         # shared by "add" and "edit"; validates title, shows error
    ├── FilterBar.tsx        # All / Active / Completed buttons (aria-pressed)
    ├── TaskList.tsx         # <ul>; renders EmptyState or TaskItem rows
    ├── TaskItem.tsx         # one row: checkbox, text, Edit and Delete; hosts edit form
    └── EmptyState.tsx       # "no tasks yet" vs "no matching tasks" message
```

**Structure Decision**: A single flat Vite project (no workspaces, no backend folder). Files live in
`src/` with only one sub-folder, `components/`. Test files sit beside the module they test.

## Key Design Decisions

(Full rationale in [research.md](./research.md).)

1. **Logic as pure functions on `readonly Task[]`**, returning new arrays. Ids and timestamps are
   passed in, so tests are deterministic.
2. **`TaskForm` is shared** between add and edit to avoid duplicating validation, labelling, and error
   handling. It is "controlled by props, owns its input state".
3. **Persist on every committed change** from the hook (`commit(next)` sets state and saves) rather than
   in an effect. This avoids a redundant write on first load, so corrupt data is only replaced by a
   real user change, as specified.
4. **Escape/Cancel and focus return** are handled in `TaskItem` and `TaskForm` with a ref and no
   library.
5. **React escapes text** by default, so FR-020 is met by never using `dangerouslySetInnerHTML`.
6. **Ids** use `crypto.randomUUID()` when present, with a small fallback for non-secure contexts.

## Complexity Tracking

No constitution violations; nothing to justify.
