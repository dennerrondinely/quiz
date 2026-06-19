# Frontend Rules

General principles that apply to ANY UI code in this repo. All other rules (`architecture.md`, `react-patterns.md`, `tailwind-rules.md`) refine these principles — read them after this one.

## Principles

1. **Accessibility is not optional.** Every interactive UI must have correct `role`, `aria-*` attributes and be keyboard-navigable.
2. **Performance matters, but correctness first.** Don't micro-optimize before measuring. Use React Devtools Profiler before adding `memo`/`useMemo`/`useCallback`.
3. **Single source of truth.** Each piece of state lives in ONE place (server state in TanStack Query, client state in Zustand, form state in RHF). Never duplicate.
4. **Zod schemas are the contract.** Types come from schemas via `z.infer`, never the other way around. Validate external inputs (API, env, localStorage, URL params).
5. **No `any`, no casual `as`.** Use `unknown` + Zod parse. `as` only to satisfy known overloads with a justification comment.
6. **Code splitting per route.** TanStack Router routes already auto code-split (configured in `vite.config.ts`). Don't add manual lazy imports.

## Do / Don't quick reference

| Do | Don't |
|----|-------|
| `const Schema = z.object({...}); type T = z.infer<typeof Schema>` | `interface T {...}` for API data |
| `<button type="button" onClick={...}>` | `<div onClick={...}>` |
| `aria-label` on icon-only buttons | buttons without an accessible label |
| Pure component receives props, returns JSX | Component accesses `window`/`document` directly without `useEffect` |
| Errors handled with `try/catch` + `toast.error` | Errors silenced or only `console.log` |

## Accessibility — minimum checklist per component

- [ ] Visible focus (`focus-visible:ring-2`)
- [ ] AA contrast (use `@theme` tokens, not hardcoded colors)
- [ ] Inputs with associated `<label>` (`htmlFor`/`id` or `<Label>`)
- [ ] Error states with `aria-invalid` + `aria-describedby`
- [ ] Images with `alt` (empty if decorative)
- [ ] Tab navigation works in visual order

## When to request human validation

- Changes to public/auth routes
- Adding a dependency > 50KB gzip
- Lint rule bypass
- API contract break (generating types via `npm run api:gen` resolves most cases)
