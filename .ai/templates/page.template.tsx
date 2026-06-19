// Template: TanStack Router file-based page (route).
// Save in: src/routes/{{path}}.tsx
// The TanStack Router plugin (vite.config.ts) regenerates src/routeTree.gen.ts on save.
// For routes with validated search params, uncomment the validateSearch block.

import { createFileRoute } from '@tanstack/react-router';
// import { z } from 'zod';
import { {{Name}}Page } from '@/features/{{feature}}';

// const searchSchema = z.object({ q: z.string().optional() });

export const Route = createFileRoute('/{{path}}')({
  component: {{Name}}Page,
  // validateSearch: searchSchema,
  // loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(...),
});
