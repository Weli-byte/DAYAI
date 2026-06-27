import type { Metadata } from 'next';
import { Brain, Plus, Upload } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/common/empty-state';
import { ROUTES } from '@/constants/routes';

export const metadata: Metadata = {
  title: 'My Models',
  description: 'Manage your published AI models and monitor their performance.',
};

export default function ModelsPage() {
  // Placeholder — data will come from API + blockchain in Sprint 3/5
  const hasModels = false;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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
        {['Yayımlanan Modeller', 'Toplam Satış', 'Katkıda Bulunanlar'].map((label) => (
          <Card key={label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content */}
      {hasModels ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Model cards will be rendered here */}
        </div>
      ) : (
        <EmptyState
          icon={Brain}
          title="Henüz model yok"
          description="Hiç YZ modeli yayımlamadınız. Ödül kazanmaya başlamak için ilk modelinizi yükleyin."
          action={
            <Button asChild>
              <Link href={ROUTES.UPLOAD}>
                <Upload className="mr-2 h-4 w-4" />
                İlk Modelinizi Yükleyin
              </Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
