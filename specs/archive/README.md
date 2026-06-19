# Archive

Completed specs (`Status: done`) older than 30 days and abandoned specs (`Status: abandoned`) live here to keep `specs/` lean without losing history.

## Structure

Grouped by quarter of the completion date (or last activity, in the case of abandoned):

```
specs/archive/
├── 2026-Q1/
│   ├── 001-text-filter/
│   └── 002-favorites/
├── 2026-Q2/
│   └── 003-csv-export/
└── 2025-Q4/
    └── ...
```

## When to archive

- `Status: done` for more than 30 days.
- `Status: abandoned` at any time.
- Spec that lost relevance (feature was removed from the product).

## How to archive

Use the slash command `/specs-archive [NNN-slug]` or move manually:

```bash
mkdir -p specs/archive/$(date +%Y)-Q$(( ($(date +%m) - 1) / 3 + 1 ))
mv specs/NNN-slug specs/archive/2026-Q1/
```

Then regenerate `specs/INDEX.md` via `/specs-index`.

## Searching archives

The AI still has access via `grep`/`rg` when it needs historical context. Example: when planning a feature similar to an old one, search for keywords in `specs/archive/`.
