---
description: Moves a done/abandoned spec to specs/archive/YYYY-Qn/. Regenerates INDEX.md at the end.
argument-hint: [NNN-slug] (optional; if omitted, lists candidates)
---

Archive a completed or abandoned spec.

## Steps

1. **Determine the target**:
   - If `$ARGUMENTS` was passed, the target is `specs/$ARGUMENTS/`.
   - Otherwise, list ALL specs in `specs/NNN-*/` whose `Status:` is `done` (and whose `Created:` is > 30 days ago) or `abandoned`. Show the list and STOP — ask the user to choose.

2. **Determine the destination**:
   - Read the spec's `Status:` and `Created:`.
   - Calculate the quarter based on **today** (archiving date), in the format `YYYY-Q[1-4]`.
   - Destination: `specs/archive/YYYY-Qn/NNN-slug/`.

3. **Validate**:
   - Spec must have `Status: done` or `Status: abandoned`.
   - If `Status: done`, require `Created:` to be more than 30 days ago (or warn and confirm with the human).
   - If the destination folder doesn't exist, create it.
   - If a folder with the same name already exists at the destination, ABORT and report the conflict.

4. **Move**:
   - `mv specs/NNN-slug specs/archive/YYYY-Qn/NNN-slug`
   - Use `git mv` if the repo is git-tracked (preserves history).

5. **Regenerate the index**:
   - Run the steps from the `/specs-index` command (don't delegate the call — execute the regeneration directly).

6. **Report**:
   - Source and destination paths.
   - How many specs are still active in `specs/`.

## Rules

- NEVER archive a spec with `Status: in-progress`, `draft`, or `approved` without explicit confirmation.
- Do NOT alter the spec.md content when moving (only the path changes).
- Do NOT delete anything — only move.
