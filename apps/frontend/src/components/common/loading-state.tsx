import { Spinner } from './spinner';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  message?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingState({
  message = 'Loading...',
  className,
  size = 'lg',
}: LoadingStateProps) {
  return (
    <div
      className={cn('flex min-h-[300px] flex-col items-center justify-center gap-4', className)}
      role="status"
      aria-live="polite"
    >
      <Spinner size={size} />
      {message && <p className="animate-pulse text-sm text-muted-foreground">{message}</p>}
    </div>
  );
}
