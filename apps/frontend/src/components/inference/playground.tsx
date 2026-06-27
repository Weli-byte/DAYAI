'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ConnectWalletButton } from '@/components/wallet/connect-wallet-button';
import { useWalletStore } from '@/store/wallet.store';
import { useRunInference } from '@/hooks/use-inference';
import { InferenceResultCard } from './inference-result-card';
import { Sparkles, Brain, Play, Loader2, AlertCircle, Sliders } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface PlaygroundProps {
  modelId: string;
  modelTitle: string;
}

export function Playground({ modelId, modelTitle }: PlaygroundProps) {
  const { address, isConnected } = useWalletStore();
  const runMutation = useRunInference();

  const [prompt, setPrompt] = useState('');
  const [maxTokens, setMaxTokens] = useState(200);
  const [temperature, setTemperature] = useState(0.7);
  const [showParams, setShowParams] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !isConnected || !address) return;

    try {
      await runMutation.mutateAsync({
        modelId,
        prompt: prompt.trim(),
        maxTokens,
        temperature,
        walletAddress: address,
      });
    } catch {
      // Handled by toast/mutation states
    }
  };

  const isRunning = runMutation.isPending;

  return (
    <div className="space-y-6">
      <Card className="border-primary/10 shadow-lg shadow-primary/5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <Brain className="h-5 w-5 text-primary" />
              YZ Deneme Alanı
            </CardTitle>
            <CardDescription>
              <span className="font-semibold text-foreground">{modelTitle}</span> modelini doğrudan
              tarayıcınızdan test edin ve çalıştırın.
            </CardDescription>
          </div>
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            Aktif
          </span>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isConnected ? (
            <Alert variant="warning" className="border-amber-500/20 bg-amber-500/5">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertTitle>Cüzdan Bağlantısı Gerekli</AlertTitle>
              <AlertDescription className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span>Bu YZ modeli ile etkileşime geçmek için MetaMask cüzdanınızı bağlayın.</span>
                <ConnectWalletButton />
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Prompt Textarea */}
              <div className="space-y-2">
                <Label htmlFor="prompt" className="text-sm font-medium">
                  Sorgu (Prompt)
                </Label>
                <div className="relative">
                  <Textarea
                    id="prompt"
                    placeholder="Sorgunuzu buraya girin..."
                    className="min-h-[120px] resize-none pr-10 focus-visible:ring-primary"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isRunning}
                  />
                  {prompt && (
                    <span className="absolute bottom-2.5 right-3 text-xs text-muted-foreground">
                      {prompt.length}/5000
                    </span>
                  )}
                </div>
              </div>

              {/* Param Toggle */}
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowParams(!showParams)}
                  className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <Sliders className="h-3.5 w-3.5" />
                  {showParams ? 'Parametreleri gizle' : 'Parametreleri göster'}
                </Button>
              </div>

              {/* Params panel */}
              {showParams && (
                <Card className="border-border/50 bg-muted/30">
                  <CardContent className="grid gap-6 p-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="max-tokens" className="text-xs font-medium">
                          Maks Token
                        </Label>
                        <span className="font-mono text-xs font-semibold text-muted-foreground">
                          {maxTokens}
                        </span>
                      </div>
                      <input
                        id="max-tokens"
                        type="range"
                        min="1"
                        max="1024"
                        value={maxTokens}
                        onChange={(e) => setMaxTokens(parseInt(e.target.value, 10))}
                        disabled={isRunning}
                        className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-secondary accent-primary"
                      />
                      <span className="text-[10px] text-muted-foreground block">
                        Üretilen çıktının maksimum uzunluğu.
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="temperature" className="text-xs font-medium">
                          Sıcaklık
                        </Label>
                        <span className="font-mono text-xs font-semibold text-muted-foreground">
                          {temperature.toFixed(1)}
                        </span>
                      </div>
                      <input
                        id="temperature"
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={temperature}
                        onChange={(e) => setTemperature(parseFloat(e.target.value))}
                        disabled={isRunning}
                        className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-secondary accent-primary"
                      />
                      <span className="text-[10px] text-muted-foreground block">
                        Rastgeleliği kontrol eder: yüksek değerler yaratıcılığı artırır.
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Submit button */}
              <Button
                type="submit"
                className="w-full gap-2 shadow-sm font-semibold"
                disabled={isRunning || !prompt.trim()}
              >
                {isRunning ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Yanıt üretiliyor...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-current" />
                    Modeli Çalıştır
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Inference error alert */}
      {runMutation.isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Üretim Başarısız</AlertTitle>
          <AlertDescription>
            {runMutation.error instanceof Error
              ? runMutation.error.message
              : 'Çıkarım sırasında bir hata oluştu. YZ servisi çalışıyor mu kontrol edin.'}
          </AlertDescription>
        </Alert>
      )}

      {/* Result Display */}
      {runMutation.data && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold flex items-center gap-1.5 text-muted-foreground pl-1">
            <Sparkles className="h-4 w-4 text-emerald-500" />
            Üretim sonucu
          </h3>
          <InferenceResultCard result={runMutation.data} />
        </div>
      )}
    </div>
  );
}
