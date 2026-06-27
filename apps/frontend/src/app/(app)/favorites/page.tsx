'use client';

import { useState } from 'react';
import { Heart, Package, ShieldAlert } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWalletStore } from '@/store/wallet.store';
import { useFavorites, useRemoveFavorite } from '@/hooks/use-trust';
import { ModelCard } from '@/components/models/model-card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function FavoritesPage() {
  const { address, isConnected } = useWalletStore();
  const [page, setPage] = useState(1);

  const { data: favoritesData, isLoading, refetch } = useFavorites(address || '', page, 6);
  const removeFavoriteMutation = useRemoveFavorite();

  const handleRemove = async (modelId: string) => {
    if (!address) return;
    try {
      await removeFavoriteMutation.mutateAsync({
        modelId,
        walletAddress: address,
      });
      toast.success('Favorilerden kaldırıldı');
      refetch();
    } catch {
      toast.error('Favorilerden kaldırılamadı');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Heart className="h-6 w-6 text-red-500 fill-current" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Favorilerim</h1>
          <p className="text-sm text-muted-foreground">
            Yer işareti koyduğunuz veya favorilediğiniz YZ modelleri
          </p>
        </div>
      </div>

      {!isConnected ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center max-w-md mx-auto space-y-4">
            <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto text-amber-500">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg">Cüzdan Bağlı Değil</h3>
            <p className="text-sm text-muted-foreground">
              Yer işaretlerinizi ve favorilerinizi yüklemek için Web3 cüzdanınızı bağlayın.
            </p>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-xl border bg-card p-4 space-y-3">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-8 w-1/4" />
            </div>
          ))}
        </div>
      ) : favoritesData?.items && favoritesData.items.length > 0 ? (
        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favoritesData.items.map((model) => (
              <div key={model.id} className="relative group">
                <ModelCard model={model} />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-3 right-3 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  onClick={() => handleRemove(model.id)}
                >
                  <Heart className="h-4 w-4 fill-current text-white" />
                </Button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {favoritesData.totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Önceki
              </Button>
              <span className="text-xs self-center text-muted-foreground">
                Sayfa {page} / {favoritesData.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page === favoritesData.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Sonraki
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center max-w-md mx-auto space-y-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary">
              <Package className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg">Henüz favori yok</h3>
            <p className="text-sm text-muted-foreground">
              Henüz hiç model favorilemediniz. Modelleri keşfetmek için Pazar Yerine gidin!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
