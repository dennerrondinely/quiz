# Tasks: Todos List

**Plan:** ./plan.md

## Setup
- [x] T001 Create `src/features/todos/`
- [x] T002 Create `src/features/todos/index.ts`

## Schemas and types
- [x] T010 `schemas.ts` with `todoSchema` and `createTodoInputSchema`

## API
- [x] T020 `api.ts` (manual; in real production, generate via Orval)
- [x] T021 MSW handlers in `src/test/msw/handlers.ts` for GET/POST `/todos`

## Hooks
- [x] T030 `hooks/useTodos.ts` with `todosKeys`, `useTodosList`, `useCreateTodo`

## Store
- [x] T040 `store.ts` with `useTodosUiStore({ filter, setFilter })`

## Components
- [x] T050 `components/TodoForm.tsx` (RHF + Zod + Sonner)
- [x] T051 `components/TodoList.tsx` (filtered)
- [x] T052 `components/TodosPage.tsx` (composition + filter tabs)
- [x] T053 `components/TodoForm.test.tsx`

## Route
- [x] T060 `src/routes/todos.tsx`
- [x] T061 Add link in header (`__root.tsx`)

## E2E
- [x] T070 `e2e/example.spec.ts` (home → /todos)

## Polish
- [ ] T080 `npm run lint:fix`
- [ ] T081 `npm run typecheck`
- [ ] T082 `npm test`
- [x] T083 `spec.md` marked as `Status: done`
