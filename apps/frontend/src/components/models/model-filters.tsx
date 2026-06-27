'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ModelQueryParams, Framework, ModelStatus } from '@/types/model';
import type { CategoryDto } from '@/types/model';

const FRAMEWORKS: { value: Framework; label: string }[] = [
  { value: 'PYTORCH', label: 'PyTorch' },
  { value: 'TENSORFLOW', label: 'TensorFlow' },
  { value: 'SKLEARN', label: 'Scikit-learn' },
  { value: 'ONNX', label: 'ONNX' },
  { value: 'JAX', label: 'JAX' },
  { value: 'OTHER', label: 'Other' },
];

const STATUSES: { value: ModelStatus; label: string }[] = [
  { value: 'PUBLISHED', label: 'Yayımlandı' },
  { value: 'DRAFT', label: 'Taslak' },
  { value: 'ARCHIVED', label: 'Arşivlendi' },
];

const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'En yeniler önce' },
  { value: 'createdAt:asc', label: 'En eskiler önce' },
  { value: 'title:asc', label: 'İsim A→Z' },
  { value: 'title:desc', label: 'İsim Z→A' },
  { value: 'updatedAt:desc', label: 'Son güncellenen' },
];

interface ModelFiltersProps {
  params: ModelQueryParams;
  categories: CategoryDto[];
  onChange: (updated: ModelQueryParams) => void;
}

export function ModelFilters({ params, categories, onChange }: ModelFiltersProps) {
  const sortValue = `${params.sortBy ?? 'createdAt'}:${params.sortOrder ?? 'desc'}`;

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    onChange({ ...params, search: e.target.value || undefined, page: 1 });
  }

  function handleSortChange(value: string) {
    const [sortBy, sortOrder] = value.split(':') as [
      ModelQueryParams['sortBy'],
      ModelQueryParams['sortOrder'],
    ];
    onChange({ ...params, sortBy, sortOrder, page: 1 });
  }

  function handleFramework(value: string) {
    onChange({
      ...params,
      framework: value === '_all' ? undefined : (value as Framework),
      page: 1,
    });
  }

  function handleStatus(value: string) {
    onChange({ ...params, status: value === '_all' ? undefined : (value as ModelStatus), page: 1 });
  }

  function handleCategory(value: string) {
    onChange({ ...params, categoryId: value === '_all' ? undefined : value, page: 1 });
  }

  function clearFilters() {
    onChange({ page: 1, limit: params.limit });
  }

  const hasActiveFilters = Boolean(
    params.search || params.framework || params.status || params.categoryId,
  );

  return (
    <div className="space-y-3">
      {/* Search row */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="İsme veya açıklamaya göre model ara…"
            className="pl-9"
            value={params.search ?? ''}
            onChange={handleSearch}
          />
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-xs">
            <X className="h-3.5 w-3.5" />
            Temizle
          </Button>
        )}
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap gap-2">
        {/* Category */}
        <Select value={params.categoryId ?? '_all'} onValueChange={handleCategory}>
          <SelectTrigger className="h-8 w-[150px] text-xs">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">Tüm Kategoriler</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Framework */}
        <Select value={params.framework ?? '_all'} onValueChange={handleFramework}>
          <SelectTrigger className="h-8 w-[150px] text-xs">
            <SelectValue placeholder="Framework" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">Tüm Çerçeveler</SelectItem>
            {FRAMEWORKS.map((f) => (
              <SelectItem key={f.value} value={f.value}>
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status */}
        <Select value={params.status ?? '_all'} onValueChange={handleStatus}>
          <SelectTrigger className="h-8 w-[120px] text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">Tüm Durumlar</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select value={sortValue} onValueChange={handleSortChange}>
          <SelectTrigger className="h-8 w-[170px] text-xs ml-auto">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
