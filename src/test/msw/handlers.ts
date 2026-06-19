import { HttpResponse, http } from 'msw';
import type { Todo } from '@/features/todos/schemas';

const initial: Todo[] = [
  { id: '1', title: 'Ler .ai/rules antes de codar', completed: true },
  { id: '2', title: 'Rodar /specify para criar spec', completed: false },
];

let store: Todo[] = [...initial];

export function resetTodosStore() {
  store = [...initial];
}

const baseURL = '*';

export const handlers = [
  http.get(`${baseURL}/todos`, () => HttpResponse.json(store)),
  http.post(`${baseURL}/todos`, async ({ request }) => {
    const body = (await request.json()) as { title: string };
    const created: Todo = { id: crypto.randomUUID(), title: body.title, completed: false };
    store = [...store, created];
    return HttpResponse.json(created, { status: 201 });
  }),
];
