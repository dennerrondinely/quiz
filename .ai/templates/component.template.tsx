// Template: basic React component.
// Replace {{Name}} (PascalCase) and {{name}} (camelCase) when copying.
//
// Where to save — choose the right layer:
//   src/features/<feature>/components/{{Name}}.tsx   → business logic or feature-specific
//   src/shared/ui/atoms/{{name}}.tsx                 → shadcn/Radix primitive (Button, Badge…)
//   src/shared/ui/molecules/{{name}}.tsx             → atom composition with no logic (InputWithLabel…)
//   src/shared/ui/organisms/{{name}}.tsx             → complex reusable section (DataTable, Modal…)
//
// Consumers always import from '@/shared/ui', never from sublayers directly.

import { cn } from '@/shared/lib/cn';

interface {{Name}}Props {
  className?: string;
  // TODO: define specific props
}

export function {{Name}}({ className }: {{Name}}Props) {
  return (
    <div className={cn('', className)}>
      {/* TODO: implement */}
    </div>
  );
}
