import type { Metadata } from 'next';
import { Settings, Bell, Shield, Palette, Wallet } from 'lucide-react';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your account preferences and notification settings.',
};

const settingSections = [
  {
    icon: Palette,
    title: 'Görünüm',
    description: 'Tema, dil ve görüntüleme tercihlerini özelleştirin.',
    badge: 'Mevcut',
  },
  {
    icon: Bell,
    title: 'Bildirimler',
    description: 'Model satın alımları, katkılar ve DAO oyları için uyarıları yapılandırın.',
    badge: 'Sprint 3',
  },
  {
    icon: Wallet,
    title: 'Cüzdan & Güvenlik',
    description: 'Bağlı cüzdanları ve işlem imzalama tercihlerini yönetin.',
    badge: 'Sprint 5',
  },
  {
    icon: Shield,
    title: 'Gizlilik',
    description: 'Genel profilinizde hangi zincir üstü aktivitenin görüneceğini kontrol edin.',
    badge: 'Sprint 5',
  },
];

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Settings className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ayarlar</h1>
          <p className="text-sm text-muted-foreground">
            Tercihlerinizi ve hesap yapılandırmanızı yönetin
          </p>
        </div>
      </div>

      {/* Setting sections */}
      <div className="space-y-4">
        {settingSections.map((section, index) => (
          <div key={section.title}>
            <Card className="cursor-pointer transition-colors hover:bg-muted/40">
              <CardHeader className="flex flex-row items-center gap-4 py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <section.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-sm">{section.title}</CardTitle>
                    <Badge
                      variant={section.badge === 'Available' ? 'default' : 'outline'}
                      className="text-xs"
                    >
                      {section.badge}
                    </Badge>
                  </div>
                  <CardDescription className="mt-0.5 text-xs">
                    {section.description}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
            {index < settingSections.length - 1 && <Separator className="my-1 opacity-0" />}
          </div>
        ))}
      </div>
    </div>
  );
}
