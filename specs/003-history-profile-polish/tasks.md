# Tasks: Attempt History, User Profile, and Visual Polish

**Plan:** ./plan.md

Check tasks with `[x]` when done. Maintain order — dependencies flow top to bottom.

---

## Username store

- [x] T010 Create `src/features/quiz/user-store.ts`:
  - `interface UserState { username: string | null; setUsername: (name: string) => void }`
  - `useUserStore` = `create<UserState>()(persist(..., { name: 'quiz-username' }))`
  - `onRehydrateStorage` guard: `storedUsernameSchema = z.string().trim().min(2).max(30).nullable().catch(null)`
  - Export: `useUserStore`
- [x] T011 Create `src/features/quiz/user-store.test.ts` — unit tests:
  - `setUsername('Alice')` → `username === 'Alice'`
  - `storedUsernameSchema.parse('x')` → `null` (too short)
  - `storedUsernameSchema.parse('a'.repeat(31))` → `null` (too long)
  - `storedUsernameSchema.parse(null)` → `null`
  - `storedUsernameSchema.parse('Alice')` → `'Alice'`
- [x] T012 Verify: `npm test -- user-store` passes

## CSS animation

- [x] T020 Add `@keyframes quiz-fade-in` + `.animate-fade-in` utility to `src/index.css`:
  ```css
  @keyframes quiz-fade-in {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @layer utilities {
    .animate-fade-in { animation: quiz-fade-in 0.2s ease-out both; }
  }
  ```
  Verify: `npm run typecheck` passes (CSS has no TS impact, but confirms no Vite parse error)

## Quiz page — question transition

- [x] T030 Edit `src/features/quiz/components/QuizPage.tsx`:
  - Wrap `<QuestionCard ... />` in `<div key={currentQuestionIndex} className="animate-fade-in motion-reduce:animate-none">`
  - Run `npm run lint:fix` on the file

## Results page — completion toast

- [x] T040 Edit `src/features/quiz/components/ResultsPage.tsx`:
  - `import { toast } from 'sonner'`
  - Inside the `useEffect` where `hasRecorded.current = true` is set, compute `percent` inline:
    `const pct = category.questions.length === 0 ? 0 : Math.round((score / category.questions.length) * 100)`
  - After `addAttempt(...)`, call `toast.success(\`Quiz complete! Score: ${pct}%\`)`
  - Run `npm run lint:fix` on the file
- [x] T041 Add toast test to `src/features/quiz/components/ResultsPage.test.tsx`:
  - `vi.mock('sonner', () => ({ toast: { success: vi.fn() } }))`
  - Test: after mount with active session + categories loaded, `toast.success` called once with
    a string containing the score percentage
  - Verify: `npm test -- ResultsPage` passes

## `UsernameModal` component

- [x] T050 Create `src/features/quiz/components/UsernameModal.tsx`:
  - Props: `open: boolean`, `onSubmit: (name: string) => void`
  - Uses `@radix-ui/react-dialog` primitives directly (no shared/ui wrapper)
  - `<Dialog.Root open={open}>` — controlled, no `onOpenChange`
  - `<Dialog.Content onEscapeKeyDown={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()}`
  - RHF: `useForm<UsernameFormValues>({ resolver: zodResolver(usernameFormSchema) })`
  - `usernameFormSchema = z.object({ name: z.string().trim().min(2, '...').max(30, '...') })`
  - Export `usernameFormSchema` and `UsernameModal`
  - `handleSubmit`: calls `onSubmit(data.name)` then `reset()`
  - Shows `errors.name.message` inline under the input
  - Run `npm run lint:fix` on the file
- [x] T051 Create `src/features/quiz/components/UsernameModal.test.tsx`:
  - Render helper: `renderWithProviders(<UsernameModal open={true} onSubmit={spy} />)`
    (wraps with Router via `createMemoryHistory` + minimal `createRootRoute`)
  - Modal content visible when `open=true`
  - Submitting empty → validation error shown, `onSubmit` not called
  - Submitting 1-char name → validation error shown
  - Pressing Escape → modal stays open (event is prevented)
  - Valid name ('Alice') → `onSubmit` called with `'Alice'`
- [x] T052 Verify: `npm test -- UsernameModal` passes

## `RecentAttempts` component

- [x] T060 Create `src/features/quiz/components/get-recent-attempts.ts` — pure helper:
  - `getRecentAttempts(attempts: UserAttempt[], maxCategories = 5): UserAttempt[]`
  - Groups by `categoryId`, picks the most recent (max `completedAt`) per group
  - Sorts groups by that date descending, returns up to `maxCategories` entries (one per group)
