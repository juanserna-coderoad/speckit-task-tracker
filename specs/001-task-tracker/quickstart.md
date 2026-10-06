# Quickstart & Validation Guide: Simple Task Tracker

## Prerequisites

- Node.js 20.19+ or 22.12+ and npm (tested with Node 22)

## Setup and run

```bash
npm install        # install dependencies
npm run dev        # start the dev server (default http://localhost:5173)
npm test           # run unit tests once
npm run build      # type-check and create a production build in dist/
npm run preview    # serve the production build locally
```

## Automated checks

| Command | Expected |
|---------|----------|
| `npm test` | All tests in `src/taskLogic.test.ts` and `src/taskStorage.test.ts` pass |
| `npm run build` | Type-check succeeds with zero errors and `dist/` is produced |

## Manual validation walkthrough

Run `npm run dev`, open the app in a browser, and clear site data for the page first. Each step maps
to the spec.

| # | Steps | Expected | Spec |
|---|-------|----------|------|
| 1 | Open the app with no data | Empty-state message, no list | US1-1, FR-012 |
| 2 | Submit the form with an empty title; repeat with only spaces | No task created; text error next to the title; typed description kept | US1-5, FR-002 |
| 3 | Type in the title field | Error message disappears | US1-6 |
| 4 | Add "Buy milk" with no description, then "Write report" with a description | Both listed, newest first; second shows its description; form cleared | US1-2, US1-3, FR-004 |
| 5 | Reload the page | Same tasks, same order | US1-4, FR-013 |
| 6 | Tick "Buy milk" | Strike-through and checked box; reload keeps it | US2-1, US2-3, FR-006 |
| 7 | Untick it | Returns to active appearance | US2-2 |
| 8 | Select Active, Completed, All | Only matching tasks shown; selected filter visibly indicated | US3-1..3, FR-011 |
| 9 | Select Active, then tick a listed task | It disappears from the view and is still completed under Completed | US3-4 |
| 10 | Complete every task and select Active | "No matching tasks" message (not the "no tasks yet" one) | US3-5, FR-012 |
| 11 | Select Completed, add a task | Task saved as active and hidden until All or Active is chosen | US3-6 |
| 12 | Click Edit on a task | Form pre-filled; focus is in the title field | US4-1 |
| 13 | Change title and description, Save | New values shown; status and position unchanged; reload keeps them | US4-2, US4-5, FR-009 |
| 14 | Edit, clear the title, Save | Error shown, form stays open, old title kept | US4-3, FR-008 |
| 15 | Edit, change text, press Escape (and again with the Cancel button) | Form closes, original values kept, focus back on that task's Edit button | US4-4, US4-6 |
| 16 | Start editing task A, then click Edit on task B | A's edit closes unsaved; B's opens | Edge cases |
| 17 | Delete a task in the middle of the list | Only that task removed; reload keeps it removed | US5-1, US5-2 |
| 18 | Start editing a task, then delete it | Task and form both gone | US5-4 |
| 19 | Delete the last task | Empty-state message returns | US5-3 |
| 20 | Add a title of `<b>hi</b> 😀 "quotes"` and a 200-character unbroken string | Shown as plain text; no horizontal scroll | FR-020, edge cases |
| 21 | In DevTools set `localStorage['task-tracker.tasks.v1']` to `not json`, reload | App shows empty state, no error | US/FR-014, SC-007 |
| 22 | Set it to `[{"id":"1","title":"ok","description":"","completed":false,"createdAt":1},{"bad":true}]`, reload | Only the valid task appears | FR-014 |
| 23 | Use only Tab, Shift+Tab, Enter, Space, Escape to perform steps 4, 6, 8, 13, 17 | Everything works; focus ring always visible | FR-017, SC-004 |
| 24 | Resize to 320px, 768px, 1280px wide | No horizontal scrolling at any width | FR-019, SC-005 |
| 25 | Start editing a task, then click a different filter | The edit form closes without saving; no task is left hidden in edit mode | Edge cases |
