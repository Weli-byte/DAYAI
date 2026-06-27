'use client';

import { LayoutDashboard, Package, Users, Cpu, Star, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboardAnalytics } from '@/hooks/use-trust';

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
      title: 'Active Users',
      value: isLoading ? null : analytics?.totalUsers,
      icon: Users,
      description: 'Total active creators and consumers.',
    },
    {
      title: 'Total Inferences',
      value: isLoading ? null : analytics?.totalInferences,
      icon: Cpu,
      description: 'Model executions run on marketplace.',
    },
  ];

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

      {/* Additional Analytics Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 flex flex-col justify-center items-center p-6 text-center">
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
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Average score across all model ratings.</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">System Operations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
              <Cpu className="h-8 w-8 opacity-30 mx-auto mb-2" />
              <h5 className="font-semibold text-sm">GPU Node Inference Pools</h5>
              <p className="text-xs text-muted-foreground mt-1">
                Distributed computing nodes are online. Speed and resources are dynamically scaled
                on demand.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
