# Feature template

Complete feature skeleton following `.ai/rules/architecture.md`.

## How to use (manually or via agent)

1. Copy the entire contents of `.ai/templates/feature.template/` to `src/features/<your-feature>/`.
2. Replace `{{Name}}` (PascalCase, e.g. `Order`) and `{{name}}` (camelCase, e.g. `order`).
3. Add the route in `src/routes/<your-feature>.tsx` using `page.template.tsx`.
4. Implement the TODOs in order: schemas → api → hooks → components → page.

## Structure

```
<feature>/
├── api.ts            # HTTP calls
├── schemas.ts        # Zod schemas + types
├── store.ts          # Zustand UI state (optional)
├── hooks/
│   └── use{{Name}}.ts
├── components/
│   ├── {{Name}}Form.tsx
│   ├── {{Name}}List.tsx
│   └── {{Name}}Page.tsx
└── index.ts          # public API
```
