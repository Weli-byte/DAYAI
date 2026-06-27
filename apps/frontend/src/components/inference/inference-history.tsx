'use client';

import { useState } from 'react';
import { useInferenceHistory } from '@/hooks/use-inference';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { timeAgo } from '@/lib/utils';
import {
  Clock,
  Cpu,
  Clock3,
  ChevronLeft,
  ChevronRight,
  CornerDownRight,
  Terminal,
  AlertTriangle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface InferenceHistoryProps {
  walletAddress: string;
  modelId?: string;
}

export function InferenceHistory({ walletAddress, modelId }: InferenceHistoryProps) {
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data, isLoading, isError, error } = useInferenceHistory({
    walletAddress,
    modelId,
    page,
    limit,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-semibold flex items-center gap-1.5 text-muted-foreground pl-1">
          <Clock className="h-4 w-4" />
          Recent Activity
        </h3>
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="border-border/50">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-center">
        <AlertTriangle className="mx-auto h-8 w-8 text-destructive mb-2" />
        <h4 className="text-sm font-bold text-destructive">Failed to Load History</h4>
        <p className="text-xs text-muted-foreground mt-1">
          {error instanceof Error ? error.message : 'An error occurred fetching history'}
        </p>
      </div>
    );
  }

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  if (total === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center bg-muted/10">
        <Clock className="mx-auto h-8 w-8 text-muted-foreground/50 mb-3" />
        <h4 className="text-sm font-semibold">No recent activity</h4>
        <p className="text-xs text-muted-foreground mt-1">
          Run this model in the playground to see your inference history here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pl-1">
        <h3 className="text-sm font-semibold flex items-center gap-1.5 text-muted-foreground">
          <Clock className="h-4 w-4" />
          Recent Activity ({total})
        </h3>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.id} className="border-border/60 hover:border-border transition-colors">
            <CardContent className="p-4 space-y-3">
              {/* Header with Title & status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-foreground">{item.modelTitle}</span>
                  <span className="text-[10px] text-muted-foreground">•</span>
                  <span className="text-[10px] text-muted-foreground">
                    {timeAgo(item.createdAt)}
                  </span>
                </div>
                <Badge
                  variant={
                    item.status === 'COMPLETED'
                      ? 'success'
                      : item.status === 'FAILED'
                        ? 'destructive'
                        : 'secondary'
                  }
                  className="text-[9px] uppercase tracking-wide px-1.5 py-0"
                >
                  {item.status}
                </Badge>
              </div>

              {/* Prompt snippet */}
              <div className="flex items-start gap-1.5 text-xs text-muted-foreground bg-muted/40 p-2.5 rounded border border-border/30">
                <CornerDownRight className="h-3.5 w-3.5 mt-0.5 shrink-0 text-primary/70" />
                <span className="line-clamp-2 italic select-all">"{item.prompt}"</span>
              </div>

              {/* Output snippet (if completed) */}
              {item.status === 'COMPLETED' && item.output && (
                <div className="flex items-start gap-1.5 text-xs text-foreground bg-emerald-500/5 dark:bg-emerald-950/5 p-2.5 rounded border border-emerald-500/10">
                  <Terminal className="h-3.5 w-3.5 mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span className="line-clamp-3 font-mono leading-relaxed select-all">
                    {item.output}
                  </span>
                </div>
              )}

              {/* Metrics (if completed) */}
              {item.status === 'COMPLETED' && (
                <div className="flex items-center gap-4 text-[10px] text-muted-foreground pt-1">
                  {item.tokensUsed !== null && (
                    <span className="flex items-center gap-0.5">
                      <Cpu className="h-3 w-3 text-emerald-500/70" />
                      Tokens: <strong>{item.tokensUsed}</strong>
                    </span>
                  )}
                  {item.inferenceTimeMs !== null && (
                    <span className="flex items-center gap-0.5">
                      <Clock3 className="h-3 w-3 text-emerald-500/70" />
                      Time: <strong>{item.inferenceTimeMs}ms</strong>
                    </span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
