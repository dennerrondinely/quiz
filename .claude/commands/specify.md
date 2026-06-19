---
description: Creates a new spec (WHAT + WHY) in specs/NNN-slug/spec.md from a free-form description.
argument-hint: <feature description in natural language>
---

Create a new spec following the Spec-Driven Development standard.

Feature description: $ARGUMENTS

## Steps

1. List `specs/` AND `specs/archive/` recursively. Next NNN = `max(NNN existing in both) + 1`, zero-padded to 3 digits.
2. Generate a short kebab-case slug from the description.
3. Create the directory `specs/NNN-<slug>/`.
4. Write `specs/NNN-<slug>/spec.md` following the structure below.
5. Update `specs/INDEX.md` adding the new entry in the "Draft" section (keeping descending order by NNN).
6. Report the created path and the uncertainty points marked as `[NEEDS CLARIFICATION: ...]`.

## Required spec.md structure

```markdown
# Feature: <Title>

**Status:** draft
**Created:** YYYY-MM-DD

## Why

Problem or opportunity this feature solves. Who is impacted? What is the current pain?

## What (scope)

What is part of this feature in user/business language. **No technical solution.**

### In scope
- ...

### Out of scope
- ...

## User stories

- As a <role>, I want <action>, so that <benefit>.

## Acceptance criteria

Concrete and testable Given/When/Then scenarios.

- **Scenario X**: GIVEN ... WHEN ... THEN ...

## Constraints and assumptions

- Explicit assumptions
- Known technical limits (compliance, perf, a11y)

## Points to clarify

- [NEEDS CLARIFICATION: specific question for the decision-maker]
```

## Rules

- Spec is WHAT + WHY. Do not write HOW (no routes, schemas, component names).
- Mark any ambiguity with `[NEEDS CLARIFICATION: ...]` instead of assuming.
- Use language that a non-technical stakeholder can understand.
- After creating, do NOT run `/plan` automatically — wait for the human to review the spec first.
