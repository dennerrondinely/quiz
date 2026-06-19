import { z } from 'zod';
import { type CreateTodoInput, type Todo, todoSchema } from '@/features/todos/schemas';
import { httpClient } from '@/shared/lib/http';

/**
 * Camada de API manual da feature.
 *
 * Quando você gerar tipos com `npm run api:gen`, prefira importar os hooks
 * de @/shared/api/generated e descartar este arquivo. Mantemos aqui para
 * demonstrar o padrão sem depender de spec OpenAPI no template.
 */
export const todosApi = {
  list: async (): Promise<Todo[]> => {
    const { data } = await httpClient.get<unknown>('/todos');
    return z.array(todoSchema).parse(data);
  },
  create: async (input: CreateTodoInput): Promise<Todo> => {
    const { data } = await httpClient.post<unknown>('/todos', input);
    return todoSchema.parse(data);
  },
};
