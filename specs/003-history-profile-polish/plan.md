# Plan: Attempt History, User Profile, and Visual Polish

**Spec:** ./spec.md
**Created:** 2026-06-19

## Technical summary

Extend the existing `quiz` feature with a persisted username store, a `RecentAttempts` home-page
section, Sonner completion toasts, a CSS fade-in question transition, and a 404 `notFoundComponent`
on the root route — touching `__root.tsx`, `ResultsPage`, `QuizPage`, `HomePage`, and adding two
new feature components and one new Zustand store.

## Proposed structure

```
src/features/quiz/
├── user-store.ts                        NEW — Zustand persist, key "quiz-username"
├── user-store.test.ts                   NEW — unit tests
├── components/
│   ├── UsernameModal.tsx                NEW — RHF modal (first-visit + edit)
│   ├── UsernameModal.test.tsx           NEW — integration test
│   ├── RecentAttempts.tsx               NEW — last attempt per category, clear dialog
│   ├── RecentAttempts.test.tsx          NEW — integration test
│   ├── QuizPage.tsx                     EDIT — add fade-in key animation
│   ├── ResultsPage.tsx                  EDIT — fire Sonner toast after addAttempt
│   └── HomePage.tsx                     EDIT — render <RecentAttempts> below grid
└── index.ts                             EDIT — export new components + store

src/routes/__root.tsx                    EDIT — Toaster, username header, UsernameModal,
                                                notFoundComponent
src/index.css                            EDIT — @keyframes fade-in + utility class
```

No new routes. No new shared/ui atoms or organisms (Radix Dialog used directly inside feature
components — the dialog is domain-specific in both cases).

## Zod schemas

```ts
// src/features/quiz/user-store.ts — localStorage rehydration guard
const storedUsernameSchema = z
  .string().trim().min(2).max(30)
  .nullable()
  .catch(null);

// src/features/quiz/components/UsernameModal.tsx — RHF field validation
export const usernameFormSchema = z.object({
  name: z.string().trim()
    .min(2, 'Name must be at least 2 characters')
    .max(30, 'Name must be at most 30 characters'),
});
export type UsernameFormValues = z.infer<typeof usernameFormSchema>;
```

`UserAttempt` already defined in `src/features/quiz/schemas.ts` — no new entity schemas.

## Routes

No new routes.

**Root route change** — add `notFoundComponent`:
```ts
export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootLayout,
  notFoundComponent: NotFoundPage,  // inline function in __root.tsx
});
```

`NotFoundPage` is a small inline component in `__root.tsx` — no props, no feature-specific logic,
no separate file needed.

## Components

### New components

| Component | Layer | Responsibility |
|-----------|-------|----------------|
| `UsernameModal` | `features/quiz/components/` | Radix Dialog wrapping an RHF `name` field. Props: `open: boolean`, `onSubmit: (name: string) => void`. Non-dismissible: `onInteractOutside={(e) => e.preventDefault()}` + `onEscapeKeyDown={(e) => e.preventDefault()}`. Shows validation error inline. |
| `RecentAttempts` | `features/quiz/components/` | Props: `attempts: UserAttempt[]`, `categories: QuizCategory[] \| undefined`. Derives "most recent per category, up to 5" from props (pure computation, no store call inside). Renders a list with category name, formatted date, score, percentage. Contains a Radix Dialog for the "Clear History" confirmation; calls `clearHistory()` from the store on confirm. |

### Modified components

| Component | Change |
|-----------|--------|
| `__root.tsx` | Import `useUserStore`, `UsernameModal` from `@/features/quiz`. Render `<UsernameModal open={!username} ...>` and a separate edit modal (controlled with local `showEdit` state). Add `"Welcome, {username}!"` + Edit button to the `<nav>`. Add `<Toaster richColors position="top-right" />` from sonner before `<Outlet>`. Add inline `NotFoundPage`. |
| `HomePage.tsx` | Below the category grid, render `<RecentAttempts attempts={allAttempts} categories={categories} />` when `allAttempts.length > 0`. Source `allAttempts` from `useQuizHistoryStore((s) => s.attempts)`. |
| `ResultsPage.tsx` | Inside the existing `useEffect` (where `hasRecorded.current` is set), after `addAttempt(...)`, call `toast.success(\`Quiz complete! Score: ${percent}%\`)`. Requires computing `percent` before the effect (move the calc up, or compute inline). |
| `QuizPage.tsx` | Wrap `<QuestionCard>` in a keyed `<div key={currentQuestionIndex}>` with `className="animate-fade-in motion-reduce:animate-none"`. This triggers a CSS remount animation on every question advance. |

## State

**Server state** — none new. Existing `useCategories()` hook reused everywhere.

**Client state — new store `useUserStore`:**

