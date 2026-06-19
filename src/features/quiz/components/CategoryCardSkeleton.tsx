import { Card, CardContent, CardHeader } from '@/shared/ui';

export function CategoryCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
      </CardHeader>
      <CardContent>
        <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
        <div className="mt-4 h-9 w-full animate-pulse rounded bg-muted" />
      </CardContent>
    </Card>
  );
}
