# Feature Specification: Simple Task Tracker

**Feature Branch**: `001-task-tracker`

**Created**: 2026-10-02

**Status**: Draft

**Input**: User description: "Create a small web application where users can manage personal tasks. Users can add a task with a title and optional description, mark a task completed or incomplete, edit a task, delete a task, and filter tasks by All, Active, and Completed. Tasks persist in the browser between visits. Show a simple empty state when there are no tasks. Clean, responsive UI. Empty titles are rejected with basic validation. No backend, no accounts."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Add and see tasks that persist (Priority: P1)

A person opens the app and types a title (and, if they want, a description) to add a task. The task appears in the list straight away. When they close the page and come back later on the same device and browser, their tasks are still there. When they have no tasks, they see a friendly empty message instead of a blank page.

**Why this priority**: Capturing a task and trusting it will still be there tomorrow is the core value. With only this story the app is already a usable, if minimal, task list.

**Independent Test**: Open the app with no saved data and confirm the empty state. Add two tasks (one with a description, one without), confirm both are listed, reload the page, and confirm both are still listed unchanged.

**Acceptance Scenarios**:

1. **Given** the app has no tasks, **When** the person opens it, **Then** an empty-state message is shown, inviting them to add a first task, and no task list items are shown.
2. **Given** the add form is visible, **When** the person enters the title "Buy milk" and submits, **Then** a task titled "Buy milk" appears in the list, the form is cleared, and the empty-state message is no longer shown.
3. **Given** the add form is visible, **When** the person enters a title and a description and submits, **Then** the task is listed showing both its title and its description.
4. **Given** the person has added tasks, **When** they reload the page or close and reopen the browser, **Then** the same tasks are shown with the same titles, descriptions, and completion states.
5. **Given** the person submits the form with an empty title or a title containing only spaces, **When** the submission is attempted, **Then** no task is created, a clear error message about the title is shown next to the title field, and what the person typed in the description is kept.
6. **Given** an error message is showing for the title, **When** the person types in the title field or successfully adds a task, **Then** the error message is cleared.

---

### User Story 2 - Complete and reopen tasks (Priority: P1)

A person marks a task as completed when it is done, and can mark it as incomplete again if they made a mistake or the work comes back. Completed tasks are visually distinguishable from active ones in a way that does not rely on colour alone.

**Why this priority**: Tracking progress is what makes a task tracker more than a notepad. It is also required to make the Active and Completed filters meaningful.

**Independent Test**: With at least one task present, mark it completed and confirm its appearance changes; reload and confirm it is still completed; mark it incomplete and confirm it returns to its original appearance.

**Acceptance Scenarios**:

1. **Given** an incomplete task, **When** the person marks it as completed, **Then** the task is shown as completed using more than colour alone (for example, a strike-through together with a checked control).
2. **Given** a completed task, **When** the person marks it as incomplete, **Then** the task is shown as active again.
3. **Given** a task whose state was changed, **When** the page is reloaded, **Then** the task is in the state the person last left it.
4. **Given** a keyboard-only person, **When** they focus a task's completion control and press Space, **Then** its state toggles.

---

### User Story 3 - Filter tasks by status (Priority: P2)

A person narrows the list to All tasks, only Active (incomplete) tasks, or only Completed tasks. The currently selected filter is clearly indicated.

**Why this priority**: Filtering becomes valuable once a person has more than a handful of tasks. It builds on Stories 1 and 2 but is not needed for basic use.

**Independent Test**: With a mix of completed and active tasks, select each filter in turn and confirm that exactly the expected tasks are listed and that the selected filter is visibly indicated.

**Acceptance Scenarios**:

1. **Given** a mix of active and completed tasks, **When** the person selects "All", **Then** every task is listed.
2. **Given** a mix of active and completed tasks, **When** the person selects "Active", **Then** only incomplete tasks are listed.
3. **Given** a mix of active and completed tasks, **When** the person selects "Completed", **Then** only completed tasks are listed.
4. **Given** the "Active" filter is selected, **When** the person marks a listed task as completed, **Then** it disappears from the list because it no longer matches the filter, and it remains saved as completed.
5. **Given** a filter matches no tasks while other tasks exist (for example, "Completed" with no completed tasks), **When** that filter is selected, **Then** a message says that no tasks match this filter, distinct from the "no tasks yet" empty state.
6. **Given** a task is added while the "Completed" filter is selected, **When** it is created, **Then** it is saved as an active task and is not shown until a filter that includes active tasks is selected.
7. **Given** a keyboard-only person, **When** they move to the filter controls, **Then** they can pick any filter with the keyboard, and the selected filter is exposed to assistive technology.

