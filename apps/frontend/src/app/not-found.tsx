import Link from 'next/link';
import { Home, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative flex flex-col items-center gap-4">
        <p className="text-8xl font-bold text-gradient">404</p>
        <h1 className="text-2xl font-semibold tracking-tight">Sayfa bulunamadı</h1>
        <p className="max-w-sm text-muted-foreground">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>

        <div className="mt-2 flex gap-3">
          <Button asChild>
            <Link href={ROUTES.HOME}>
              <Home className="mr-2 h-4 w-4" />
              Ana Sayfaya Dön
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={ROUTES.MARKETPLACE}>
              <Search className="mr-2 h-4 w-4" />
              Pazarı Keşfet
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
