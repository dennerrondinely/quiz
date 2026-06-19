# ai-react-starter

React/Vite template optimized for AI-assisted development with **Spec-Driven Development**.

## Stack

| Layer | Tool |
|-------|------|
| Framework | React 19 + Vite 8 (SWC) |
| Language | TypeScript 6 (strict) |
| Routing | TanStack Router (file-based) |
| Data fetching | TanStack Query + Axios + axios-retry |
| Type generation | Orval (OpenAPI → Zod + Query hooks) |
| Validation | Zod 4 |
| Forms | React Hook Form + zodResolver |
| Styling | Tailwind CSS v4 (CSS-first) + shadcn/ui + Radix + CVA |
| Icons | lucide-react |
| Client state | Zustand |
| Toasts | Sonner |
| Unit/integration tests | Vitest + Testing Library + MSW |
| E2E tests | Playwright |
| Lint + format | Biome (with custom GritQL plugins) |
| Git hooks | Husky + lint-staged |

## Quick start

```bash
npm install
npx playwright install --with-deps chromium    # first time only
npm run dev                                    # http://localhost:5173
```

Environment variables: copy `.env.example` to `.env`.

## What makes this template different

### 1. AI-ready rules (`.ai/rules/`)
6 short documents covering architecture, React, Tailwind, TypeScript, testing, and general principles. Any agent reads them before generating code.

### 2. Code templates (`.ai/templates/`)
Ready-made skeletons with `{{Name}}` placeholders. AI copies and adapts instead of reinventing.

### 3. Spec-Driven Development (`specs/`)
Every feature goes through `spec.md` (what/why) → `plan.md` (how) → `tasks.md` (step-by-step) before any code is written. Slash commands `/specify /plan /tasks /implement` automate the cycle. See `specs/000-example/` for a complete reference.

### 4. Customizable lint rules (`tools/lint-rules/`)
GritQL plugins for Biome — example: preventing direct `import axios` outside the shared wrapper.

### 5. `.claude/` configured
Settings with sensible permissions, SDD slash commands, agents (component-builder, spec-writer, plan-writer, code-reviewer) and the `new-feature` skill.

## Structure

```
.ai/
├── rules/              # documents the AI must read
└── templates/          # code skeletons

.claude/
├── settings.json       # tool permissions
├── commands/           # slash commands (/specify, /plan, /tasks, /implement)
├── agents/             # specialized subagents
└── skills/             # high-level workflows (new-feature)

specs/
├── README.md
└── 000-example/        # complete reference feature

tools/
└── lint-rules/         # GritQL plugins for Biome

src/
├── app/                # bootstrap: providers, router, query client
├── routes/             # TanStack Router file-based
├── features/           # business modules (feature-sliced)
│   └── todos/          # example
├── shared/
│   ├── ui/             # design system (shadcn/ui)
│   ├── lib/            # http, env, cn
│   ├── api/            # mutator + generated/ (Orval)
│   └── hooks/
└── test/               # Vitest setup + MSW handlers

e2e/                    # Playwright specs
```

## Scripts

```bash
npm run dev              # dev server
npm run build            # prod build (tsc + vite)
npm run preview          # preview the build
npm test                 # Vitest run
npm run test:watch       # Vitest watch
npm run test:ui          # Vitest UI
npm run test:cov         # coverage
npm run e2e              # Playwright
npm run e2e:ui           # Playwright UI
npm run lint             # Biome check
npm run lint:fix         # Biome check --write
npm run format           # Biome format
npm run typecheck        # tsc --noEmit
npm run api:gen          # Orval: openapi.yaml → src/shared/api/generated/
```

## How to create a new feature

1. `/specify "I want to allow user X to do Y so that Z"`
2. Review `specs/NNN-slug/spec.md`. Answer any `[NEEDS CLARIFICATION]` items.
3. `/plan` → review the technical structure in `plan.md`.
4. `/tasks` → review task granularity in `tasks.md`.
5. `/implement` (runs ONE task; repeat N times).
6. Commit: `feat: NNN-slug — short description`.

See `CLAUDE.md` and `.ai/rules/` for the full set of conventions.

## Adapting for your project

- Rename in `package.json`.
- Replace `openapi.yaml` with your real contract and run `npm run api:gen`.
- Adjust colors/tokens in `src/index.css` (`@theme {}`).
- Edit `.env.example` and `src/shared/lib/env.ts`.
- Delete `specs/000-example/` and `src/features/todos/` when starting your first real feature.
- Add custom GritQL rules in `tools/lint-rules/` as team patterns emerge.

## License

MIT — adapt freely.
