import { zodResolver } from '@hookform/resolvers/zod';
import * as Dialog from '@radix-ui/react-dialog';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button, Input } from '@/shared/ui';

export const usernameFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(30, 'Name must be at most 30 characters'),
});

type UsernameFormValues = z.infer<typeof usernameFormSchema>;

interface UsernameModalProps {
  open: boolean;
  onSubmit: (name: string) => void;
}

export function UsernameModal({ open, onSubmit }: UsernameModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UsernameFormValues>({
    resolver: zodResolver(usernameFormSchema),
    defaultValues: { name: '' },
  });

  const onValid = handleSubmit((data) => {
    onSubmit(data.name);
    reset();
  });

  return (
    <Dialog.Root open={open}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg bg-card p-6 shadow-lg"
          onEscapeKeyDown={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          aria-describedby="username-modal-desc"
        >
          <Dialog.Title className="mb-1 text-lg font-semibold">Welcome!</Dialog.Title>
          <Dialog.Description
            id="username-modal-desc"
            className="mb-4 text-sm text-muted-foreground"
          >
            Enter a display name to get started.
          </Dialog.Description>

          <form onSubmit={onValid} className="flex flex-col gap-3">
            <div>
              <Input
                {...register('name')}
                placeholder="Your name"
                aria-invalid={errors.name ? 'true' : 'false'}
                aria-describedby={errors.name ? 'name-error' : undefined}
                autoFocus
              />
              {errors.name && (
                <p id="name-error" className="mt-1 text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
            <Button type="submit">Continue</Button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
