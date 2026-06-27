import type { Metadata } from 'next';
import { LayoutDashboard, TrendingUp, Package, Coins, Activity } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your AI marketplace dashboard — overview of models, contributions, and earnings.',
};

// Placeholder stat cards
const statCards = [
  { title: 'My Models', value: '—', icon: Package, trend: null },
  { title: 'Total Earnings', value: '— MON', icon: Coins, trend: null },
  { title: 'Data Contributions', value: '—', icon: TrendingUp, trend: null },
  { title: 'Active Listings', value: '—', icon: Activity, trend: null },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <LayoutDashboard className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of your AI marketplace activity</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
              <Badge variant="outline" className="mt-2 text-xs text-muted-foreground">
                Connect wallet to load
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Placeholder sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Earnings Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-48 items-center justify-center rounded-lg border border-dashed">
              <p className="text-sm text-muted-foreground">Chart placeholder — Sprint 3</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
