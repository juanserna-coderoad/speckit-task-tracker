# Implementation Review: Simple Task Tracker

**Reviewed**: 2026-10-02 | **Against**: [spec.md](./spec.md), [constitution](../../.specify/memory/constitution.md), [plan.md](./plan.md)

## Verdict

All 20 functional requirements, all 5 user stories' acceptance scenarios, every listed edge case, and
all 8 success criteria are met. The review found **5 gaps, all fixed** (see below). No requirement is
open. Two verification limits are stated honestly at the end.

## How this was verified

| Method | Result |
|--------|--------|
| `npm run build` (runs `tsc -b` strict, then `vite build`) | Passes, 0 type errors |
| `npm test` (Vitest) | 39 tests in 2 files pass: 30 in `taskLogic.test.ts`, 9 in `taskStorage.test.ts` |
| Browser walkthrough of every [quickstart](./quickstart.md) step in real Chrome, driven by a throwaway Playwright script kept outside the repo (so no test dependency was added) | 59 of 59 checks pass, including 0 console errors or warnings |
| Perf probe with 200 tasks | Median toggle and filter updates take one frame (33 ms, same as an empty frame); worst toggle 34 ms |
| Network probe | 0 requests to any origin other than the local server |
| Source scan | No `any`, no `as` assertions, no `dangerouslySetInnerHTML`, no `fetch`/XHR/WebSocket in `src/` |
| Colour contrast computed from the palette | Text pairs 6.0:1 to 15.5:1 (AA needs 4.5:1); button borders 3.2:1 (3:1 needed) |

## Functional requirements

| ID | Status | Evidence |
|----|--------|----------|
| FR-001 add with title and optional description | Met | `TaskForm` + `addTask`; walkthrough step 4 |
| FR-002 blank title rejected with associated text error | Met | `validateTitle`; `role="alert"` + `aria-describedby` + `aria-invalid`; steps 2 and 14; unit tests |
| FR-003 trim title and description | Met | `addTask`/`updateTask`; unit tests |
| FR-004 new tasks active, newest first | Met | `addTask` prepends; step 4; unit test |
| FR-005 toggle complete/incomplete | Met | `toggleTask`; steps 6, 7 |
| FR-006 completed not shown by colour alone | Met | Checked box plus strike-through; step 6 asserts computed `line-through` |
| FR-007 edit title and description, save or cancel, pre-filled | Met | `TaskItem` edit mode; steps 12, 13, 15 |
| FR-008 same validation on edit, form stays open, task unchanged | Met | Step 14; `updateTask` unit tests |
| FR-009 edit keeps status and position | Met | `updateTask` unit tests; step 13 |
| FR-010 delete immediately | Met | `deleteTask`; steps 17 to 19 |
| FR-011 All/Active/Completed, one selected, indicated, default All | Met | `FilterBar` with `aria-pressed`; step 8 |
| FR-012 two distinct empty states | Met | `EmptyState` variants; steps 1, 10 |
| FR-013 persist after every change, restore on open | Met | `commit()` saves; steps 5, 6, 13, 17 |
| FR-014 bad or missing data starts empty; invalid entries skipped | Met | `loadTasks`; 7 storage unit tests; steps 21, 22 |
| FR-015 works if storage unavailable or full | Met | Storage unit tests (throwing storage); browser run with `localStorage` access throwing |
| FR-016 no account, server, or data leaving the device | Met | Network probe: 0 external requests |
| FR-017 keyboard operable, visible focus | Met | Native controls only; step 23; focus outline measured |
| FR-018 labels, announced errors, filter and completion state exposed | Met | `<label>` on all fields; `role="alert"`; `aria-pressed`; native checkbox named by task title |
| FR-019 responsive from 320px, AA contrast | Met | Step 24 at 320/768/1280 with long unbroken text; contrast computed |
| FR-020 text shown as typed, never markup | Met | React text nodes only; step 20 asserts no `<b>` element rendered |

## User stories and edge cases

- **US1 (6 scenarios), US2 (4), US3 (7), US4 (6), US5 (5)**: every scenario is covered by a
  quickstart step that passed in the browser; scenario-to-step mapping is in the "Spec" column of
  `quickstart.md`.
- **Edge cases**: whitespace-only title and description, long and unbroken text, markup-like text,
  duplicate titles (unit test), corrupt storage, malformed entries, blocked storage, one edit at a
  time, filter not remembered across reload, and 320px width are all verified. 200 tasks are
  covered by the performance probe.

## Success criteria

SC-001 (add a first task in under 15 seconds): the form is the first control on the page, with the
title field first in tab order, so it is a two-step action. SC-002 to SC-005, SC-007: verified as
above. SC-006: verified by the performance probe. SC-008: 39 passing tests over logic and storage.

## Constitution check (post-implementation)

| Principle | Result |
|-----------|--------|
| I. Simplicity | Only `react` and `react-dom` at runtime; no extra libraries; no features beyond the spec |
| II. Maintainability | Logic, storage, and UI are separated. The two largest components, `TaskItem` (112 lines) and `TaskForm` (111 lines), sit just over the constitution's "roughly 100 lines" guide. Each has a single purpose (one row; one validated form) and neither mixes in storage or business rules, so they were judged acceptable and not split. Splitting `TaskItem` into view and edit parts is the obvious next step if it grows |
| III. TypeScript | `strict` plus `noUncheckedIndexedAccess`; types defined once in `types.ts`; storage parsed from `unknown` with a guard; no `any` or `as` |
| IV. Testing | Every exported logic function and both storage functions are tested, deterministically (ids, clock, and storage injected) |
| V. Accessibility | See FR-017 to FR-019 |

## Gaps found and fixed

| # | Gap | Fix |
|---|-----|-----|
| 1 | The browser requested a missing `/favicon.ico`, producing a console 404 on every load | Inline SVG favicon in `index.html` |
| 2 | Button borders had 1.6:1 contrast, below the 3:1 non-text guideline in the constitution's AA rule | New `--control-border` colour (3.2:1) used for buttons |
| 3 | Two CSS contrast comments overstated their ratios | Corrected after computing the real values |
| 4 | Behaviour not in the spec: changing the filter while editing closes the edit form (otherwise a task could stay in edit mode while hidden by the filter). The constitution requires spec changes first | Added to the spec's edge cases and to quickstart step 25; verified in the browser. This was a retroactive spec amendment, recorded here rather than silent |
| 5 | The plan named TypeScript 7 and a different tsconfig layout than what the Vite template actually pins and generates | Plan corrected to TypeScript 6.x and the real tsconfig files |

## Known limits of this review

- **No screen reader was run.** Accessibility is verified through semantic structure, accessible
  names and roles as the browser exposes them, keyboard operation, focus handling, and computed
  contrast, not through NVDA, JAWS, or VoiceOver. A short pass with one of them is worthwhile
  before relying on the app for users who depend on assistive technology.
- **UI behaviour has no committed automated tests.** The unit tests cover the logic and storage;
  the browser walkthrough was run once and not added to the repository, to respect the
  "minimal dependencies" constraint. If UI regression tests are wanted, adding Playwright or
  React Testing Library is a plan change and should be recorded in `research.md` first.
- Browsers tested: Chrome (desktop engine) only.
