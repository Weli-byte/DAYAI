'use client';

import Link from 'next/link';
import { Brain, Plus, Upload, TrendingUp, ShoppingBag, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ModelCard } from '@/components/models/model-card';
import { ROUTES } from '@/constants/routes';
import { demoModels } from '@/lib/demo-data';

// Show first 3 demo models as "my published models"
const MY_MODELS = demoModels.slice(0, 3);

const STATS = [
  { label: 'Yayımlanan Modeller', value: '3', icon: Brain, color: 'text-primary' },
  { label: 'Toplam Satış', value: '47 MON', icon: ShoppingBag, color: 'text-green-500' },
  { label: 'Katkıda Bulunanlar', value: '12', icon: Users, color: 'text-blue-500' },
];

export default function ModelsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Brain className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Modellerim</h1>
            <p className="text-sm text-muted-foreground">
              Yayımladığınız YZ modellerini ve NFT listelerinizi yönetin
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href={ROUTES.UPLOAD}>
            <Plus className="mr-2 h-4 w-4" />
            Model Yükle
          </Link>
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-3">
        {STATS.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Banner */}
      <Card className="border-green-500/20 bg-green-500/5">
        <CardContent className="p-4 flex items-center gap-3">
          <TrendingUp className="h-5 w-5 text-green-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">Bu ay +18 MON kazandınız</p>
            <p className="text-xs text-muted-foreground">
              Modelleriniz toplam 284 kez çalıştırıldı. Harika ilerleme!
            </p>
          </div>
          <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30">
            +%12
          </Badge>
        </CardContent>
      </Card>

      {/* Model Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold">Yayımlanan Modeller</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href={ROUTES.MARKETPLACE}>Tüm modeller →</Link>
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MY_MODELS.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      </div>

      {/* Upload CTA */}
      <Card className="border-dashed border-primary/30 bg-primary/5">
        <CardContent className="p-6 text-center space-y-3">
          <Upload className="h-8 w-8 text-primary mx-auto" />
          <h3 className="font-semibold">Yeni model yayımla</h3>
          <p className="text-sm text-muted-foreground">
            YZ modelinizi IPFS&apos;e yükleyin ve Monad üzerinde NFT olarak tokenize edin.
          </p>
          <Button asChild size="sm">
            <Link href={ROUTES.UPLOAD}>Model Yükle</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
