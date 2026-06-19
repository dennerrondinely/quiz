---
description: Executes the next pending task from the current tasks.md following .ai/rules.
argument-hint: [NNN-slug optional; default = last feature with an open tasks.md]
---

Execute the next pending task.

## Steps

1. Determine the target feature (same logic as `/plan`).
2. Read `tasks.md` and identify the first `[ ]` (unchecked) task.
3. Mandatory reads:
   - `spec.md` and `plan.md` of the feature (context)
   - The `.ai/rules/` relevant for this task (component → react-patterns + tailwind; schema → typescript; test → testing)
   - Relevant templates in `.ai/templates/`
4. Implement the task. Reuse existing helpers (`@/shared/lib/cn`, `@/shared/lib/http`, `@/shared/ui/*`) whenever possible.
5. Run the task's verification criterion (build, lint, test as applicable).
6. Mark the task as `[x]` in `tasks.md` and stop. **Do not execute the next task without human confirmation.**

## Rules

- One execution = one task. No batching.
- If the task is blocked by something not anticipated in the plan, **STOP** and report to the human. Don't invent a solution.
- If during implementation you need to edit something outside the current task's scope (refactor `shared/`, add a dependency), stop and ask first.
- Before finishing, run `npm run lint:fix` on the touched file(s).