---

### User Story 4 - Edit a task (Priority: P2)

A person fixes a typo or changes details by editing an existing task's title and description, then saves, or cancels to keep the original.

**Why this priority**: People make mistakes and plans change. Editing avoids the delete-and-retype workaround, but is not needed for the first usable version.

**Independent Test**: Edit a task's title and description, save, and confirm the list and the reloaded page show the new values. Start another edit, cancel, and confirm nothing changed.

**Acceptance Scenarios**:

1. **Given** an existing task, **When** the person chooses to edit it, **Then** an edit form appears for that task, pre-filled with its current title and description, and focus moves to the title field.
2. **Given** an edit form with changed values, **When** the person saves, **Then** the task shows the new title and description, its completion state is unchanged, and the edit form closes.
3. **Given** an edit form, **When** the person clears the title (or leaves only spaces) and tries to save, **Then** the save is rejected, a clear error message is shown next to the title field, the form stays open, and the task keeps its previous title.
4. **Given** an edit form with changed values, **When** the person cancels (including by pressing Escape), **Then** the form closes and the task keeps its previous title and description.
5. **Given** a saved edit, **When** the page is reloaded, **Then** the edited values are shown.
6. **Given** an edit form has been closed by saving or cancelling, **When** it closes, **Then** keyboard focus returns to that task's edit control so keyboard users do not lose their place.

---

### User Story 5 - Delete a task (Priority: P3)

A person removes a task they no longer need.

**Why this priority**: Deleting keeps the list tidy. Completing a task already covers most "I'm done with this" cases, so deletion comes last.

**Independent Test**: Delete one task from a list of several and confirm only that task disappears, including after a reload. Delete the last remaining task and confirm the empty state appears.

**Acceptance Scenarios**:

1. **Given** a list of tasks, **When** the person deletes one, **Then** only that task is removed and the others are unchanged.
2. **Given** a deleted task, **When** the page is reloaded, **Then** the task does not reappear.
3. **Given** only one task remains, **When** the person deletes it, **Then** the "no tasks yet" empty state is shown.
4. **Given** a task is being edited, **When** the person deletes that same task, **Then** the task and its edit form are both removed.
5. **Given** a keyboard-only person, **When** they delete a task, **Then** the delete control is reachable and operable by keyboard and has an accessible name that identifies which task it removes.

---

### Edge Cases

