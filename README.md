# Simple Task Tracker

A small, accessible web app for managing personal tasks, built with React and TypeScript. Tasks are
stored in your browser, so there is no backend, no account, and nothing to configure.

It was also built as a hands-on demonstration of **Spec-Driven Development with
[GitHub Spec Kit](https://github.com/github/spec-kit)**: every requirement, design decision, and task
is written down in this repository under [`specs/`](specs/001-task-tracker) before and while the code
is written.

## Features

- Add a task with a title and an optional description
- Mark a task as completed or incomplete
- Edit a task's title and description (Save, Cancel, or Escape)
- Delete a task
- Filter by **All**, **Active**, or **Completed**
- Tasks persist in the browser's `localStorage` and survive reloads
- Empty states: one for "no tasks yet" and a different one for "nothing matches this filter"
- Basic validation: a blank or whitespace-only title is rejected with a clear message
- Responsive layout (works from 320px wide) with keyboard support, visible focus, labelled fields,
  announced errors, and WCAG AA colour contrast

Damaged or missing saved data never crashes the app, and the app keeps working for the current visit
if browser storage is blocked or full.

## Technology stack

| Area | Choice |
|------|--------|
| Build tool / dev server | [Vite](https://vite.dev) |
| UI | React 19 |
| Language | TypeScript (`strict`) |
| Styling | Plain CSS (no framework) |
| Tests | [Vitest](https://vitest.dev) |
| Persistence | Browser `localStorage` |

The only runtime dependencies are `react` and `react-dom`.

## Install

Requires Node.js 20.19+ or 22.12+ and npm.

```bash
npm install
```

## Run

```bash
npm run dev       # development server with hot reload, http://localhost:5173
npm run build     # type-check and create a production build in dist/
npm run preview   # serve the production build locally
```

## Run tests

```bash
npm test
```

The tests cover the task rules (validate, add, edit, toggle, delete, filter) and the saving and
loading of tasks, including corrupt data and unavailable storage. They run in plain Node with no
browser, because the logic and storage code are kept free of React and the DOM.

## Project structure

```text
src/
├── types.ts            # Task, TaskDraft, TaskFilter
├── taskLogic.ts        # pure task rules (no React, no storage)
├── taskStorage.ts      # the only code that touches localStorage
├── useTasks.ts         # React hook joining state and storage
├── App.tsx             # page layout, filter and "which task is being edited"
└── components/         # TaskForm, FilterBar, TaskList, TaskItem, EmptyState
specs/001-task-tracker/ # Spec Kit artifacts for this feature (see below)
.specify/               # Spec Kit constitution, templates, and scripts
.claude/skills/         # Spec Kit commands as agent skills (/speckit-*)
```

## How GitHub Spec Kit was used

[Spec Kit](https://github.com/github/spec-kit) turns a feature idea into working code through a fixed
sequence of written artifacts, each one checked before the next is produced (here by the spec quality
checklist, the plan's Constitution Check, and a final review). The project was set up
with `specify init --here --integration claude --script ps`, and the steps below were followed in
order. Every artifact is kept in this repository so the whole path can be inspected.

| Step | Spec Kit command | Artifact in this repo | What it contains |
|------|------------------|-----------------------|------------------|
| 1. Principles | `/speckit-constitution` | [`.specify/memory/constitution.md`](.specify/memory/constitution.md) | Five principles: simplicity, maintainability, TypeScript quality, testing, accessibility; plus constraints and governance |
| 2. Specification | `/speckit-specify` | [`specs/001-task-tracker/spec.md`](specs/001-task-tracker/spec.md), [`checklists/requirements.md`](specs/001-task-tracker/checklists/requirements.md) | 5 prioritised user stories with acceptance scenarios, edge cases, 20 functional requirements, success criteria, assumptions; and a spec quality checklist |
| 3. Plan | `/speckit-plan` | [`plan.md`](specs/001-task-tracker/plan.md), [`research.md`](specs/001-task-tracker/research.md), [`data-model.md`](specs/001-task-tracker/data-model.md), [`contracts/`](specs/001-task-tracker/contracts), [`quickstart.md`](specs/001-task-tracker/quickstart.md) | Technical context, a Constitution Check gate, decisions with alternatives, data model, storage and module contracts, and a manual validation guide |
| 4. Tasks | `/speckit-tasks` | [`tasks.md`](specs/001-task-tracker/tasks.md) | Ordered, checkable tasks grouped by user story, with test tasks placed before the code they cover |
| 5. Implement | `/speckit-implement` | `src/` | Code written story by story from `tasks.md`; completed tasks are marked `[x]` |
| 6. Review | (final review against the spec) | [`review.md`](specs/001-task-tracker/review.md) | Each requirement, scenario, edge case, and success criterion checked against the finished app, with gaps and fixes recorded |

Notes on how it was run: the steps followed each command's instructions in `.claude/skills/`, applied by
hand in an agent session rather than by typing the slash commands. The optional enhancement commands
(`/speckit-clarify`, `/speckit-checklist`, `/speckit-analyze`) were not run; only the spec quality
checklist that `/speckit-specify` produces was.

How the artifacts connect:

- The **constitution** sets the rules every later step must obey (for example, "only `react` and
  `react-dom` at runtime" and "logic lives in pure functions"). The plan's *Constitution Check* tests
  its design against those rules.
- The **spec** says *what* and *why*, with no technology named. Requirement IDs (`FR-001` and so on)
  are what the plan, tasks, and review refer back to.
- The **plan** says *how*, and every choice has a recorded reason and the alternatives that were
  rejected.
- The **tasks** are small enough to do one at a time, and each names the file it changes.
- The **review** closes the loop by checking the result against the spec rather than against memory.

To explore the workflow yourself, install the CLI and run `specify check`, or open the project in an
agent that supports Spec Kit and use the `/speckit-*` commands, for example
`/speckit-analyze` to check the spec, plan, and tasks for consistency.
