'use client';

import { useState } from 'react';
import { Heart, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ModelCard } from '@/components/models/model-card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { demoModels } from '@/lib/demo-data';

// Pre-seed 4 favorite models
const DEMO_FAVORITES = [demoModels[0], demoModels[1], demoModels[3], demoModels[4]];

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState(DEMO_FAVORITES);

  function handleRemove(modelId: string) {
    setFavorites((prev) => prev.filter((m) => m.id !== modelId));
    toast.success('Favorilerden kaldırıldı');
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Heart className="h-6 w-6 text-red-500 fill-current" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Favorilerim</h1>
          <p className="text-sm text-muted-foreground">
            Yer işareti koyduğunuz veya favorilediğiniz YZ modelleri
          </p>
        </div>
        <Badge variant="outline" className="ml-auto">
          {favorites.length} model
        </Badge>
      </div>

      {/* Info Banner */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardContent className="p-3 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
          <Info className="h-4 w-4 shrink-0" />
          Cüzdanınızı bağlayarak favorilerinizi zincir üstünde kalıcı hale getirin.
        </CardContent>
      </Card>

      {/* Favorites Grid */}
      {favorites.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((model) => (
            <div key={model.id} className="relative group">
              <ModelCard model={model} />
              <button
                className="absolute top-3 right-3 h-8 w-8 rounded-full bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                onClick={() => handleRemove(model.id)}
                title="Favoriden kaldır"
              >
                <Heart className="h-4 w-4 fill-white text-white" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center max-w-md mx-auto space-y-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-bold text-lg">Tüm favoriler kaldırıldı</h3>
            <p className="text-sm text-muted-foreground">
              Pazar yerinden beğendiğiniz modelleri favorileyin.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
