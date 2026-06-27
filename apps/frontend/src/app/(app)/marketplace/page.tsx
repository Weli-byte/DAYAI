import type { Metadata } from 'next';
import { Store, Filter, Search, SlidersHorizontal } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const metadata: Metadata = {
  title: 'Marketplace',
  description: 'Discover and trade AI models as NFTs on the decentralized marketplace.',
};

const categories = ['All', 'Classification', 'NLP', 'Vision', 'Generative', 'Health', 'Finance'];

export default function MarketplacePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Store className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Marketplace</h1>
          <p className="text-sm text-muted-foreground">
            Discover, buy, and trade AI models as NFTs
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search models, datasets, contributors..." className="pl-9" disabled />
        </div>
        <Button variant="outline" className="gap-2" disabled>
          <Filter className="h-4 w-4" />
          Filters
        </Button>
        <Button variant="outline" className="gap-2" disabled>
          <SlidersHorizontal className="h-4 w-4" />
          Sort
        </Button>
      </div>

      {/* Category Tabs */}
      <Tabs defaultValue="All">
        <TabsList className="flex-wrap">
          {categories.map((cat) => (
            <TabsTrigger key={cat} value={cat}>
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Model Grid — placeholder cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="overflow-hidden transition-shadow hover:shadow-md">
            <CardHeader className="p-0">
              <Skeleton className="h-36 w-full rounded-none" />
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
              <div className="flex gap-1 pt-1">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>
            </CardContent>
            <CardFooter className="border-t p-4">
              <div className="flex w-full items-center justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex justify-center pt-4">
        <Badge variant="outline" className="text-muted-foreground">
          Models will load after wallet connection and API integration (Sprint 3 & 5)
        </Badge>
      </div>
    </div>
  );
}
