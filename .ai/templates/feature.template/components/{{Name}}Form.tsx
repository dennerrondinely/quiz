import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button, Input } from '@/shared/ui';
import { create{{Name}}InputSchema, type Create{{Name}}Input } from '../schemas';
import { useCreate{{Name}} } from '../hooks/use{{Name}}';

export function {{Name}}Form() {
  const create = useCreate{{Name}}();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Create{{Name}}Input>({
    resolver: zodResolver(create{{Name}}InputSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await create.mutateAsync(data);
      reset();
      toast.success('Created');
    } catch {
      toast.error('Failed to create');
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-3" aria-label="Create {{name}}">
      {/* TODO: replace with real field from schema */}
      <div>
        <Input
          {...register('field' as never)}
          aria-invalid={errors ? 'true' : 'false'}
        />
      </div>
      <Button type="submit" disabled={isSubmitting}>Save</Button>
    </form>
  );
}