```ts
// src/features/quiz/user-store.ts
interface UserState {
  username: string | null;
  setUsername: (name: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      username: null,
      setUsername: (name) => set({ username: name }),
    }),
    {
      name: 'quiz-username',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.username = storedUsernameSchema.parse(state.username);
        }
      },
    },
  ),
);
```

**Form state** — `UsernameModal` uses `useForm<UsernameFormValues>({ resolver: zodResolver(usernameFormSchema) })`. No `useState` for the form value.

**Local UI state** — `showEdit: boolean` in `__root.tsx` for the edit-name modal (isolated to the component via `useState`, not in a store — it's transient).

## External dependencies

No new installs required — both libraries are already in `package.json`:

| Library | Already installed | Usage |
|---------|------------------|-------|
| `sonner` | ✅ `^1.7.4` | `<Toaster>` in root layout; `toast.success(...)` in ResultsPage |
| `@radix-ui/react-dialog` | ✅ `^1.1.6` | Used directly in `UsernameModal` and `RecentAttempts` (clear confirm) |
| `react-hook-form` | ✅ `^7.75.0` | Form in `UsernameModal` |

## CSS addition — fade-in animation

In `src/index.css`, add inside `@layer components` (or at top level if using `@keyframes`):

```css
@keyframes quiz-fade-in {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}

@layer utilities {
  .animate-fade-in {
    animation: quiz-fade-in 0.2s ease-out both;
  }
}
```

Tailwind's `motion-reduce:animate-none` variant suppresses the animation for users who have
`prefers-reduced-motion: reduce` set in their OS settings.

## Tests

**Unit:**
- `user-store.test.ts`
  - `setUsername` updates `username`
  - Rehydration: `storedUsernameSchema.parse` normalises invalid localStorage values to `null`
  - Rehydration: too-short / too-long strings parsed to `null`

**Integration:**
- `UsernameModal.test.tsx`
  - Modal is open when `open=true`; calling `onSubmit` does not happen for invalid values
  - Validation error shown for name < 2 chars
  - Pressing Escape does not close the modal
  - Valid submit calls `onSubmit` with trimmed name
- `RecentAttempts.test.tsx`
  - Renders one row per category (most recent), up to 5
  - Shows category name, score/%, formatted date
  - "Clear History" button opens confirmation dialog
  - Confirming calls `clearHistory`; dismissing does not

**Integration updates (existing tests):**
- `ResultsPage.test.tsx` — add one test: toast is triggered after mount with correct score %
  (mock `sonner` via `vi.mock('sonner')` to avoid DOM Toaster requirement)

**E2E — none new.** The existing `e2e/quiz-flow.spec.ts` covers the happy path. The 404 and
username prompt are edge cases not critical enough for a new E2E spec.

## Risks / points of attention

- **`__root.tsx` growing complexity**: this file will now import from `features/quiz` (for the
  username modal and store) and render Sonner's `<Toaster>`. Keep imports minimal and the inline
  `NotFoundPage` short. If the file grows past 80 lines, extract `RootLayout` to a separate file.
- **Non-dismissible Radix Dialog**: Radix Dialog fires `onOpenChange(false)` on Escape AND
  backdrop click. The modal must keep `open` controlled externally (`open={!username}`) AND call
  `e.preventDefault()` on both `onEscapeKeyDown` and `onInteractOutside`. Both are needed —
  `onOpenChange` alone is not enough.
- **Toast inside `useEffect`**: `toast.success(...)` in `ResultsPage.tsx` is inside the existing
  `hasRecorded.current` guard — it fires exactly once. `percent` must be computed before the
  effect, or inline inside it, to avoid a stale-closure bug.
- **`derive recent attempts` logic**: the component receives raw `attempts` and computes the
  "most recent per category" grouping locally. The key steps are: group by `categoryId`, take max
  by `completedAt` per group, sort groups by that max date desc, take first 5. This is a pure
  function and should be extracted and unit-tested separately.
- **`motion-reduce:animate-none`** requires Tailwind v4 to have the `motion-reduce` variant
  enabled. Confirm it works in a browser — the CSS spec for this is well-supported in Chromium.
- **Sonner `<Toaster>` placement**: must be a sibling of `<Outlet>`, not inside it, so that
  toasts from any page are rendered at the root level.

## Identified reuse

- `persist` middleware pattern → copy from `src/features/quiz/store.ts`
- `onRehydrateStorage` Zod guard → identical pattern to `store.ts`, apply to `user-store.ts`
- `zodResolver` + RHF pattern → copy from `src/features/todos/components/TodoForm.tsx`
- `useQuizHistoryStore` selector pattern → existing `attempts` array already exposed; no new
  store actions needed for the list (`clearHistory()` already exists)
- `@radix-ui/react-dialog` → already a `package.json` dependency; no shadcn wrapper exists yet
  for it, so use Radix primitives directly inside the two feature components
