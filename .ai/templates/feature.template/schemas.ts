import { z } from 'zod';

export const {{name}}Schema = z.object({
  id: z.string(),
  // TODO: campos
});

export const create{{Name}}InputSchema = z.object({
  // TODO: campos do form
});

export type {{Name}} = z.infer<typeof {{name}}Schema>;
export type Create{{Name}}Input = z.infer<typeof create{{Name}}InputSchema>;
