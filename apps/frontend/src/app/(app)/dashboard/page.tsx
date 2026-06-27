'use client';

import { LayoutDashboard, Package, Users, Cpu, Star, Shield, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { useDashboardAnalytics } from '@/hooks/use-trust';
import { ROUTES } from '@/constants/routes';

export default function DashboardPage() {
  const { data: analytics, isLoading } = useDashboardAnalytics();

  const metrics = [
    {
      title: 'Total Models',
      value: isLoading ? null : analytics?.totalModels,
      icon: Package,
      description: 'AI models published on the marketplace.',
    },
    {
      title: 'NFT Registered',
      value: isLoading ? null : analytics?.totalNftModels,
      icon: Shield,
      description: 'Models minted on Monad Testnet.',
    },
    {
      title: 'Active Creators',
      value: isLoading ? null : analytics?.activeCreators,
      icon: Users,
      description: 'Total active model developers.',
    },
    {
      title: 'Total Inferences',
      value: isLoading ? null : analytics?.totalInferences,
      icon: Cpu,
      description: 'Model executions run on marketplace.',
    },
  ];

  // Calculate max count for progress bar relative scaling
  const maxCategoryCount =
    analytics?.topCategories?.reduce((max, cat) => Math.max(max, cat.count), 0) || 1;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <LayoutDashboard className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Marketplace Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Real-time statistics and usage metrics overview
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title} className="hover:border-primary/20 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-primary shrink-0" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p className="text-2xl font-bold">{metric.value ?? '0'}</p>
              )}
              <p className="text-[10px] text-muted-foreground mt-1.5">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Rating and Top Categories */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Top Categories</CardTitle>
              <CardDescription>Distribution of models across different categories.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-8" />
                      </div>
                      <Skeleton className="h-2 w-full" />
                    </div>
                  ))}
                </div>
              ) : !analytics?.topCategories || analytics.topCategories.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No categories data.
                </p>
              ) : (
                analytics.topCategories.map((category) => {
                  const percentage = Math.round((category.count / maxCategoryCount) * 100);
                  return (
                    <div key={category.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium">{category.name}</span>
                        <span className="text-muted-foreground font-mono">
                          {category.count} models
                        </span>
                      </div>
                      <Progress value={percentage} className="h-1.5 bg-muted" />
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          <Card className="flex flex-col justify-center items-center p-6 text-center">
            <CardHeader className="p-0 pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Marketplace Quality Rating
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-2">
              {isLoading ? (
                <Skeleton className="h-10 w-24 mx-auto" />
              ) : (
                <div className="text-5xl font-extrabold text-foreground">
                  {analytics?.averageRating || '0.0'}
                </div>
              )}
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const rating = Number(analytics?.averageRating) || 0;
                  const isFilled = star <= Math.round(rating);
                  return (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${isFilled ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground/30'}`}
                    />
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                Average score across all model ratings.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Uploads */}
        <div className="md:col-span-1">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-base">Recent Uploads</CardTitle>
              <CardDescription>Latest models published or versioned.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, idx) => (
                    <div key={idx} className="flex flex-col gap-1 border-b border-border/40 pb-3">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : !analytics?.recentUploads || analytics.recentUploads.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No recent uploads.</p>
              ) : (
                <div className="space-y-4">
                  {analytics.recentUploads.map((upload, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col gap-1 pb-3 border-b border-border/40 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={ROUTES.MODEL_DETAIL(upload.modelId)}
                          className="font-semibold text-sm hover:text-primary transition-colors hover:underline line-clamp-1 flex items-center gap-1 group"
                        >
                          {upload.title}
                          <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <span className="text-[10px] font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded-full shrink-0">
                          v{upload.version}
                        </span>
                      </div>
                      <div className="flex justify-between text-2xs text-muted-foreground">
                        <span>by {upload.creator}</span>
                        <span>{new Date(upload.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
