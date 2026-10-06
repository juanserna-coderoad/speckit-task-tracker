<!--
Sync Impact Report
- Version change: (template, unratified) → 1.0.0
- Modified principles: none renamed (initial adoption; all five principles newly defined)
- Added sections: Core Principles I–V, Technology & Scope Constraints, Development Workflow & Quality Gates, Governance
- Removed sections: none
- Follow-up TODOs: none
-->
# Simple Task Tracker Constitution

## Core Principles

### I. Simplicity First
The application MUST stay as small as its specification allows.
- The architecture is a single-page React app with no backend, no authentication, and no
  external database. Browser `localStorage` is the only persistence mechanism.
- New runtime dependencies MUST be justified in the plan. The default answer is "use the
  platform or write ten lines of code". State management, routing, UI kits, and CSS
  frameworks are out of scope unless a spec requirement cannot be met without them.
- Features, abstractions, and configuration that are not required by an approved spec MUST NOT
  be added (YAGNI). If an abstraction has only one user, inline it.

Rationale: a small tracker's value is that it is easy to read, change, and demonstrate. Every
extra layer costs more than it returns at this scale.

### II. Maintainability
Code MUST be easy for a new contributor to understand in one sitting.
- Components MUST be small and single-purpose. A component that exceeds roughly 100 lines or
  mixes rendering with storage or business rules MUST be split.
- Task business logic (create, update, toggle, delete, filter, validate) MUST live in plain,
  framework-free functions separate from React components, so it can be tested without a DOM.
- Browser storage access MUST be isolated behind a single small module; components MUST NOT call
  `localStorage` directly.
- Names MUST describe intent. Comments explain *why*, not *what*.

Rationale: separating logic, storage, and presentation is the lightest structure that keeps the
code testable and changeable.

### III. TypeScript Quality
TypeScript MUST be used in `strict` mode and MUST provide real safety.
- `any` and unchecked type assertions (`as`) are prohibited, except where documented inline at the
  boundary of untrusted data (for example, parsing `localStorage`).
- Data read from `localStorage` MUST be treated as `unknown` and validated before use. Corrupt or
  missing data MUST degrade to an empty task list, never crash the app.
- Domain types (such as `Task` and `TaskFilter`) MUST be defined once and imported where needed.
- `tsc` type-checking and the linter, if configured, MUST pass with zero errors.

Rationale: persisted data outlives code versions, so the boundary must be defended; inside it,
precise types remove whole classes of bugs.

### IV. Testing Discipline
Main task logic MUST be covered by automated unit tests.
- Every exported function in the task-logic module MUST have tests for its normal behaviour and
  its edge cases (empty or whitespace-only titles, unknown ids, empty lists).
- The storage module MUST be tested for round-trip persistence and for corrupt or invalid stored
  data.
- Tests MUST be deterministic: no reliance on real time, randomness, or network. Inject ids and
  clocks, or stub them, where needed.
- The project MUST build and all tests MUST pass before any feature is considered complete.
- Component tests are OPTIONAL and are added only where they protect behaviour that the logic
  tests cannot (for example, keyboard interaction).

Rationale: logic tests give the most confidence for the least maintenance cost in an app of this
size.

### V. Accessibility
The UI MUST be usable with a keyboard and a screen reader.
- All functionality MUST be reachable and operable with the keyboard alone, with a visible focus
  indicator.
- Use semantic HTML first (`button`, `form`, `label`, `ul`/`li`, `input type="checkbox"`); ARIA is
  added only where semantics are insufficient.
- Every form control MUST have an associated visible label or an accessible name.
- Validation errors MUST be shown as text, associated with their field, and announced to assistive
  technology; colour MUST NOT be the only indicator of state (for example, completed tasks).
- Text and controls MUST meet WCAG 2.1 AA colour contrast, and the layout MUST work from 320px
  wide upward without horizontal scrolling.

Rationale: accessibility is cheapest when built in from the start and is part of "clean UI".

## Technology & Scope Constraints

- **Stack**: Vite, React, and TypeScript. Plain CSS is used for styling. Vitest is used for tests.
- **Runtime dependencies** are limited to `react` and `react-dom`. Anything added to the
  `dependencies` section of `package.json` MUST be justified in the plan.
- **Data**: Tasks live only in the user's browser. There is no network I/O at runtime.
- **Browsers**: current evergreen browsers (Chrome, Edge, Firefox, Safari).
- **Out of scope** unless a spec adds them: accounts, sync, due dates, priorities, tags, drag and
  drop, search, undo, and internationalisation.

## Development Workflow & Quality Gates

Work follows the Spec Kit sequence: constitution → specify → plan → tasks → implement → review.
- Every change traces to a requirement in `specs/<feature>/spec.md` and a task in `tasks.md`.
- A change that needs behaviour not in the spec MUST update the spec first.
- Before a feature is considered done, these MUST all pass: `npm run build` (which includes
  type-checking), `npm test`, and a manual walkthrough of the spec's acceptance scenarios.
- A final review MUST compare the implementation to the spec and record any gaps found and fixed.
- The plan MUST contain a Constitution Check; any violation MUST be listed with its justification.

## Governance

This constitution supersedes other project practices. Where a spec, plan, or task conflicts with
it, the constitution wins, or it must be amended first.

- **Amendments** are made by editing this file in a dedicated change that states the reason, and by
  updating the version and the "Last Amended" date below.
- **Versioning** follows semantic versioning: MAJOR for removing or redefining a principle in a
  backward-incompatible way, MINOR for adding a principle or materially expanding guidance, PATCH
  for clarifications and wording fixes.
- **Compliance** is reviewed at plan time (Constitution Check) and again in the final review of the
  implementation against the spec.

**Version**: 1.0.0 | **Ratified**: 2026-10-02 | **Last Amended**: 2026-10-02