- **Whitespace-only or empty title**: rejected on both add and edit (see acceptance scenarios). Leading and trailing spaces around an otherwise valid title are removed before saving.
- **Whitespace-only description**: treated as no description; the task shows no description area.
- **Very long title or description, or a long unbroken string**: wraps within the layout and never causes horizontal scrolling or overlaps controls.
- **Special characters and markup-like text** (for example `<b>hi</b>`, emoji, quotes): shown exactly as typed and never interpreted as markup.
- **Duplicate titles**: allowed; each task is independent.
- **Many tasks (for example, 200)**: the list remains usable and responsive.
- **Missing, corrupted, or unexpected stored data**: the app starts with an empty list instead of failing, and the next successful change overwrites the bad data.
- **Individual stored entries that are malformed**: an entry that does not look like a valid task is ignored; valid entries are kept.
- **Browser storage unavailable or full** (for example, some private browsing modes): the app keeps working for the current visit and does not crash; tasks may not survive a reload.
- **Editing one task while another is being edited**: at most one task is in edit mode at a time; starting a second edit closes the first without saving it.
- **Changing the filter while a task is being edited**: the edit is cancelled without saving, so a task that is being edited is never hidden by the filter. (Added during the final review, see review.md.)
- **Filter selection across reloads**: the filter is not remembered; the app always opens showing "All".
- **Small screens (320px wide) and large screens**: all content and controls remain visible and usable without horizontal scrolling.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Users MUST be able to add a task by providing a title and, optionally, a description.
- **FR-002**: The system MUST reject a task whose title is empty or contains only whitespace, MUST show a text error message associated with the title field, and MUST NOT create the task.
- **FR-003**: The system MUST remove leading and trailing whitespace from titles and descriptions before saving them.
- **FR-004**: New tasks MUST start as incomplete (active) and MUST appear at the top of the list, above older tasks.
- **FR-005**: Users MUST be able to mark an incomplete task as completed and a completed task as incomplete.
- **FR-006**: Completed tasks MUST be visually distinguishable from active tasks without relying on colour alone.
- **FR-007**: Users MUST be able to edit the title and description of an existing task, with the current values pre-filled, and either save or cancel the edit.
- **FR-008**: The system MUST apply the same title validation to edits as to new tasks, MUST keep the edit form open on a validation failure, and MUST leave the task unchanged until a valid edit is saved.
- **FR-009**: Editing a task MUST NOT change its completion state or its position in the list.
- **FR-010**: Users MUST be able to delete a task. Deletion takes effect immediately.
- **FR-011**: Users MUST be able to filter the list by **All**, **Active**, and **Completed**. Exactly one filter is selected at a time, the selected filter MUST be clearly indicated, and the default is **All**.
- **FR-012**: The system MUST show an empty-state message when there are no tasks at all, and a different "no matching tasks" message when tasks exist but none match the selected filter.
- **FR-013**: The system MUST save tasks in the user's browser after every change (add, edit, toggle, delete) and MUST restore them, with all their details, the next time the app is opened in the same browser.
- **FR-014**: The system MUST start with an empty list, without error, when saved data is missing, unreadable, or not in the expected format, and MUST ignore individual saved entries that are not valid tasks.
- **FR-015**: The system MUST continue to work for the current visit if browser storage is unavailable or full.
- **FR-016**: The system MUST NOT require an account, network connection after the page has loaded, or any server or external database; no task data may leave the user's device.
- **FR-017**: Every function MUST be operable with a keyboard alone, with a visible focus indicator on every interactive element.
- **FR-018**: Every form field MUST have a visible label or an accessible name; validation errors MUST be announced to assistive technology; and the selected filter and each task's completion state MUST be available to assistive technology.
- **FR-019**: The layout MUST adapt to screen widths from 320px upward without horizontal scrolling, and text and controls MUST meet WCAG 2.1 AA contrast.
- **FR-020**: Task text MUST be displayed exactly as entered and MUST NOT be interpreted as markup.

### Key Entities

- **Task**: One item the person wants to track. Has a unique identity, a title (required, non-blank), an optional description, a completion status (active or completed), and a creation time. Identity and creation time are assigned by the system when the task is created and never change.
- **Filter**: The current view of the list: All, Active, or Completed. Not persisted.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time user can add their first task in under 15 seconds without instructions.
- **SC-002**: 100% of tasks added, edited, completed, or deleted are present in the same state after the page is reloaded.
- **SC-003**: Submitting a blank title never creates a task, and the person is told why in every case.
- **SC-004**: Every feature (add, complete, edit, delete, filter) can be completed using only the keyboard.
- **SC-005**: The app is fully usable at 320px, 768px, and 1280px widths with no horizontal scrolling.
- **SC-006**: With 200 tasks, adding, toggling, or filtering updates the screen in under 100 ms from the user's point of view (no perceptible delay).
- **SC-007**: Opening the app with damaged saved data never produces an error screen; the person always sees a working app.
- **SC-008**: The main task rules (create, validate, update, toggle, delete, filter) and the saving and restoring of tasks are covered by automated tests, and all tests pass.

## Assumptions

- The app is a single-user, single-device tool; there are no accounts, sharing, or syncing across devices or browsers.
- Tasks are stored per browser profile on the device. Clearing site data removes them, and this is expected.
- Changes made in two tabs at once are not merged; the most recent change written wins. Cross-tab live syncing is out of scope.
- Deletion has no confirmation prompt and no undo. This keeps the interface simple; a mis-click can be recovered only by re-adding the task.
- There is no maximum length on titles or descriptions beyond what the browser's storage can hold; long text simply wraps.
- Tasks are not manually reorderable. The list order is newest first.
- Out of scope: due dates, priorities, tags or categories, search, bulk actions such as "clear completed" or "mark all", task counters, drag and drop, dark-mode switching, and translations.
- Modern evergreen desktop and mobile browsers are supported.
