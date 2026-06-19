# Plan: Remove Todos Feature

**Spec:** ./spec.md
**Created:** 2026-06-19

## Technical summary

Delete `src/features/todos/` and `src/routes/todos.tsx` in full, then surgically remove Todos-specific handlers and fixtures from `src/test/msw/handlers.ts`, leaving all quiz infrastructure untouched.

## Proposed structure

### Files to DELETE entirely

```
src/features/todos/                     DELETE entire directory (11 files)
├── api.ts
├── schemas.ts
├── store.ts
├── hooks/useTodos.ts
├── index.ts
└── components/
    ├── TodosPage.tsx
    ├── TodoForm.tsx
    ├── TodoForm.test.tsx
    ├── TodoList.tsx
    ├── TodoSearchInput.tsx
    └── TodoSearchInput.test.tsx

src/routes/todos.tsx                    DELETE (Todos route)
```

### Files to EDIT (partial removal)

```
src/test/msw/handlers.ts                EDIT — remove Todos-only sections
```

### Files confirmed UNCHANGED

```
src/test/msw/browser.ts                 keep as-is (no Todos references)
src/test/msw/server.ts                  keep as-is (no Todos references)
src/test/setup.ts                       keep as-is (no Todos references)
src/test/test-utils.tsx                 keep as-is (no Todos references)
e2e/example.spec.ts                     keep as-is (already quiz-only)
e2e/quiz-flow.spec.ts                   keep as-is (quiz-only)
src/routes/__root.tsx                   keep as-is (no Todos link since spec 002)
src/shared/                             keep entirely (shared design system, no Todos coupling)
```

## Zod schemas

None — this is a deletion. No new schemas.

## Routes

**Route deleted:** `src/routes/todos.tsx` → removes the `/todos` path from the TanStack Router tree.

After deletion, navigating to `/todos` will hit the root route's `notFoundComponent: NotFoundPage` (added in spec 003), satisfying acceptance criterion Scenario 1.

No `routeTree.gen.ts` manual edit needed — TanStack Router's Vite plugin regenerates it automatically when the route file is deleted and the dev server / build runs.

## Components

No new components. The following are deleted:

| Component | Why removed |
|-----------|-------------|
| `TodosPage` | Todos-only page |
| `TodoForm` | Todos-only form |
| `TodoList` | Todos-only list |
| `TodoSearchInput` | Todos-only search |

## State

No state changes. Todos' `store.ts` (Zustand) is deleted outright — it was never imported by quiz code.

## External dependencies

No changes. The Todos feature used no dependencies exclusive to it (`react-hook-form`, `zod`, `zustand` are all shared with quiz and remain).

## handlers.ts surgery

Current file structure:

```ts
import type { Todo } from '@/features/todos/schemas';   // ← DELETE

const initial: Todo[] = [...]                            // ← DELETE
let store: Todo[] = [...]                                // ← DELETE
export function resetTodosStore() { ... }                // ← DELETE

// --- Todos fixtures ---                                // ← DELETE
const baseURL = '*';                                     // ← DELETE

export const handlers = [
  http.get(QUIZ_API_URL, ...),    // ← KEEP
  http.get(`${baseURL}/todos`, ...), // ← DELETE
  http.post(`${baseURL}/todos`, ...) // ← DELETE
];
```

After edit, `handlers.ts` retains only:
- `import type { QuizCategory } from '@/features/quiz/schemas'`
- `QUIZ_API_URL` constant
- `agentFundamentalsFixture` export
- `handlers` array with only the quiz `http.get(QUIZ_API_URL, ...)` entry

## Tests

**Deleted test files (Todos-only):**
- `src/features/todos/components/TodoForm.test.tsx` — 2 tests
- `src/features/todos/components/TodoSearchInput.test.tsx` — unknown count

**Expected test count after deletion:** current 100 minus whatever Todos tests total. All remaining tests continue to pass.

**No new tests** — this is a deletion, not a feature.

## Risks / points of attention

- **`routeTree.gen.ts` auto-regeneration**: TanStack Router's Vite plugin regenerates `src/routeTree.gen.ts` automatically when a route file is added or removed. The build / `npm run dev` triggers it. Do NOT manually edit `routeTree.gen.ts` — let the plugin handle it. Run `npm run typecheck` after the deletion to confirm it regenerated cleanly.
- **`resetTodosStore` reference check**: confirmed by `grep` that `resetTodosStore` is not imported anywhere in quiz tests. Safe to remove from handlers.
- **No circular import risk**: the quiz tests import `agentFundamentalsFixture` from `handlers.ts` — this will continue to work after the Todos sections are removed.
- **Biome import ordering**: after editing `handlers.ts`, run `npm run lint:fix` to let Biome reorder any remaining imports.

## Identified reuse

- `src/shared/ui/` — Button, Input, etc. used by quiz; all preserved.
- `src/shared/lib/http.ts` — used by quiz API client; preserved.
- `src/test/test-utils.tsx` — `renderWithProviders` used by all quiz component tests; preserved.
- Quiz MSW handler (`http.get(QUIZ_API_URL, ...)`) and `agentFundamentalsFixture` in `handlers.ts` — kept exactly as-is.
