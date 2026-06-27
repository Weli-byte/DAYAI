'use client';

import { useState } from 'react';
import { Store, PlusCircle, PackageSearch } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { ModelCard, ModelCardSkeleton, ModelFilters } from '@/components/models';
import { EmptyState } from '@/components/common/empty-state';
import { ErrorState } from '@/components/common/error-state';
import { useModels, useCategories } from '@/hooks/use-models';
import { ROUTES } from '@/constants/routes';
import type { ModelQueryParams } from '@/types/model';

const DEFAULT_PARAMS: ModelQueryParams = {
  status: 'PUBLISHED',
  page: 1,
  limit: 20,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export default function MarketplacePage() {
  const [params, setParams] = useState<ModelQueryParams>(DEFAULT_PARAMS);

  const { data, isLoading, isError, error } = useModels(params);
  const { data: categories = [] } = useCategories();

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Store className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Marketplace</h1>
            <p className="text-sm text-muted-foreground">
              {data ? `${data.total} AI models available` : 'Discover and browse AI models'}
            </p>
          </div>
        </div>
        <Button asChild size="sm" className="gap-2">
          <Link href={ROUTES.MODEL_CREATE}>
            <PlusCircle className="h-4 w-4" />
            Publish Model
          </Link>
        </Button>
      </div>

      {/* ── Filters ── */}
      <ModelFilters params={params} categories={categories} onChange={setParams} />

      {/* ── Content ── */}
      {isError ? (
        <ErrorState
          title="Failed to load models"
          description={(error as Error)?.message ?? 'Something went wrong. Please try again.'}
        />
      ) : isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ModelCardSkeleton key={i} />
          ))}
        </div>
      ) : data?.data.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          title="No models found"
          description="Try adjusting your search or filter criteria."
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data!.data.map((model) => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={params.page === 1}
                onClick={() => setParams((p) => ({ ...p, page: (p.page ?? 1) - 1 }))}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {data.page} of {data.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={data.page >= data.totalPages}
                onClick={() => setParams((p) => ({ ...p, page: (p.page ?? 1) + 1 }))}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
