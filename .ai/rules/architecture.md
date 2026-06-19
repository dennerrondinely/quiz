# Architecture

Model: **feature-sliced** with explicit layers. Every new capability lives in `src/features/<feature>/`.

## Layers

```
src/
├── app/         # bootstrap (providers, router, query client). Only place for global side effects.
├── routes/      # TanStack Router file-based. Only adapts route → feature.
├── features/    # business modules. Self-contained.
│   └── <name>/
│       ├── api.ts             # feature HTTP calls (or re-export from generated/)
│       ├── schemas.ts         # Zod schemas + inferred types
│       ├── hooks/             # useXxx — Query/Mutation/derived state
│       ├── store.ts           # Zustand UI state (optional)
│       ├── components/        # feature components (Page at the top)
│       └── index.ts           # public API — export only what's needed
└── shared/      # reusable across features
    ├── ui/      # design system — Atomic Design
    │   ├── atoms/      # shadcn/Radix primitives (Button, Input, Label, Card…)
    │   ├── molecules/  # atom compositions with no business logic (InputWithLabel…)
    │   └── organisms/  # complex reusable sections (ConfirmDialog, DataTable…)
    ├── lib/     # http, env, cn, formatters
    ├── api/     # mutator + generated/ (Orval)
    └── hooks/   # useDebounce, useMediaQuery etc — no business logic
```

## Import rules (ENFORCEABLE)

1. `features/A` **NEVER** imports from `features/B`. Share via `shared/` or elevate to `app/`.
2. `shared/` **NEVER** imports from `features/`.
3. `routes/` imports only from `features/<name>` (via `index.ts`) and `shared/`.
4. `app/` orchestrates; may import from anything.
5. Externally, always via the feature's `index.ts`: `import { TodosPage } from '@/features/todos'`.

Violating this usually means you're doing a cross-feature import or something needs to be promoted to `shared/`.

## Data layer

- **Server state**: TanStack Query. Hooks in `features/<name>/hooks/`. Hierarchical query keys: `['todos', 'list']`, `['todos', 'detail', id]`. Centralize in `todosKeys`.
- **Global client state**: Zustand. One store per feature in `store.ts`. No cross-store.
- **Form state**: React Hook Form + zodResolver. Never control inputs with `useState`.
- **URL state**: TanStack Router search params (with Zod schema). Never `useState` for something that should be in the URL.

## Type generation (Orval)

- Spec in `openapi.yaml` (root) → `npm run api:gen` → `src/shared/api/generated/`.
- Generated hooks (`useGetTodos`, `useCreateTodo`) and Zod schemas (`getGetTodosResponse`).
- Use generated hooks instead of writing `api.ts` manually whenever there is an OpenAPI spec.
- The `features/todos/api.ts` example is didactic — in production, drop it and use Orval hooks.

## Naming

- Files: `kebab-case.ts` for utils, `PascalCase.tsx` for components.
- Hooks: `useXxx`.
- Stores: `useXxxStore` or `useXxxUiStore` (when it's pure UI state).
- Schemas: `xxxSchema`, type: `Xxx`.
- Query keys: factory exported as `xxxKeys`.

## Atomic Design in shared/ui

| Layer | What goes in | What does NOT go in |
|-------|-------------|---------------------|
| `atoms/` | shadcn/Radix primitives: Button, Input, Label, Badge, Avatar… | Atom compositions |
| `molecules/` | Atom compositions with no business logic: InputWithLabel… | API calls, stores, queries |
| `organisms/` | Complex reusable sections, may have local UI state | Business logic, queries |
| `features/` | Anything with domain-specific logic | — |

**Import rules for shared/ui:**

- Consumers (`features/`, `routes/`) → always `import { X } from '@/shared/ui'` (general barrel)
- Molecules → may import from `@/shared/ui/atoms` (internal cross-sublayer import)
- Organisms → may import from `@/shared/ui/atoms` and `@/shared/ui/molecules`
- Atoms → no imports from `shared/ui` (they are pure, no internal dependencies)

**NEVER** import from a sublayer directly outside `shared/ui/`: `@/shared/ui/atoms/button` is an internal import; consumers use `@/shared/ui`.

**Decision guide — where to place a new shared component:**

1. Single element, doesn't compose other shared/ui? → `atoms/`
2. Combines existing atoms, no business logic? → `molecules/`
3. Complex reusable section (may have local UI state)? → `organisms/`
4. Has domain logic or calls an API? → `features/<name>/components/`

## Default decisions

- **Where does this code belong?** If it's feature-specific → inside the feature. If 2+ features use it → `shared/`. If it's provider orchestration → `app/`.
- **Should I create a new feature?** Yes, if it has its own route AND its own business entity. No, if it's just a reusable component.
- **Can I skip `index.ts`?** No. It's the feature's contractual boundary.
