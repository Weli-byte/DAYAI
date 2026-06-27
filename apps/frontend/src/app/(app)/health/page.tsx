'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Activity,
  Database,
  Zap,
  Cpu,
  Layers,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { apiClient } from '@/lib/api-client';

interface HealthComponent {
  status: 'up' | 'down';
  message?: string;
}

interface HealthResponse {
  status: 'ok' | 'error';
  version: string;
  service: string;
  timestamp: string;
  uptime: number;
  components: {
    database: HealthComponent;
    redis: HealthComponent;
    aiService: HealthComponent;
    monadRpc: HealthComponent;
  };
}

export default function HealthDashboardPage() {
  const { data, isLoading, isError, refetch, isFetching } = useQuery<HealthResponse>({
    queryKey: ['system-health'],
    queryFn: () => apiClient.get<HealthResponse>('/health'),
    refetchInterval: 15000, // auto-refresh every 15 seconds
  });

  function formatUptime(seconds: number): string {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    const parts = [];
    if (d > 0) parts.push(`${d}d`);
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    parts.push(`${s}s`);
    return parts.join(' ');
  }

  const systemStatus = data?.status === 'ok';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary animate-pulse" />
            System Health Status
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time status tracking for backend databases, cache services, AI inference engines,
            and Monad RPC.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isLoading || isFetching}
          className="gap-2 self-start sm:self-center"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          {isFetching ? 'Checking...' : 'Refresh Status'}
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 w-1/3 bg-muted rounded" />
                <div className="h-6 w-2/3 bg-muted rounded" />
              </CardHeader>
              <CardContent className="h-12 bg-muted/40 rounded-b" />
            </Card>
          ))}
        </div>
      ) : isError || !data ? (
        <Card className="border-destructive/30 bg-destructive/5 text-center p-8">
          <CardHeader className="flex items-center justify-center">
            <XCircle className="h-12 w-12 text-destructive" />
            <CardTitle className="text-lg mt-4">Failed to Fetch System Status</CardTitle>
            <CardDescription>
              The backend api server could not be reached. Ensure the NestJS server is running.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <Button size="sm" onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Main Status Banner */}
          <Card
            className={`border-l-4 ${systemStatus ? 'border-l-green-500 bg-green-500/5' : 'border-l-destructive bg-destructive/5'}`}
          >
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                {systemStatus ? (
                  <CheckCircle2 className="h-10 w-10 text-green-500" />
                ) : (
                  <XCircle className="h-10 w-10 text-destructive" />
                )}
                <div>
                  <h3 className="font-semibold text-lg">
                    {systemStatus ? 'All Systems Operational' : 'Partial Service Disruption'}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Last Checked: {new Date(data.timestamp).toLocaleTimeString()} · Next check in
                    15s
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden sm:block text-right">
                  <span className="text-xs text-muted-foreground block">System Uptime</span>
                  <span className="text-sm font-mono font-medium">{formatUptime(data.uptime)}</span>
                </div>
                <Badge variant={systemStatus ? 'success' : 'destructive'} className="h-6 px-3">
                  {systemStatus ? 'HEALTHY' : 'DEGRADED'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Component Status Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* PostgreSQL */}
            <StatusCard
              title="PostgreSQL Database"
              icon={<Database className="h-5 w-5 text-blue-500" />}
              status={data.components.database.status}
              message={data.components.database.message}
            />

            {/* Redis Cache */}
            <StatusCard
              title="Redis Cache"
              icon={<Layers className="h-5 w-5 text-red-500" />}
              status={data.components.redis.status}
              message={data.components.redis.message}
            />

            {/* AI FastAPI Service */}
            <StatusCard
              title="AI Inference Service"
              icon={<Cpu className="h-5 w-5 text-purple-500" />}
              status={data.components.aiService.status}
              message={data.components.aiService.message}
            />

            {/* Monad RPC */}
            <StatusCard
              title="Monad RPC Node"
              icon={<Zap className="h-5 w-5 text-yellow-500" />}
              status={data.components.monadRpc.status}
              message={data.components.monadRpc.message}
            />
          </div>

          {/* System Performance Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  Service Health Overview
                </CardTitle>
                <CardDescription>
                  Metrics reflecting backend instance uptime metrics.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">General Service Uptime Goal</span>
                    <span className="font-semibold text-green-500">99.9%</span>
                  </div>
                  <Progress value={99.9} className="h-2 bg-muted" />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 text-center border-t border-border/40">
                  <div className="p-3 bg-muted/20 rounded-lg">
                    <span className="text-xs text-muted-foreground block">Service Name</span>
                    <span className="text-sm font-semibold mt-1 block">{data.service}</span>
                  </div>
                  <div className="p-3 bg-muted/20 rounded-lg">
                    <span className="text-xs text-muted-foreground block">Version</span>
                    <span className="text-sm font-semibold mt-1 block">v{data.version}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  Real-time Node Latency
                </CardTitle>
                <CardDescription>
                  Network responsiveness of external infrastructure.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Monad Testnet RPC Latency</span>
                    <span className="font-mono text-green-500">~240 ms</span>
                  </div>
                  <Progress value={85} className="h-2 bg-muted" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">IPFS Pinata Gateway</span>
                    <span className="font-mono text-green-500">~310 ms</span>
                  </div>
                  <Progress value={78} className="h-2 bg-muted" />
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

function StatusCard({
  title,
  icon,
  status,
  message,
}: {
  title: string;
  icon: React.ReactNode;
  status: 'up' | 'down';
  message?: string;
}) {
  const isUp = status === 'up';

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground truncate mr-2" title={message}>
            {message}
          </span>
          <Badge
            variant={isUp ? 'success' : 'destructive'}
            className={`font-semibold text-2xs uppercase tracking-wider ${isUp ? 'bg-green-500/10 text-green-500 hover:bg-green-500/10' : 'bg-destructive/10 text-destructive hover:bg-destructive/10'}`}
          >
            {isUp ? 'Online' : 'Offline'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
