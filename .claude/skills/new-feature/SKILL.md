---
name: new-feature
description: Use when the user asks to "create a feature", "add new functionality", or similar. Leads the full SDD cycle specify → plan → tasks → implement with human pauses between phases.
---

# Skill: new-feature

Leads a new feature from scratch following Spec-Driven Development.

## When to use

- "Create a feature for X"
- "Add functionality Y"
- "I want to implement Z"

## Phases (STOP BETWEEN EACH — human validates)

### 1. Specify
Use the slash command `/specify <description>` or the `spec-writer` agent.
Output: `specs/NNN-slug/spec.md`.
**STOP.** Ask the human to review and answer the `[NEEDS CLARIFICATION]` items.

### 2. Plan
After spec is approved, use `/plan` or the `plan-writer` agent.
Output: `specs/NNN-slug/plan.md`.
**STOP.** Human reviews structure, schemas, technical choices.

### 3. Tasks
After plan is approved, use `/tasks`.
Output: `specs/NNN-slug/tasks.md` with a checklist.
**STOP.** Human reviews task granularity.

### 4. Implement (loop)
For each pending task:
1. Use `/implement` (executes ONE task, marks as `[x]`).
2. Report result (files created, lint/test status).
3. Wait for human to say "next".
4. If task failed: STOP and report; don't try the next one.

### 5. Review
Before marking the feature as done, invoke the `code-reviewer` agent on the accumulated diff.

### 6. Done
- Mark `spec.md` as `Status: done`.
- Update `CLAUDE.md` if a new pattern was introduced.
- Suggest a commit message (don't run `git commit` without confirmation).

## Principles

- Don't skip phases. Especially don't skip the spec.
- Don't combine phases in a single turn. The value of SDD comes from the pauses.
- Always cite what was reused from `shared/` or other features (anti-duplication).
- If the request is trivial (one-line change, visual tweak), DISMISS this skill — it's not worth the overhead.

## When NOT to use

- Small bug fix → do it directly.
- Refactor with no behavior change → no spec needed.
- Copy/text change → do it directly.
