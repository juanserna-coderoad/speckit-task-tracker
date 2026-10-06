# Research & Decisions: Simple Task Tracker

All items in the plan's Technical Context were resolved from the constraints in the feature brief and
the constitution. No `NEEDS CLARIFICATION` items remained. Versions below were checked against the npm
registry on 2026-10-02.

## D1: Build tool and UI library

- **Decision**: Vite 8 with `@vitejs/plugin-react`, React 19, TypeScript (`strict`).
- **Rationale**: Required by the brief. Vite gives a zero-config dev server and a static production
  build with `vite build`.
- **Alternatives considered**: Create React App (deprecated); Next.js (server framework, overkill for a
  static client-only app).

## D2: State management

- **Decision**: React `useState` in one custom hook (`useTasks`), with `filter` and `editingId` held in
  `App`.
- **Rationale**: State is one array plus two scalars. No sharing across distant components is needed.
- **Alternatives considered**: Redux/Zustand (extra dependency, no benefit at this size); `useReducer`
  (reasonable, but the pure logic functions already play the reducer role and are easier to test
  directly); React Context (props only pass one level deep).

## D3: Persistence

- **Decision**: `localStorage` through a single module, `taskStorage.ts`. One key
  (`task-tracker.tasks.v1`) holds a JSON array. Data is parsed as `unknown` and each entry is validated
  with a type guard. All access is wrapped in `try/catch`.
- **Rationale**: Required by the brief. Validation and `try/catch` satisfy FR-014 and FR-015 and
  constitution principle III. The `v1` suffix leaves room for a future migration without implementing
  one now.
- **Alternatives considered**: IndexedDB (async, heavier, unneeded); a schema-validation library such as
  Zod (extra dependency for a five-field object; a 10-line type guard is enough).

## D4: Testing

- **Decision**: Vitest in the Node environment, with the storage module taking an injectable
  `StorageLike` (`getItem`, `setItem`).
- **Rationale**: Vitest shares Vite's config and is fast. Because logic and storage are pure or injected,
  no DOM implementation (`jsdom`) is required, which keeps dev dependencies down. The brief asks for
  "a few meaningful unit tests for the main task logic", and this covers it.
- **Alternatives considered**: Jest (needs extra transform config); React Testing Library + jsdom
  (valuable for interaction tests, but the constitution makes component tests optional and the manual
  quickstart covers the UI behaviours).

## D5: Styling

- **Decision**: One plain CSS file with custom properties, mobile-first, and `:focus-visible` outlines.
- **Rationale**: No dependency, trivially responsive, and full control over contrast and focus styles
  for accessibility.
- **Alternatives considered**: Tailwind, CSS Modules, styled-components (all add tooling or runtime
  weight without a clear need).

## D6: Accessibility approach

- **Decision**: Use native elements: `<form>`, `<label>`, `<input type="checkbox">`, `<button>`,
  `<ul>`/`<li>`. Filter buttons use `aria-pressed`. Field errors are text with `role="alert"` linked via
  `aria-describedby` and `aria-invalid`. The completed state is shown by the checkbox plus
  strike-through. On edit open, focus goes to the title field. On edit close, focus returns to that
  task's Edit button.
- **Rationale**: Native semantics give keyboard and screen-reader behaviour for free (FR-017, FR-018).
  Strike-through plus a checked box satisfies "not colour alone" (FR-006).
- **Alternatives considered**: Custom ARIA widgets such as `role="tablist"` for filters (more code and
  more ways to get keyboard behaviour wrong than toggle buttons).

## D7: Identifier generation

- **Decision**: `crypto.randomUUID()` where available, otherwise a timestamp-plus-random string. The id
  generator and clock are arguments to `addTask`.
- **Rationale**: `randomUUID` exists only in secure contexts (HTTPS or localhost). The fallback keeps the
  app working if served over plain HTTP on a LAN. Injecting both makes tests deterministic.
- **Alternatives considered**: An incrementing integer (collides when two tabs add tasks); the `uuid`
  package (unneeded dependency).

## D8: Dev dependencies kept out on purpose

- **Decision**: No ESLint or Prettier in the first version.
- **Rationale**: Constitution III requires the linter only "if configured". `tsc` strict mode
  catches the important mistakes, and the brief asks for minimal dependencies.
- **Alternatives considered**: ESLint with `typescript-eslint` (can be added later without changing
  any design).
