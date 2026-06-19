# Testing Rules

Three levels: **unit (Vitest)**, **integration (Vitest + MSW)**, **e2e (Playwright)**. Normal pyramid: many units, some integration, few e2e.

## What to test where

| Type | Tests | Where |
|------|-------|-------|
| Unit | Pure function, Zod schema, isolated Zustand store | `*.test.ts` alongside |
| Integration | React component + hooks + mocked API (MSW) | `*.test.tsx` alongside |
| E2E | Critical user flow (login, checkout) | `e2e/*.spec.ts` |

Don't write e2e for everything. Write e2e only for the 3-5 flows that, if broken, the product is broken.

## Structure — Given / When / Then

```ts
it('describes expected behavior', async () => {
  // Given
  const user = userEvent.setup();
  render(<Component />);

  // When
  await user.click(screen.getByRole('button', { name: /submit/i }));

  // Then
  expect(await screen.findByText(/success/i)).toBeInTheDocument();
});
```

Use `// Given` for preconditions and setup, `// When` for the action that triggers the behavior, `// Then` for assertions. In tests where render and action are inseparable, group as `// Given / When`.

## Testing Library queries — priority

1. `getByRole` (ARIA — tests accessibility for free)
2. `getByLabelText`
3. `getByPlaceholderText`
4. `getByText`
5. `getByTestId` (last resort — add `data-testid` only when the others won't work)

## MSW

- Handlers in `src/test/msw/handlers.ts`. Shared between Vitest tests and dev (`VITE_ENABLE_MSW=true`).
- In `setup.ts`: `server.listen({ onUnhandledRequest: 'error' })` — fails if any test makes an unmocked fetch.
- Override per test: `server.use(http.get('/x', () => HttpResponse.json(...)))`.
- No direct `axios` mocking. Always via MSW (tests the full stack).

## React Hook Form in tests

- Use `userEvent` (not `fireEvent`). RHF handles `userEvent.type` well.
- Await async validation with `waitFor` or `findBy*`.
- For async Zod schemas, consider `await waitFor` before asserting errors.

## TanStack Query in tests

- `test-utils.tsx` already provides `render` with its own `QueryClient` (no retry, no cache).
- Never share `queryClient` between tests.
- Await with `findBy*` — not with `waitFor` in a loop checking if loading is gone.

## E2E (Playwright)

- Always `await expect(...).toBeVisible()` — Playwright has auto-wait, no manual sleeps.
- `baseURL` is configured. Use relative routes: `page.goto('/todos')`.
- For tests that depend on data, prefer seeding via API call in `beforeEach` rather than through the UI.
- Don't test browser-specific quirks — Playwright runs on Chromium by default (config).

## Anti-patterns

- ❌ Component tree snapshots (tests implementation, not behavior).
- ❌ Direct `axios`/`fetch` mock in the test (use MSW).
- ❌ `setTimeout` or `sleep` in tests (use `findBy*`/`waitFor`).
- ❌ `getByTestId` when `getByRole` would work.
- ❌ Tests that must run in a specific order.

## Coverage

- Reports in `coverage/`. No mandatory threshold, but aim for ~80% line coverage in `features/`.
- Don't cover `routeTree.gen.ts`, generated files, or `main.tsx` (already in exclude).
