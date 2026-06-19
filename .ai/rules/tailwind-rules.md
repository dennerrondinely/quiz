# Tailwind Rules (v4)

This project uses **Tailwind CSS v4 CSS-first**. Configuration lives in `src/index.css` via `@theme {}`. **There is no `tailwind.config.ts`**.

## Tokens

Use ONLY classes that map to tokens from `@theme`. Hardcoded colors are forbidden:

```tsx
// ❌
<div className="bg-[#0f172a] text-[hsl(0_0%_100%)]">

// ✅
<div className="bg-primary text-primary-foreground">
```

Available tokens (see `src/index.css`): `background`, `foreground`, `card`, `card-foreground`, `popover`, `popover-foreground`, `primary`, `primary-foreground`, `secondary`, `secondary-foreground`, `muted`, `muted-foreground`, `accent`, `accent-foreground`, `destructive`, `destructive-foreground`, `border`, `input`, `ring`.

If you need a color that doesn't exist, **add a token** to `@theme` instead of using an arbitrary value.

## `cn()` for conditionals

```tsx
import { cn } from '@/shared/lib/cn';

<button className={cn('rounded px-3 py-1', isActive && 'bg-primary text-primary-foreground', className)}>
```

`cn` does `clsx` + `tailwind-merge` (correctly resolves conflicts like `p-2 p-4`).

## Variants with CVA

Design system components with variants (button, badge) **must** use `class-variance-authority`. See `src/shared/ui/button.tsx` as reference.

```tsx
const variants = cva('base-classes', {
  variants: {
    intent: { primary: '...', secondary: '...' },
    size: { sm: '...', lg: '...' },
  },
  defaultVariants: { intent: 'primary', size: 'sm' },
});
```

## Dark mode

`@custom-variant dark (&:is(.dark *))` is configured. Toggle by adding/removing the `dark` class on `<html>`. Use `dark:` in components.

## Layout — preferences

- **Flex/grid over absolute**. Absolute positioning only for overlays/tooltips.
- **`gap-*` over `space-x-*`**. `gap` works in flex AND grid; it's more predictable.
- **`container mx-auto px-4`** for page wrappers (already used in `__root.tsx`).
- Mobile-first. No prefix = mobile; `sm:`/`md:`/`lg:` add breakpoints.

## Anti-patterns

- ❌ Inline classes with more than 6-7 utilities without CVA → break into variants.
- ❌ `style={{ color: '#fff' }}` → use Tailwind class or token.
- ❌ `!important` class (`!bg-red-500`) → fix the specificity problem instead.
- ❌ Mixing Tailwind with CSS modules → pick one.

## When to escape Tailwind

Complex animations, custom keyframes, or truly unique styles go in `src/index.css` inside `@layer components`. But try with utilities first — they almost always work.
