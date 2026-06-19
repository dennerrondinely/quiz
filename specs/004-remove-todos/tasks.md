# Tasks: Remove Todos Feature

**Plan:** ./plan.md

Check tasks with `[x]` when done. Maintain order — dependencies flow top to bottom.

---

## MSW handlers

- [x] T010 Edit `src/test/msw/handlers.ts` — remove all Todos-specific code:
  - Delete `import type { Todo } from '@/features/todos/schemas'`
  - Delete `const initial`, `let store`, and `export function resetTodosStore()`
  - Delete `// --- Todos fixtures ---` comment block and `const baseURL = '*'`
  - Delete the `http.get(…/todos, …)` and `http.post(…/todos, …)` entries from the `handlers` array
  - The retained file must export only: `QUIZ_API_URL`, `agentFundamentalsFixture`, and `handlers` (with the single quiz `http.get` entry)
  - Run `npm run lint:fix` on the file
  - Verify: `npm run typecheck` passes (no reference to deleted Todo type)

## Feature deletion

- [x] T020 Delete `src/features/todos/` — entire directory:
  ```
  src/features/todos/api.ts
  src/features/todos/schemas.ts
  src/features/todos/store.ts
  src/features/todos/index.ts
  src/features/todos/hooks/useTodos.ts
  src/features/todos/components/TodosPage.tsx
  src/features/todos/components/TodoForm.tsx
  src/features/todos/components/TodoForm.test.tsx
  src/features/todos/components/TodoList.tsx
  src/features/todos/components/TodoSearchInput.tsx
  src/features/todos/components/TodoSearchInput.test.tsx
  ```
  Use: `rm -rf src/features/todos/`

## Route deletion

- [x] T030 Delete `src/routes/todos.tsx`
  Use: `rm src/routes/todos.tsx`
  **Note:** `src/routeTree.gen.ts` still references `./routes/todos` at this point — that is expected and will be fixed by the build step below.

## Build verification (regenerates routeTree.gen.ts)

- [x] T040 Run `npm run build` — this triggers the TanStack Router Vite plugin which regenerates `src/routeTree.gen.ts` without the deleted `/todos` route, then runs `tsc -b`. Both must succeed with zero errors.

## Full verification

- [x] T050 Verify: `npm run lint:fix` — no remaining issues (particularly no dangling Todos imports)
- [x] T060 Verify: `npm test` — all remaining tests pass (expect count to drop from 100 as Todos tests are removed)

## Polish

- [x] T070 Update `specs/004-remove-todos/spec.md` → `Status: done`
- [x] T080 Update `specs/INDEX.md` — move 004 from "Approved" to "Done"
