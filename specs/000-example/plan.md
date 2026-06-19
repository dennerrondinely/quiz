# Plan: Todos List

**Spec:** ./spec.md
**Created:** 2026-05-15

## Technical summary

Client-side feature in `src/features/todos/` consuming `/todos` (mocked via MSW in dev/test, via OpenAPI/Orval in prod). Form with RHF + Zod, list with TanStack Query, filter with Zustand UI store.

## Proposed structure

```
src/features/todos/
├── api.ts                          # GET/POST /todos
├── schemas.ts                      # Zod: todoSchema, createTodoInputSchema
├── hooks/useTodos.ts               # useTodosList, useCreateTodo + todosKeys
├── store.ts                        # useTodosUiStore (filter)
├── components/
│   ├── TodoForm.tsx                # RHF + Zod
│   ├── TodoList.tsx                # render filtered list
│   ├── TodoForm.test.tsx
│   └── TodosPage.tsx
└── index.ts                        # exports TodosPage

src/routes/todos.tsx                # createFileRoute('/todos')
src/test/msw/handlers.ts            # GET/POST /todos
```

## Zod schemas

- `todoSchema`: `{ id: string, title: string (1-200 chars), completed: boolean }`
- `createTodoInputSchema`: `{ title: string (1-200) }` with English error messages.
- Types via `z.infer`.

## Routes

- `/todos` → `TodosPage`. No search params in this version. No loader (Query client fetches on-mount).

## Components

| Component | Origin | Function |
|-----------|--------|---------|
| `Button`, `Input`, `Card` | `src/shared/ui/` | reuse (shadcn) |
| `TodoForm` | new | input + submit |
| `TodoList` | new | filtered render |
| `TodosPage` | new | layout + filters + composition |

## State

- Server: `useTodosList` (queryKey `['todos','list']`), `useCreateTodo` (optimistic via `setQueryData`).
- Client: `useTodosUiStore({ filter })`.
- Form: RHF + zodResolver(`createTodoInputSchema`).

## External dependencies

None new — all already in the base `package.json`.

## Tests

- **Unit**: Zod schemas (rejects empty title).
- **Integration**: `TodoForm.test.tsx` covers empty validation + submit happy path (with MSW).
- **E2E**: `e2e/example.spec.ts` covers nav home → /todos.

## Risks / points of attention

- MSW must be active in tests (`server.listen` in setup) — already is.
- Color tokens must come from `@theme` in `index.css`.

## Identified reuse

- `@/shared/ui/{button,input,card}` — shadcn base.
- `@/shared/lib/cn` — class concat.
- `@/test/test-utils` — `render` with test QueryClientProvider.
