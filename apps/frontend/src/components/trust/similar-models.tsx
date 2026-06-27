'use client';

import { useModels } from '@/hooks/use-models';
import { ModelCard } from '@/components/models/model-card';
import { Brain } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface SimilarModelsProps {
  categoryId?: string | null;
  currentModelId: string;
}

export function SimilarModels({ categoryId, currentModelId }: SimilarModelsProps) {
  const { data: modelsData, isLoading } = useModels({
    categoryId: categoryId || undefined,
    limit: 5,
  });

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-60 rounded-xl border bg-card p-4 space-y-3">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-8 w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  // Filter out the current model being viewed
  const filteredModels = (modelsData?.data || [])
    .filter((m) => m.id !== currentModelId)
    .slice(0, 3);

  if (filteredModels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg text-center text-muted-foreground">
        <Brain className="h-8 w-8 opacity-30 mb-2" />
        <span className="text-xs">No similar models found in this category.</span>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {filteredModels.map((model) => (
        <ModelCard key={model.id} model={model} />
      ))}
    </div>
  );
}
