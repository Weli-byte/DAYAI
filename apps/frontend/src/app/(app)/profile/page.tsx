import type { Metadata } from 'next';
import { User, Wallet, Star, Award } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Your decentralized AI marketplace profile.',
};

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <User className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profil</h1>
          <p className="text-sm text-muted-foreground">
            Pazar yeri kimliğiniz ve zincir üstü aktiviteniz
          </p>
        </div>
      </div>

      {/* Profile card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-xl">?</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                <Skeleton className="mx-auto h-6 w-32 sm:mx-0" />
                <Badge variant="outline" className="mx-auto w-fit sm:mx-0">
                  <Wallet className="mr-1 h-3 w-3" />
                  Cüzdan bağlı değil
                </Badge>
              </div>
              <Skeleton className="mx-auto mt-2 h-4 w-48 sm:mx-0" />
              <div className="mt-3 flex flex-wrap justify-center gap-4 sm:justify-start">
                {[
                  { icon: Star, label: 'İtibar' },
                  { icon: Award, label: 'Katkılar' },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}:</span>
                    <Skeleton className="h-4 w-8" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity tabs */}
      <Tabs defaultValue="models">
        <TabsList>
          <TabsTrigger value="models">Modellerim</TabsTrigger>
          <TabsTrigger value="contributions">Katkılarım</TabsTrigger>
          <TabsTrigger value="purchases">Satın Alımlarım</TabsTrigger>
        </TabsList>
        <TabsContent value="models" className="mt-4">
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="contributions" className="mt-4">
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="purchases" className="mt-4">
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
