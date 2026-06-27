'use client';

import { useProfile } from '@/hooks/use-trust';
import { useModels } from '@/hooks/use-models';
import { ModelCard } from '@/components/models/model-card';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Globe, Twitter, Github, Wallet, Package, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';

export default function CreatorProfilePage() {
  const params = useParams();
  const userId = params.userId as string;

  const { data: profileData, isLoading: profileLoading } = useProfile(userId);
  const { data: modelsData, isLoading: modelsLoading } = useModels({ limit: 100 });

  const publishedModels = (modelsData?.data || []).filter(
    (model) => model.owner?.id === userId && model.status === 'PUBLISHED',
  );

  const profile = profileData?.profile;

  return (
    <div className="space-y-8">
      {/* Back to Marketplace */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild className="gap-1.5">
          <Link href="/marketplace">
            <ArrowLeft className="h-4 w-4" /> Back to Marketplace
          </Link>
        </Button>
      </div>

      {/* Profile Info Header */}
      <Card className="overflow-hidden border-primary/10">
        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
          {/* Avatar */}
          <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-primary/10 flex items-center justify-center font-bold text-2xl md:text-3xl text-primary shrink-0 overflow-hidden">
            {profileData?.avatar ? (
              <div
                style={{ backgroundImage: `url(${profileData.avatar})` }}
                className="h-full w-full bg-cover bg-center"
              />
            ) : (
              profileData?.username.substring(0, 2).toUpperCase() || 'CR'
            )}
          </div>

          {/* Details */}
          <div className="space-y-4 flex-1">
            <div className="space-y-1.5">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                {profile?.fullName || profileData?.username || 'Creator Profile'}
              </h1>
              <p className="text-sm text-muted-foreground font-mono">
                @{profileData?.username || 'creator'}
              </p>
            </div>

            {profileData?.bio && (
              <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                {profileData.bio}
              </p>
            )}

            {/* Socials & Wallet */}
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              {profile?.walletAddress && (
                <div className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-full font-mono text-[11px]">
                  <Wallet className="h-3.5 w-3.5 text-primary" />
                  {profile.walletAddress}
                </div>
              )}
              {profile?.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                >
                  <Globe className="h-3.5 w-3.5 text-primary" /> Website
                </a>
              )}
              {profile?.twitter && (
                <a
                  href={profile.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                >
                  <Twitter className="h-3.5 w-3.5 text-primary" /> Twitter
                </a>
              )}
              {profile?.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                >
                  <Github className="h-3.5 w-3.5 text-primary" /> GitHub
                </a>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Published Models List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" /> Published Models ({publishedModels.length})
        </h3>

        {modelsLoading || profileLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-60 rounded-xl border bg-card p-4 space-y-3">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-8 w-1/4" />
              </div>
            ))}
          </div>
        ) : publishedModels.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {publishedModels.map((model) => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center text-muted-foreground flex flex-col items-center gap-2">
              <Package className="h-8 w-8 opacity-35" />
              <p className="text-sm font-semibold">No models published</p>
              <p className="text-xs">
                This creator hasn't published any models on the marketplace yet.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
