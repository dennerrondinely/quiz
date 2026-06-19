# TypeScript Rules

## Configuration

- `strict: true` + `noUnusedLocals` + `noUnusedParameters` + `noImplicitOverride` + `noUncheckedSideEffectImports` (see `tsconfig.app.json`).
- `verbatimModuleSyntax: true` → use `import type` for types.
- `moduleResolution: bundler`.

## Rules

1. **No `any`.** Use `unknown` and narrow with `instanceof`/`typeof`/Zod parse.
2. **Zod schemas are the source of truth.** Domain types come from `z.infer<typeof schema>`.
3. **`import type` for type-only imports.** Linter enforces this.
4. **Discriminated unions over optional boolean flags**:

```ts
// ❌
type State = { loading?: boolean; error?: Error; data?: T };

// ✅
type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'success'; data: T };
```

5. **Don't use casual `as`.** Allowed only:
   - `as const` (readonly literals)
   - `as unknown as T` with a comment explaining why the type system can't infer
   - Refining after a type guard
6. **Public functions have explicit return types.** Internal ones may infer.
7. **`Pick`/`Omit`/`Partial`** > redeclaring an interface.
8. **Generics only when they add value.** If you use `T` only once, you probably don't need it.

## Validation at boundaries

Always parse with Zod when receiving data from:
- HTTP API (even if generated, validate the first time if the backend is uncertain)
- `localStorage` / `sessionStorage`
- URL search params
- `import.meta.env` (already done in `shared/lib/env.ts`)
- WebSocket messages / postMessage

## React types

- Component: `function Foo(props: FooProps)`. No `React.FC`.
- Children: `children: React.ReactNode`.
- Ref: `forwardRef<HTMLButtonElement, ButtonProps>(...)`.
- Events: `React.MouseEvent<HTMLButtonElement>` (use the element's native type).

## `unknown` vs `any`

```ts
// ❌
function parse(json: any) { return json.foo.bar; }

// ✅
function parse(json: unknown): Foo {
  return fooSchema.parse(json);
}
```

## Module augmentation

Allowed to extend library types (TanStack Router already does this in `app/router.tsx`). Keep it close to the usage, not in scattered `*.d.ts` files.
