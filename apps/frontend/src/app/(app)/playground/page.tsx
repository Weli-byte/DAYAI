'use client';

import { useWalletStore } from '@/store/wallet.store';
import { ConnectWalletButton } from '@/components/wallet/connect-wallet-button';
import { InferenceHistory } from '@/components/inference/inference-history';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Wallet } from 'lucide-react';

export default function DedicatedPlaygroundPage() {
  const { address, isConnected } = useWalletStore();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          Deneme Alanı Geçmişi
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Son YZ modeli çalıştırmalarınızı ve üretim geçmişinizi görüntüleyin.
        </p>
      </div>

      {!isConnected ? (
        <Card className="border-amber-500/20 bg-amber-500/5 p-8 text-center">
          <CardContent className="flex flex-col items-center justify-center p-0 space-y-4">
            <div className="rounded-full bg-amber-500/10 p-3">
              <Wallet className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">Cüzdan Bağlantısı Gerekli</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Kişisel YZ deneme alanı geçmişinizi görüntülemek için MetaMask cüzdanınızı bağlayın.
              </p>
            </div>
            <ConnectWalletButton />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <InferenceHistory walletAddress={address!} />
        </div>
      )}
    </div>
  );
}
