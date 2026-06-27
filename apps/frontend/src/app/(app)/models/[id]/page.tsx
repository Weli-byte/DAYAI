'use client';

import { use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Brain,
  Calendar,
  Tag,
  User,
  GitBranch,
  FileText,
  Pencil,
  Trash2,
  Upload,
  Star,
  Heart,
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ErrorState } from '@/components/common/error-state';
import { useModel, useDeleteModel } from '@/hooks/use-models';
import { Playground } from '@/components/inference';
import { ReviewsSection, SimilarModels, BlockchainInfoCards } from '@/components/trust';
import {
  useRatingSummary,
  useIsFavorite,
  useAddFavorite,
  useRemoveFavorite,
  useReviews,
} from '@/hooks/use-trust';
import { useWalletStore } from '@/store/wallet.store';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';
import type { Framework, ModelStatus } from '@/types/model';

const FRAMEWORK_LABELS: Record<Framework, string> = {
  PYTORCH: 'PyTorch',
  TENSORFLOW: 'TensorFlow',
  SKLEARN: 'Scikit-learn',
  ONNX: 'ONNX',
  JAX: 'JAX',
  OTHER: 'Diğer',
};

const STATUS_COLORS: Record<ModelStatus, string> = {
  PUBLISHED: 'bg-green-500/10 text-green-600 dark:text-green-400',
  DRAFT: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  ARCHIVED: 'bg-muted text-muted-foreground',
};

