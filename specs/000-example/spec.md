# Feature: Todos List

**Status:** done
**Created:** 2026-05-15

## Why

Demonstrate the SDD flow end-to-end with a simple but complete feature: validated input, list, API persistence, client-side filtering, tests. Serves as a mirror for new project features.

## What (scope)

A `/todos` page where the user can see todos, create new ones, and filter by status.

### In scope
- List todos (coming from the API).
- Create a new todo via a form with validation.
- Filter the list by: all / active / completed.
- Visual feedback (success/error) for operations.

### Out of scope
- Editing an existing todo's title.
- Deleting todos.
- Marking as completed (todos come ready from the mock).
- Offline sync.
- Auth.

## User stories

- As a visitor, I want to see the current list of todos, so I can understand the state of my agenda.
- As a visitor, I want to create a todo by typing a title and clicking "Add", so I can register a new task.
- As a visitor, I want to filter by status, so I can focus on what's still pending.

## Acceptance criteria

- **Scenario 1 — List**: GIVEN there are 2 todos on the server, WHEN I go to `/todos`, THEN I see both titles.
- **Scenario 2 — Validation**: GIVEN I'm on `/todos`, WHEN I click "Add" without typing anything, THEN I see the message "Title is required" and the request is NOT sent.
- **Scenario 3 — Create**: GIVEN I typed "Study Spec Kit" in the input, WHEN I click "Add", THEN the todo appears in the list, the input is cleared, and a success toast is shown.
- **Scenario 4 — Filter**: GIVEN there is 1 completed todo and 1 pending, WHEN I click the "completed" filter, THEN only the completed one appears.

## Constraints and assumptions

- API follows the minimum OpenAPI contract (`openapi.yaml`).
- In dev/test, MSW mocks the routes — doesn't depend on a real backend.
- Accessibility AA (visible focus, labels, aria-invalid on error).

## Points to clarify

(none — reference example feature)
