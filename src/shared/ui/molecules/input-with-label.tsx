import { cn } from '@/shared/lib/cn';
import { Input, Label } from '@/shared/ui/atoms';

interface InputWithLabelProps extends React.ComponentProps<typeof Input> {
  label: string;
  error?: string;
}

export function InputWithLabel({ label, error, className, id, ...props }: InputWithLabelProps) {
  return (
    <div className={cn('space-y-1', className)}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
