import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useCreateTodo } from '@/features/todos/hooks/useTodos';
import { type CreateTodoInput, createTodoInputSchema } from '@/features/todos/schemas';
import { Button, Input } from '@/shared/ui';

export function TodoForm() {
  const createTodo = useCreateTodo();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTodoInput>({
    resolver: zodResolver(createTodoInputSchema),
    defaultValues: { title: '' },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await createTodo.mutateAsync(data);
      reset();
      toast.success('Todo created');
    } catch {
      toast.error('Failed to create todo');
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex gap-2" aria-label="Create todo">
      <div className="flex-1">
        <Input
          {...register('title')}
          placeholder="What needs to be done?"
          aria-invalid={errors.title ? 'true' : 'false'}
          aria-describedby={errors.title ? 'title-error' : undefined}
        />
        {errors.title && (
          <p id="title-error" className="mt-1 text-sm text-destructive">
            {errors.title.message}
          </p>
        )}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        Add
      </Button>
    </form>
  );
}