interface ModelDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ModelDetailPage({ params }: ModelDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data: model, isLoading, isError, error } = useModel(id);
  const deleteMutation = useDeleteModel();

  const { address, isConnected } = useWalletStore();
  const { data: ratingSummary } = useRatingSummary(id);
  const { data: reviewsData } = useReviews(id, 1, 1);
  const { data: favStatus } = useIsFavorite(id, address || '');

  const addFavoriteMutation = useAddFavorite();
  const removeFavoriteMutation = useRemoveFavorite();

  const isFavorite = favStatus?.isFavorite || false;

  const handleFavoriteToggle = async () => {
    if (!isConnected || !address) {
      toast.error('Bu modeli favorilere eklemek için cüzdanınızı bağlayın');
      return;
    }

    try {
      if (isFavorite) {
        await removeFavoriteMutation.mutateAsync({
          modelId: id,
          walletAddress: address,
        });
        toast.success('Favorilerden kaldırıldı');
      } else {
        await addFavoriteMutation.mutateAsync({
          modelId: id,
          walletAddress: address,
        });
        toast.success('Favorilere eklendi');
      }
    } catch {
      toast.error('Favoriler güncellenemedi');
    }
  };

  async function handleDelete() {
    if (!confirm('Bu modeli silmek istediğinizden emin misiniz?')) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Model başarıyla silindi');
      router.push(ROUTES.MARKETPLACE);
    } catch {
      toast.error('Model silinemedi');
    }
  }

  if (isError) {
    return (
      <ErrorState
        title="Model bulunamadı"
        description={(error as Error)?.message ?? 'Bu model mevcut değil veya kaldırılmış.'}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Back */}
      <Button variant="ghost" size="sm" asChild className="gap-1 -ml-2">
        <Link href={ROUTES.MARKETPLACE}>
          <ArrowLeft className="h-4 w-4" />
          Pazar Yerine Dön
        </Link>
      </Button>

      {isLoading ? (
        <ModelDetailSkeleton />
      ) : model ? (
        <>
          {/* Header */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium ${STATUS_COLORS[model.status]}`}
                >
                  {model.status}
                </span>
                {model.category && <Badge variant="outline">{model.category.name}</Badge>}
                <Badge variant="secondary">{FRAMEWORK_LABELS[model.framework]}</Badge>
                {model.license && (
                  <Badge variant="outline" className="gap-1 text-xs">
                    <FileText className="h-3 w-3" />
                    {model.license}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-bold tracking-tight">{model.title}</h1>
                {ratingSummary && ratingSummary.count > 0 && (
                  <div className="flex items-center gap-1 text-xs bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 px-2 py-0.5 rounded-full font-semibold shrink-0">
                    <Star className="h-3 w-3 fill-current text-yellow-500" />
                    <span>
                      {ratingSummary.average.toFixed(1)} ({ratingSummary.count} oy)
                    </span>
                  </div>
                )}
              </div>
              {model.description && (
                <p className="max-w-2xl text-muted-foreground">{model.description}</p>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'gap-1.5 transition-colors',
                  isFavorite
                    ? 'border-red-200 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 dark:bg-red-950/20 dark:border-red-900/50'
                    : 'hover:text-red-500',
                )}
                onClick={handleFavoriteToggle}
                disabled={addFavoriteMutation.isPending || removeFavoriteMutation.isPending}
              >
                <Heart className={cn('h-3.5 w-3.5', isFavorite && 'fill-current text-red-500')} />
                {isFavorite ? 'Favorilendi' : 'Favorile'}
              </Button>
              <Button variant="outline" size="sm" className="gap-1" asChild>
                <Link href={`/models/${id}/edit`}>
                  <Pencil className="h-3.5 w-3.5" />
                  Düzenle
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1 text-destructive hover:text-destructive"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Sil
              </Button>
            </div>
          </div>

          <Separator />

          <Tabs defaultValue="overview" className="space-y-6">
            <div className="border-b pb-px">
              <TabsList className="bg-transparent border-b rounded-none h-auto p-0 gap-6">
                <TabsTrigger
                  value="overview"
                  className="bg-transparent border-b-2 border-transparent rounded-none px-0 pb-3 pt-2 font-semibold text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:bg-transparent shadow-none"
                >
                  Genel Bakış
                </TabsTrigger>
                {model.status === 'PUBLISHED' && (
                  <TabsTrigger
                    value="playground"
                    className="bg-transparent border-b-2 border-transparent rounded-none px-0 pb-3 pt-2 font-semibold text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:bg-transparent shadow-none"
                  >
                    Deneme Alanı
                  </TabsTrigger>
                )}
                <TabsTrigger
                  value="reviews"
                  className="bg-transparent border-b-2 border-transparent rounded-none px-0 pb-3 pt-2 font-semibold text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:bg-transparent shadow-none"
                >
                  Değerlendirmeler ({reviewsData?.total || 0})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="mt-0 border-none p-0">
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Main info */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Tags */}
                  {model.tags.length > 0 && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <Tag className="h-4 w-4" /> Etiketler
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {model.tags.map((tag) => (
                            <span
                              key={tag.id}
                              className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground"
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Versions */}
                  {model.latestVersion && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <GitBranch className="h-4 w-4" /> Son Sürüm
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge>v{model.latestVersion.version}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(model.latestVersion.createdAt).toLocaleDateString('tr-TR', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        {model.latestVersion.changelog && (
                          <p className="text-sm text-muted-foreground">
                            {model.latestVersion.changelog}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Blockchain Info */}
                  <div className="space-y-3">
                    <h3 className="text-base font-semibold">Zincir Üstü Varlık Detayları</h3>
                    <BlockchainInfoCards
                      nftTokenId={model.latestVersion?.nftTokenId}
                      fileCid={model.latestVersion?.fileCid}
                      txHash={model.latestVersion?.txHash}
                      ownerAddress={model.latestVersion?.ownerAddress}
                    />
                  </div>

                  <Separator />

                  {/* Similar Models */}
                  <div className="space-y-4 pt-2">
                    <h3 className="text-base font-semibold">Benzer Modeller</h3>
                    <SimilarModels categoryId={model.category?.id} currentModelId={model.id} />
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                  <Card>
                    <CardContent className="pt-4 space-y-4">
                      {/* Owner */}
                      {model.owner && (
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Sahibi</p>
                            <Link
                              href={`/profiles/${model.owner.id}`}
                              className="text-sm font-semibold hover:text-primary transition-colors hover:underline"
                            >
                              {model.owner.username}
                            </Link>
                          </div>
                        </div>
                      )}

                      <Separator />

                      {/* Dates */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>
                            Yayımlandı{' '}
                            {new Date(model.createdAt).toLocaleDateString('tr-TR', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Brain className="h-3.5 w-3.5" />
                          <span>
                            Güncellendi{' '}
                            {new Date(model.updatedAt).toLocaleDateString('tr-TR', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>

                      <Separator />

                      {/* Upload / NFT button */}
                      <Button size="sm" className="w-full gap-1.5" asChild>
                        <Link href={`/models/upload?modelId=${id}`}>
                          <Upload className="h-3.5 w-3.5" />
                          Yeni Sürüm Yükle
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {model.status === 'PUBLISHED' && (
              <TabsContent value="playground" className="mt-0 border-none p-0">
                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <Playground modelId={model.id} modelTitle={model.title} />
                  </div>
                  <div>
                    <Card>
                      <CardContent className="pt-4 space-y-4 text-sm">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Sahibi</p>
                            <p className="text-sm font-medium">
                              {model.owner?.username || 'Unknown'}
                            </p>
                          </div>
                        </div>
                        <Separator />
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Model Çerçevesi</p>
                          <p className="text-sm font-semibold">
                            {FRAMEWORK_LABELS[model.framework]}
                          </p>
                        </div>
                        {model.license && (
                          <>
                            <Separator />
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground">Lisans</p>
                              <p className="text-sm font-semibold">{model.license}</p>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            )}
            <TabsContent value="reviews" className="mt-0 border-none p-0">
              <ReviewsSection modelId={model.id} />
            </TabsContent>
          </Tabs>
        </>
      ) : null}
    </div>
  );
}

function ModelDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-md" />
          <Skeleton className="h-6 w-28 rounded-md" />
        </div>
        <Skeleton className="h-9 w-2/3" />
        <Skeleton className="h-4 w-full max-w-xl" />
        <Skeleton className="h-4 w-3/4 max-w-xl" />
      </div>
      <Skeleton className="h-px" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
        </div>
        <Skeleton className="h-48 rounded-xl" />
      </div>
    </div>
  );
}
