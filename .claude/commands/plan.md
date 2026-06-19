---
description: From the current spec.md, generates the technical plan.md (HOW) following .ai/rules/architecture.md.
argument-hint: [NNN-slug optional; default = last spec without plan.md]
---

Generate the technical plan for the spec.

## Steps

1. Determine which spec to use:
   - If `$ARGUMENTS` was passed, use `specs/$ARGUMENTS/spec.md`.
   - Otherwise, find the most recent spec (highest NNN) that does NOT have a `plan.md`.
2. **Mandatory reads** before generating:
   - The feature's `spec.md`
   - `.ai/rules/architecture.md`
   - `.ai/rules/react-patterns.md`
   - `.ai/rules/typescript-rules.md`
3. List `src/features/` and `src/shared/` to identify what already exists and can be reused.
4. Resolve or ask about every `[NEEDS CLARIFICATION: ...]` before continuing.
5. Write `specs/NNN-slug/plan.md` following the structure below.

## Required plan.md structure

```markdown
# Plan: <Feature Title>

**Spec:** ./spec.md
**Created:** YYYY-MM-DD

## Technical summary

Single sentence describing the approach.

## Proposed structure

src/features/<feature>/
├── api.ts (or Orval generation — cite)
├── schemas.ts
├── hooks/use<Name>.ts
├── store.ts (if needed)
├── components/<Name>Page.tsx
├── components/<Name>Form.tsx
├── components/<Name>List.tsx
└── index.ts

src/routes/<path>.tsx

## Zod schemas

Define the shape of each entity and input. Cite validations.

## Routes

- `/<path>` → `<Name>Page`
- Search params validated? (with Zod schema)
- Loaders? (TanStack Router)

## Components

List with each component's responsibility. Identify which come from `shared/ui` (shadcn) vs new ones.

## State

- Server state: queries/mutations + keys
- Client state: store (if applicable)
- Form state: RHF schema + zodResolver

## External dependencies

New libs? Justify. Prefer reusing.

## Tests

- Unit (which functions/schemas)
- Integration (which components + MSW handlers)
- E2E (which critical flow, if any)

## Risks / points of attention

- ...

## Identified reuse

- `src/shared/<x>` already exists — use it
- `src/features/<y>` has similar pattern — copy approach from `<file>`
```

## Rules

- The plan respects import rules from `.ai/rules/architecture.md`. If the feature needs something cross-feature, elevate to `shared/`.
- Don't invent API. If the spec doesn't say, use a placeholder and mark `[ASSUMPTION: ...]`.
- After creating, do NOT run `/tasks` automatically — the human reviews the plan first.
