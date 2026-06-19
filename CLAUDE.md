# CLAUDE.md

Instructions for any AI agent (Claude Code, Cursor, Copilot, etc.) working in this repo.

## Before writing code, read

1. `.ai/rules/frontend-rules.md` — general principles, a11y, performance
2. `.ai/rules/architecture.md` — feature-sliced, import rules
3. `.ai/rules/react-patterns.md` — server vs client state, RHF, Zustand
4. `.ai/rules/tailwind-rules.md` — v4 tokens, `cn()`, CVA
5. `.ai/rules/typescript-rules.md` — strict, no `any`, Zod-first
6. `.ai/rules/testing-rules.md` — Vitest + MSW + Playwright

## Before creating a new file, copy from

`.ai/templates/`:
- `component.template.tsx` — standalone component
- `page.template.tsx` — TanStack Router route
- `hook.template.ts` — query/mutation
- `store.template.ts` — Zustand
- `feature.template/` — full feature skeleton
- `component.test.template.tsx` — integration test
- `e2e.template.spec.ts` — Playwright test

## To create a new feature, use SDD

```
/specify "description"   →   specs/NNN-slug/spec.md
/plan                    →   specs/NNN-slug/plan.md
/tasks                   →   specs/NNN-slug/tasks.md
/implement               →   executes ONE task at a time
```

See `specs/README.md`, `specs/INDEX.md` (status overview) and `specs/000-example/` as reference. Or invoke the `new-feature` skill.

### specs/ maintenance

- `/specs-index` — regenerates `specs/INDEX.md`.
- `/specs-archive [NNN-slug]` — moves a done/abandoned spec to `specs/archive/YYYY-Qn/`.

## Available agents

| Agent | When to use |
|-------|-------------|
| `component-builder` | Create a new component (feature or shared/ui) |
| `code-reviewer` | Review code before commit/PR |
| `ui-reviewer` | Audit visual quality, a11y, and Figma divergences |
| `spec-writer` | Write a feature spec |
| `plan-writer` | Write an implementation plan |

### Figma MCP (optional)

The `ui-reviewer` agent supports direct Figma connection to compare implementation vs. design:

1. Copy `.claude/settings.local.json.example` → `.claude/settings.local.json`
2. Generate a token at figma.com → Account Settings → Personal access tokens
3. Replace `figd_REPLACE_WITH_YOUR_TOKEN` with the generated token
4. `settings.local.json` is in `.gitignore` — never commit the token

## Essential commands

```bash
npm run dev          # Vite dev server (port 5173)
npm run build        # production build
npm test             # Vitest unit + integration
npm run e2e          # Playwright
npm run lint         # Biome check (including custom GritQL rules)
npm run lint:fix     # auto-fix
npm run typecheck    # tsc --noEmit
npm run api:gen      # Orval: openapi.yaml → src/shared/api/generated
```

## Folder structure

```
.ai/                 # rules + templates for AI
.claude/             # slash commands, agents, skills, settings
specs/               # SDD: NNN-slug/{spec,plan,tasks}.md
tools/lint-rules/    # GritQL plugins for Biome
src/
├── app/             # bootstrap (providers, router, query client)
├── routes/          # TanStack Router file-based
├── features/        # business modules (feature-sliced)
└── shared/
    ├── ui/          # design system (Atomic Design: atoms/ molecules/ organisms/)
    ├── lib/         # http, env, cn, formatters
    ├── api/         # mutator + generated/ (Orval)
    └── hooks/       # generic hooks with no business logic
e2e/                 # Playwright
```

## Key rules (summary)

- **Server state in TanStack Query**, never `useState` for API data.
- **Zod schemas are the source of truth** — types come via `z.infer`.
- **No `any`** — use `unknown` + Zod parse.
- **Tailwind tokens from `@theme`**, no hardcoded colors.
- **`features/A` never imports from `features/B`** — if needed, elevate to `shared/`.
- **Every feature exports via `index.ts`**.
- **Accessibility is not optional** (roles, aria-*, keyboard navigation).

## Commit conventions

[Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` new feature
- `fix:` bug fix
- `refactor:` reorganization with no behavior change
- `test:` tests only
- `docs:` documentation only
- `chore:` infra/deps

## When to ask instead of assuming

- API contract change → regenerate via Orval, do not mock types manually.
- Adding a dependency > 50KB gzip → ask first.
- Lint rule bypass → ask and justify in the PR.
- Breaking an architecture boundary → ask first (usually a sign something should be promoted to `shared/`).

## About this template

This repo is a template. When cloning for a new project:
1. Rename in `package.json`.
2. Replace `openapi.yaml` with your real contract.
3. Update `.env.example` and `src/shared/lib/env.ts` with real vars.
4. Delete `specs/000-example/` and `src/features/todos/` when starting your first real feature.
