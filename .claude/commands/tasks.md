---
description: From plan.md, generates tasks.md with an executable step-by-step checklist.
argument-hint: [NNN-slug optional; default = last spec with plan.md but without tasks.md]
---

Break the plan into executable tasks.

## Steps

1. Determine which feature to use (same logic as `/plan`).
2. Read `plan.md`.
3. Write `specs/NNN-slug/tasks.md` in the format below.

## Required tasks.md structure

```markdown
# Tasks: <Title>

**Plan:** ./plan.md

Check tasks with `[x]` when done. Maintain order — dependencies flow top to bottom.

## Setup
- [ ] T001 Create folder structure `src/features/<feature>/`
- [ ] T002 Create feature `index.ts`

## Schemas and types
- [ ] T010 `schemas.ts` — Zod schemas (reference plan §Schemas)
- [ ] T011 Verify: `npm run typecheck`

## API
- [ ] T020 Implement `api.ts` (OR run `npm run api:gen` if OpenAPI exists)
- [ ] T021 MSW handler in `src/test/msw/handlers.ts` for the new route

## Hooks
- [ ] T030 `hooks/use<Name>.ts` — query keys factory + Query/Mutation
- [ ] T031 Unit test for the hook (if there is non-trivial logic beyond Query)

## Store (if applicable)
- [ ] T040 `store.ts` — Zustand UI state

## Components
- [ ] T050 `components/<Name>Form.tsx` (RHF + zodResolver)
- [ ] T051 `components/<Name>List.tsx`
- [ ] T052 `components/<Name>Page.tsx`
- [ ] T053 Integration test for `<Name>Form` (validation + submit happy path)

## Route
- [ ] T060 `src/routes/<path>.tsx`
- [ ] T061 Verify: `npm run dev` and open the route

## E2E (if critical)
- [ ] T070 `e2e/<feature>.spec.ts` covering the main flow

## Polish
- [ ] T080 `npm run lint:fix`
- [ ] T081 `npm run typecheck`
- [ ] T082 `npm test`
- [ ] T083 Update `spec.md` to `Status: done`
```

## Rules

- Each task is small (15-45 min of work).
- Each task must have a verifiable criterion (file created, command passes, test green).
- If a spec task seems too large, break it down.
- Don't skip the testing phase — it's in the plan by design.
