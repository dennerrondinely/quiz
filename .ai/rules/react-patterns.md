# React Patterns

## Server vs Client state

| Type | Where it lives | Example |
|------|---------------|---------|
| Comes from server | TanStack Query | todo list, user details |
| Feature local UI | Zustand feature store | selected filter, modal open |
| Temporary form | React Hook Form | data before submitting |
| URL | Router search params | filters that should be shareable |
| Isolated component | `useState` | tooltip toggle, hover |

**Golden rule**: if the data comes from the network, it does NOT go in `useState`. Always use Query.

## TanStack Query

- Always export a `xxxKeys` factory: `{ all, list(), detail(id) }`.
- Default global `staleTime` is 30s (`app/query-client.ts`). Override per hook if justified.
- Mutations update the cache via `setQueryData` (optimistic) or `invalidateQueries` (refetch).
- `useSuspenseQuery` for routes with `loader`. Combine with Error Boundary.

## React Hook Form + Zod

```tsx
const form = useForm<Input>({
  resolver: zodResolver(inputSchema),
  defaultValues: { ... },
});
```

- Never control inputs manually. Use `register` or `Controller`.
- Errors come from `formState.errors`. Render with `aria-invalid` + `aria-describedby`.
- Async submit: `handleSubmit(async (data) => { ... })`. Use `isSubmitting` to disable.

## Zustand

- One store per feature, in `store.ts`.
- Selector pattern: `useTodosUiStore((s) => s.filter)` instead of `useTodosUiStore()` (avoids re-rendering the whole component).
- Don't store server state. Don't store derived state that can be computed.
- No unnecessary middleware. `persist` only if truly needed cross-session.

## Components

- **Functional + hooks**, always. No class components.
- **Explicit TypeScript props**: `function Foo({ x }: { x: string })`. No `React.FC`.
- **Small components**. If it goes past 150 lines, consider splitting.
- **Children-as-data over render-props**. Composition via `<Card.Header>` is better than `<Card render={(h) => ...} />`.
- **No `useEffect` to derive state**. Compute on render. `useEffect` is only for syncing with external systems.

## Anti-patterns

- ❌ `const [data, setData] = useState(); useEffect(() => fetch().then(setData), [])`
  → Use `useQuery`.
- ❌ `useMemo` on a cheap primitive value.
  → Don't optimize without profiling.
- ❌ Component that accepts `onClick` AND `onSelect` AND `onChange` for the same action.
  → Pick one consistent name.
- ❌ Global state for everything.
  → Start local, elevate when 2+ components need it.
- ❌ `key={index}` in a list that can reorder.
  → Use a stable ID.

## Suspense + Error Boundaries

- TanStack Router routes support `errorComponent` and `pendingComponent` per file. Use them.
- For fetch inside a component: `useSuspenseQuery` + `<Suspense>` + `<ErrorBoundary>` at the right level.
