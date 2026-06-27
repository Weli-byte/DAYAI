import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ModelCardSkeleton() {
  return (
    <Card className="flex flex-col overflow-hidden border-border/60">
      <div className="h-1 w-full bg-muted" />
      <CardHeader className="pb-2 pt-4">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-20 rounded-md" />
          <Skeleton className="h-5 w-24 rounded-md" />
        </div>
        <Skeleton className="mt-2 h-5 w-3/4" />
      </CardHeader>
      <CardContent className="flex-1 pb-3">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="mt-1 h-3 w-5/6" />
        <div className="mt-3 flex gap-1">
          <Skeleton className="h-4 w-14 rounded-full" />
          <Skeleton className="h-4 w-12 rounded-full" />
        </div>
      </CardContent>
      <CardFooter className="border-t border-border/60 px-4 py-3">
        <div className="flex w-full items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-7 w-20 rounded-md" />
        </div>
      </CardFooter>
    </Card>
  );
}