- [x] T061 Create `src/features/quiz/components/get-recent-attempts.test.ts` — unit tests:
  - Returns empty array when `attempts` is empty
  - Returns one entry per category (the most recent)
  - Caps at 5 categories even if more are present
  - Sorts by most-recent-attempt date descending (newest category first)
  - Single attempt → returned as-is
- [x] T062 Verify: `npm test -- get-recent-attempts` passes
- [x] T063 Create `src/features/quiz/components/RecentAttempts.tsx`:
  - Props: `attempts: UserAttempt[]`, `categories: QuizCategory[] | undefined`
  - Uses `getRecentAttempts(attempts)` to derive the display list
  - Renders an `<ol>` of entries: category title (from `categories` lookup, fallback to `categoryId`),
    formatted date (`new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(completedAt))`),
    `score / total`, `percent%`
  - "Clear History" `<button>` opens an inline confirmation `<Dialog.Root>` from
    `@radix-ui/react-dialog`; on confirm calls `useQuizHistoryStore((s) => s.clearHistory)()`
  - Local `useState<boolean>` for `confirmOpen`
  - Run `npm run lint:fix` on the file
- [x] T064 Create `src/features/quiz/components/RecentAttempts.test.tsx`:
  - Render with 3 attempts across 2 categories → 2 rows visible (most recent per category)
  - Shows category title, score, percentage
  - Shows formatted date string
  - With 6 categories → only 5 rows rendered
  - "Clear History" button → opens confirmation dialog
  - Confirming → `clearHistory` called once
  - Cancelling → `clearHistory` not called
- [x] T065 Verify: `npm test -- RecentAttempts` passes

## Home page — recent attempts section

- [x] T070 Edit `src/features/quiz/components/HomePage.tsx`:
  - Add `const allAttempts = useQuizHistoryStore((s) => s.attempts)`
  - Below the category grid, conditionally render:
    ```tsx
    {allAttempts.length > 0 && (
      <RecentAttempts attempts={allAttempts} categories={categories} />
    )}
    ```
  - Import `RecentAttempts` from `@/features/quiz/components/RecentAttempts`
  - Run `npm run lint:fix` on the file

## Root layout — header, modals, Toaster, 404

- [x] T080 Edit `src/routes/__root.tsx` — add all four concerns in one task (they share the same file):
  - **Toaster**: `import { Toaster } from 'sonner'`; render `<Toaster richColors position="top-right" />` inside `RootLayout`, before `<main>`
  - **Username store**: `import { useUserStore, UsernameModal } from '@/features/quiz'`; read `username` + `setUsername`; add local `const [showEdit, setShowEdit] = useState(false)`
  - **Header greeting**: in `<nav>`, after the logo `<Link>`, render:
    ```tsx
    {username && (
      <span className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
        Welcome, {username}!
        <button type="button" onClick={() => setShowEdit(true)} className="underline hover:text-foreground">Edit</button>
      </span>
    )}
    ```
  - **Modals**: render `<UsernameModal open={!username} onSubmit={(name) => setUsername(name)} />` and
    `<UsernameModal open={showEdit} onSubmit={(name) => { setUsername(name); setShowEdit(false); }} />`
    inside `RootLayout`, after the `<main>`
  - **404**: add `notFoundComponent: NotFoundPage` to `createRootRouteWithContext()(...)`;
    define `function NotFoundPage()` inline — heading "Page not found", `<Link to="/">Back to Home</Link>`
  - Run `npm run lint:fix` on the file
  - Verify: `npm run typecheck` passes

## Feature index

- [x] T090 Update `src/features/quiz/index.ts` — add exports:
  - `export { useUserStore } from '@/features/quiz/user-store'`
  - `export { UsernameModal } from '@/features/quiz/components/UsernameModal'`
  - `export { RecentAttempts } from '@/features/quiz/components/RecentAttempts'`
  - Run `npm run lint:fix` on the file

## Smoke test

- [x] T100 Verify: `npm run dev` — open `/`, navigate to a quiz, complete it, confirm:
  - Username modal appears on first visit
  - "Welcome, [name]!" in header after submitting
  - Toast fires on results page
  - Question fade-in visible when advancing
  - Recent Attempts section appears after first quiz
  - Navigate to `/nonexistent` → 404 page with "Back to Home" link

## Integration tests — full suite

- [x] T110 Verify: `npm run lint:fix` — no remaining issues
- [x] T111 Verify: `npm run typecheck` — zero errors
- [x] T112 Verify: `npm test` — all tests green (target: existing 68 + new tests)

## Polish

- [x] T120 Update `specs/003-history-profile-polish/spec.md` → `Status: done`
- [x] T121 Update `specs/INDEX.md` — move 003 from "Approved" to "Done"
