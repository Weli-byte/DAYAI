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
  ExternalLink,
  Pencil,
  Trash2,
  Hash,
  Link2,
  Upload,
  Database,
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/common/error-state';
import { useModel, useDeleteModel } from '@/hooks/use-models';
import { ROUTES } from '@/constants/routes';
import type { Framework, ModelStatus } from '@/types/model';

const FRAMEWORK_LABELS: Record<Framework, string> = {
  PYTORCH: 'PyTorch',
  TENSORFLOW: 'TensorFlow',
  SKLEARN: 'Scikit-learn',
  ONNX: 'ONNX',
  JAX: 'JAX',
  OTHER: 'Other',
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

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this model?')) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Model deleted successfully');
      router.push(ROUTES.MARKETPLACE);
    } catch {
      toast.error('Failed to delete model');
    }
  }

  if (isError) {
    return (
      <ErrorState
        title="Model not found"
        description={(error as Error)?.message ?? 'This model does not exist or has been removed.'}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Back */}
      <Button variant="ghost" size="sm" asChild className="gap-1 -ml-2">
        <Link href={ROUTES.MARKETPLACE}>
          <ArrowLeft className="h-4 w-4" />
          Back to Marketplace
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
              <h1 className="text-3xl font-bold tracking-tight">{model.title}</h1>
              {model.description && (
                <p className="max-w-2xl text-muted-foreground">{model.description}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1" asChild>
                <Link href={`/models/${id}/edit`}>
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
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
                Delete
              </Button>
            </div>
          </div>

          <Separator />

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tags */}
              {model.tags.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Tag className="h-4 w-4" /> Tags
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
                      <GitBranch className="h-4 w-4" /> Latest Version
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge>v{model.latestVersion.version}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(model.latestVersion.createdAt).toLocaleDateString('en-US', {
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
              {model.latestVersion?.nftTokenId && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Database className="h-4 w-4" /> On-Chain Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    {/* NFT Token ID */}
                    <div className="flex items-start gap-2">
                      <Hash className="mt-0.5 h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">NFT Token ID</p>
                        <p className="font-mono font-medium">#{model.latestVersion.nftTokenId}</p>
                      </div>
                    </div>
                    {/* Transaction Hash */}
                    {model.latestVersion.txHash && (
                      <div className="flex items-start gap-2">
                        <ExternalLink className="mt-0.5 h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">Transaction</p>
                          <a
                            href={`https://monad-testnet.socialscan.io/tx/${model.latestVersion.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-xs text-primary hover:underline break-all"
                          >
                            {model.latestVersion.txHash}
                          </a>
                        </div>
                      </div>
                    )}
                    {/* File CID */}
                    {model.latestVersion.fileCid && (
                      <div className="flex items-start gap-2">
                        <Link2 className="mt-0.5 h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">IPFS File CID</p>
                          <a
                            href={`${process.env.NEXT_PUBLIC_IPFS_GATEWAY ?? 'https://ipfs.io/ipfs'}/${model.latestVersion.fileCid}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-xs text-primary hover:underline break-all"
                          >
                            {model.latestVersion.fileCid}
                          </a>
                        </div>
                      </div>
                    )}
                    {/* Owner Address */}
                    {model.latestVersion.ownerAddress && (
                      <div className="flex items-start gap-2">
                        <User className="mt-0.5 h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">Owner Address</p>
                          <p className="font-mono text-xs break-all">
                            {model.latestVersion.ownerAddress}
                          </p>
                        </div>
                      </div>
                    )}
                    {/* SHA256 */}
                    {model.latestVersion.sha256 && (
                      <div className="flex items-start gap-2">
                        <Hash className="mt-0.5 h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">SHA-256</p>
                          <p className="font-mono text-xs break-all text-muted-foreground">
                            {model.latestVersion.sha256}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
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
                        <p className="text-xs text-muted-foreground">Owner</p>
                        <p className="text-sm font-medium">{model.owner.username}</p>
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Dates */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        Published{' '}
                        {new Date(model.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Brain className="h-3.5 w-3.5" />
                      <span>
                        Updated{' '}
                        {new Date(model.updatedAt).toLocaleDateString('en-US', {
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
                      Upload New Version
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
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
